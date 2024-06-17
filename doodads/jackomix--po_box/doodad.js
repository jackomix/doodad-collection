import Doodad from "../../js/doodad.js";

// define the doodad, "fortune_cookie" by me -- jackomix
let doodad = new Doodad({
    codename: "po_box",
    nickname: "P.O. Box",
    author: "jackomix",
    description: "A place where mail can magically show up",
    emoji: "📬🎁",
    isObtainable: false,
    autoObtained: true,
});

// here's our doodad's html code
doodad.HTML = `
<style>
    ${doodad.cssPrefix} .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }   

    ${doodad.cssPrefix} .grid {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        flex-grow: 1;
    }

    ${doodad.cssPrefix} .item {
        outline: 1px solid var(--active-color);
        border-radius: 15%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(25% - 1px);
        aspect-ratio: 1/1;
        font-size: 2rem;
        animation: ${doodad.namespace}_wiggle 2s ease-out infinite;
        transition: transform 0.5s;
    }
    ${doodad.cssPrefix} .item:nth-child(even) { animation-delay: 0.1s; }
    ${doodad.cssPrefix} .item:nth-child(odd) { animation-delay: 0.3s; }
    ${doodad.cssPrefix} .item:nth-child(1) { animation-delay: 0s; }
    ${doodad.cssPrefix} .item:nth-child(2) { animation-delay: 0.4s; }
    ${doodad.cssPrefix} .item:nth-child(3) { animation-delay: 0.87s; }
    ${doodad.cssPrefix} .item:nth-child(4) { animation-delay: 1.24s; }
    ${doodad.cssPrefix} .item:nth-child(5) { animation-delay: 2.31s; }

    @keyframes ${doodad.namespace}_wiggle {
        0% {transform: rotate(0deg);}
        25% {transform: rotate(5deg);}
        50% {transform: rotate(0deg);}
        75% {transform: rotate(-5deg);}
        100% {transform: rotate(0deg);}
    }

    ${doodad.cssPrefix} .item:hover {
        transform: scale(1.1);
    }
</style>

<div class="wrapper">
    <div class="grid">
        <div class="item">📦</div>
        <div class="item">🎁</div>
        <div class="item">💌</div>
        <div class="item">🎫</div>
    </div>
</div>
`;

/*
have an array of objects that contain the timestamp of the gifts (including their date).
have a command that every 30 seconds checks if any timestamps have passed. if so we check if it's already in the p.o. box array.
if not we add it and use a function to display the gift.

types of goodies:
- writing
    - poems
    - stories
    - letters
    - conversations
- pictures
   - photos
   - drawings
   - comics
- music (tunes)
- themes
- items
   - Gift Ticket (makes codes you can send to a friend to unlock a gift)
   - Envelope (lets you write a letter you send as a code to a friend)
   - 
*/

/* pobox structure:
            pobox = [
                {
                    timestamp: 123456789,
                    type: "goodie",
                }
            ]
            */

doodad.onReset = function () {
    // try to doodad.get "timestamps" if it doesn't exist, create it
    let timestamps = doodad.get("timestamps");
    if (!timestamps) {
        timestamps = [];
        doodad.set("timestamps", timestamps);
    }

    // looping daysSinceLastVisit times, generate timestamps for each day
    for (let i = 1; i <= daysSinceLastVisit; i++) {
        let date = new Date(new Date().getTime() - i * 86400000);
        timestamps.push(generateTimestamps(date));
    }
    // organize timestamps in order from earliest to latest (to make it more efficient to check for gifts)
    timestamps.sort((a, b) => a - b);

    doodad.set("timestamps", timestamps);
}

function generateTimestamps(date) {
    // get the number of gifts that will be given today
    let randomPercentNumGifts = doodad.random("randomPercentNumGifts", 0, 100, date);

    if (daysSinceStart < 2) { randomPercent += 20; } // increase the chance of gifts in the first two days

    switch (true) {
        case randomPercentNumGifts >= 0: numberOfGiftsToday = 0; break; // 0-30   = 0 gifts today = 30% chance
        case randomPercentNumGifts > 30: numberOfGiftsToday = 1; break; // 31-60  = 1 gift today  = 30% chance
        case randomPercentNumGifts > 60: numberOfGiftsToday = 2; break; // 61-80  = 2 gifts today = 20% chance
        case randomPercentNumGifts > 80: numberOfGiftsToday = 3; break; // 81-90  = 3 gifts today = 10% chance
        case randomPercentNumGifts > 90: numberOfGiftsToday = 4; break; // 91-95  = 4 gifts today = 5% chance
        case randomPercentNumGifts > 95: numberOfGiftsToday = 5; break; // 96-100 = 5 gifts today = 5% chance
    }

    let currentTimestamps = [];
    for (let i = 0; i < numberOfGiftsToday; i++) {
        let giftTimestamp = doodad.randomTimestamp("giftTimestamp" + i, "00:00:00", "23:59:59", date);
        currentTimestamps.push(giftTimestamp);
    }
    
    return timestamps;
}

function checkForGifts() {
    let pobox = doodad.get("pobox");
    let timestamps = doodad.get("timestamps");

    // go through the timestamps array and check if any of them have passed
    for (let i = 0; i < timestamps.length; i++) {
        if (Date.now() > timestamps[i]) {
            // check if it's already in the pobox
            let alreadyInPobox = false;
            for (let j = 0; j < pobox.length; j++) {
                if (pobox[j].timestamp === timestamps[i]) {
                    alreadyInPobox = true;
                    break;
                }
            }
            // if it's not in the pobox, add it
            if (!alreadyInPobox) {
                timestamps.splice(i, 1);
                doodad.set("timestamps", timestamps);

                addGift(i, timestamps[i]);
            }
        } else {
            // if we're not past the current timestamp, we can break the loop since the timestamps are in order
            break;
        }
    }
}

function addGift(giftNumber, timestamp) {
    // first we determine the type of gift
    let randomPercentGiftType = doodad.random("randomPercentGiftCategory_" + giftNumber, 0, 100);

    let giftType = "";

    switch (true) {
        case randomPercentGiftType >= 0:  giftType = "goodie"; // 0-25   = goodie  = 25% chance
        case randomPercentGiftType > 75: giftType = "doodad"; // 76-100 = doodad = 25% chance
    }

    randomPercentGiftType = doodad.random("randomPercentGiftType" + i, 0, 100);
    switch (true && giftType === "goodie") {
        case randomPercentGiftType >= 0:  giftType = "writing"; // 0-25   = writing  = 25% chance
        case randomPercentGiftType > 25: giftType = "pictures"; // 26-50  = pictures = 25% chance
        case randomPercentGiftType > 50: giftType = "music"; // 51-70  = music = 20% chance
        case randomPercentGiftType > 70: giftType = "themes"; // 71-85  = themes = 15% chance
        case randomPercentGiftType > 85: giftType = "items"; // 86-95  = items = 10% chance
    }

    // then we add it to the pobox
    let pobox = doodad.get("pobox");
    pobox.push({ timestamp: timestamp, type: giftType });
}

doodad.onLoad = function () {
    // try to doodad.get "pobox" if it doesn't exist, create it
    let pobox = doodad.get("pobox");
    if (!pobox) {
        pobox = [];
        doodad.set("pobox", pobox);
    }

    let timestamps = doodad.get("timestamps");

    // check for gifts every 30 seconds
    setInterval(checkForGifts, 30000);
}

doodad.ready();