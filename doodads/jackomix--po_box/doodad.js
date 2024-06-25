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
        white-space: nowrap;
        cursor: pointer;
        user-select: none;
        animation: ${doodad.namespace}_wiggle 2s ease-out infinite;
        transition: scale 0.15s cubic-bezier(0, 0, 0.2, 1);
    }
    
    /* Generate 10 rules for .items with random negative animation-delays, so they don't wiggle in unison */
    ${Array.from({ length: 10 }, (_, index) => `
        ${doodad.cssPrefix} .item:nth-child(${index + 1}n) {
            animation-delay: -${Math.random() * (Math.random() + 2)}s;
        }
    `).join('\n')}

    @keyframes ${doodad.namespace}_wiggle {
        0% {transform: rotate(0deg);}
        25% {transform: rotate(5deg);}
        50% {transform: rotate(0deg);}
        75% {transform: rotate(-5deg);}
        100% {transform: rotate(0deg);}
    }

    ${doodad.cssPrefix} .item:hover {
        scale: 1.2;
        animation-duration: 0.15s;
    }
</style>

<div class="wrapper">
    <div class="grid"></div>
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
    for (let i = 0; i <= daysSinceLastVisit; i++) {
        let date = new Date(new Date().getTime() - i * 86400000);
        timestamps = timestamps.concat(generateTimestamps(date));
    }
    // organize timestamps in order from earliest to latest (to make it more efficient to check for gifts)
    timestamps.sort((a, b) => a - b);

    doodad.set("timestamps", timestamps);
}

function generateTimestamps(date) {

    // get the number of gifts that will be given today
    let randomPercentNumGifts = doodad.random("randomPercentNumGifts", 0, 100, date);
    let numberOfGiftsToday = 0;

    if (daysSinceStart < 2) { randomPercentNumGifts = +randomPercentNumGifts + 20; } // increase the chance of gifts in the first two days
    if (daysSinceStart === 0) { randomPercentNumGifts = +randomPercentNumGifts + 10; } // increase the chance of gifts on the first day

    switch (true) {
        case randomPercentNumGifts > 95: numberOfGiftsToday = 5; break; // 96-100 = 5 gifts today = 5% chance
        case randomPercentNumGifts > 90: numberOfGiftsToday = 4; break; // 91-95  = 4 gifts today = 5% chance
        case randomPercentNumGifts > 80: numberOfGiftsToday = 3; break; // 81-90  = 3 gifts today = 10% chance
        case randomPercentNumGifts > 60: numberOfGiftsToday = 2; break; // 61-80  = 2 gifts today = 20% chance
        case randomPercentNumGifts > 30: numberOfGiftsToday = 1; break; // 31-60  = 1 gift today  = 30% chance
        case randomPercentNumGifts >= 0: numberOfGiftsToday = 0; break; // 0-30   = 0 gifts today = 30% chance
    }
    console.log("randomPercentNumGifts: " + randomPercentNumGifts);
    console.log("numberOfGiftsToday: " + numberOfGiftsToday);
    let currentTimestamps = [];
    for (let i = 0; i < numberOfGiftsToday; i++) {
        let giftTimestamp = doodad.randomTimestamp("giftTimestamp" + i, "00:00:00", "23:59:59", date);

        // check if the timestamp is already in the array, if it is, increment it by 1 until it's not
        while (currentTimestamps.includes(giftTimestamp)) {
            giftTimestamp = giftTimestamp + 1;
        }
        
        currentTimestamps.push(giftTimestamp);
    }
    
    return currentTimestamps;
}

function checkForGifts() {
    let pobox = doodad.get("pobox");
    let timestamps = doodad.get("timestamps");

    // go through the timestamps array and check if any of them have passed
    for (let i = 0; i < timestamps.length; i++) {
        if (Date.now() > new Date(timestamps[i]).getTime()) {
            console.log("timestamp passed!")

            // check if it's already in the pobox
            let alreadyInPobox = false;
            for (let j = 0; j < pobox.length; j++) {
                if (pobox[j].timestamp === timestamps[i]) {
                    alreadyInPobox = true;
                   
                    timestamps.splice(i, 1);
                    doodad.set("timestamps", timestamps);

                    break;
                }
            }
            // if it's not in the pobox, add it
            if (!alreadyInPobox) {
                addGift(i, timestamps[i]);

                timestamps.splice(i, 1);
                doodad.set("timestamps", timestamps);
            }
        } else {
            // if we're not past the current timestamp, we can break the loop since the timestamps are in order
            break;
        }
    }
}

function addGift(giftNumber, timestamp) {
    // first we determine the type of gift
    let randomPercentGiftType = doodad.random("randomPercentGiftCategory_" + giftNumber, 0, 100, timestamp);

    let giftType = "";

    switch (true) {
        case randomPercentGiftType >= 0: giftType = "goodie"; break; // 0-25   = goodie  = 25% chance
        case randomPercentGiftType > 75: giftType = "doodad"; break; // 76-100 = doodad = 25% chance
    }

    randomPercentGiftType = doodad.random("randomPercentGiftType" + giftNumber, 0, 100);
    switch (true && giftType === "goodie") {
        case randomPercentGiftType > 85: giftType = "item"; break; // 86-95  = item = 10% chance
        case randomPercentGiftType > 70: giftType = "theme"; break; // 71-85  = theme = 15% chance
        case randomPercentGiftType > 50: giftType = "music"; break; // 51-70  = music = 20% chance
        case randomPercentGiftType > 25: giftType = "image"; break; // 26-50  = image = 25% chance
        case randomPercentGiftType >= 0: giftType = "writing"; break; // 0-25   = writing  = 25% chance
    }

    // then we add it to the pobox
    let pobox = doodad.get("pobox");
    pobox.push({ timestamp: timestamp, type: giftType });
    doodad.set("pobox", pobox);

    console.log("added gift to pobox: " + giftType + " at " + timestamp);

    poboxUpdateDoodad();
}

function poboxUpdateDoodad() {
    // check the pobox for any doodads, if there are any that aren't already in the DOM, add them
    let pobox = doodad.get("pobox");

    let grid = doodad.e(".grid");

    if (pobox.length === 0) {
        grid.innerHTML = "<p>No gifts currently :(<br>Check later in the day!</p>";
        return;
    }

    for (let i = 0; i < pobox.length; i++) {
        // check if the item already exists in the grid
        let existingItem = grid.querySelector(`[data-timestamp="${pobox[i].timestamp}"][data-type="${pobox[i].type}"]`);
        if (existingItem) continue;

        // if it doesn't exist, create it
        let item = document.createElement("div");
        item.classList.add("item");
        item.innerHTML = "🎁";
        item.setAttribute("data-timestamp", pobox[i].timestamp);
        item.setAttribute("data-type", pobox[i].type);
        grid.appendChild(item);

        item.addEventListener("click", function () {
            openGift(pobox[i].timestamp, pobox[i].type);

            pobox.splice(i, 1);
            doodad.set("pobox", pobox);

            item.remove();
        });
    }
}

function openGift(timestamp, type) {
    let pobox = doodad.get("pobox");

    // insert code here lol
    // depending on the type of gift, we will run their respective generators
    // those generators will give us a subtype (like how pictures can be photos or drawings)
    // they will also give us an emoji, name, and description. all of this as an object.

    // inventoryAddGoodie("pobox", type, subtype, "🎁", "Received from P.O. Box");
}

doodad.onLoad = function () {
    // try to doodad.get "pobox" if it doesn't exist, create it
    let pobox = doodad.get("pobox");
    if (!pobox) {
        pobox = [];
        doodad.set("pobox", pobox);
        console.log("defining pobox")
    }

    let timestamps = doodad.get("timestamps");

    // check for gifts every 30 seconds
    setInterval(checkForGifts, 1000);

    poboxUpdateDoodad();

    console.log("--- pobox ---")
    console.log(pobox);
    console.log("--- timestamps ---")
    console.log(timestamps);
}

doodad.ready();