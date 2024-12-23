// list of doodads to load. if you add a new doodad, add it here.
const doodadsToLoad = [
    "jackomix--fortune_cookie",
    "jackomix--inventory",
    "jackomix--po_box",
];
let doodadsLoaded = 0;

// string of the current date
let date = new Date().toISOString().slice(0, 10);

function userIDcheck() {
    let userID = localStorage.getItem("userID");

    if (!userID) {
        localStorage.setItem("userID", Math.random().toString(36).substr(2, 9));
        userID = localStorage.getItem("userID");

        localStorage.setItem("startDate", date);
    }

    return userID;
}
// userID is a string that is included in seeds for random generation
const userID = userIDcheck();

// date of the first visit to the site
let startDate = localStorage.getItem("startDate");
let daysSinceStart = Math.floor((Date.parse(new Date().toISOString().slice(0, 10)) - new Date(startDate)) / (1000 * 60 * 60 * 24));

// date of the last visit to the site
let lastKnownDate = localStorage.getItem("lastKnownDate");

// boolean that is true if the user has not visited the site today
let newDay = lastKnownDate !== date; 
localStorage.setItem("lastKnownDate", date)

let daysSinceLastVisit = 0;
if (lastKnownDate) {
    daysSinceLastVisit = Math.floor((Date.parse(new Date().toISOString().slice(0, 10)) - new Date(lastKnownDate)) / (1000 * 60 * 60 * 24));
}

// define database object
let database = {};

// load or define inventory object
let inventory = {doodads: [], goodies: []};
if (!localStorage.getItem("inventory")) {
    localStorage.setItem("inventory", JSON.stringify(inventory));
} else {
    inventory = JSON.parse(localStorage.getItem("inventory"));
}

function addDoodadsToDatabase() {
    doodadsToLoad.forEach((doodad) => {
        const script = document.createElement("script");
        script.src = `./doodads/${doodad}/doodad.js`;
        script.type = "module";
        document.head.appendChild(script);
    });
}
function moduleLoaded() {
    doodadsLoaded++;
    if (doodadsLoaded === doodadsToLoad.length) init();
}
function init() {
    console.log("%c" + database.doodads.length +" doodads loaded.", "color: #00ff00");
    console.log("%cLoaded doodads:", "color: #00ff00", database.doodads);

    if (!inventoryGetDoodad("jackomix--po_box")) inventoryAddDoodad("jackomix--po_box");
    if (!inventoryGetDoodad("jackomix--inventory")) inventoryAddDoodad("jackomix--inventory");
    if (!inventoryGetDoodad("jackomix--fortune_cookie")) inventoryAddDoodad("jackomix--fortune_cookie");
    localStorage.setItem("inventory", JSON.stringify(inventory));

    inventory = proxify(inventory, function(object, property, oldValue, newValue) {
        // trigger event inventoryUpdate
        const event = new CustomEvent("inventoryUpdate", {detail: {object, property, oldValue, newValue}});
        document.dispatchEvent(event);
    });

    inventory.doodads.forEach((doodad) => {
        getDoodad(doodad.namespace).load();
        
        getDoodad(doodad.namespace).doIHide(doodad.hidden);
    });
}

addDoodadsToDatabase();

// check if a new day has passed while this tab is open
setInterval(() => {
    date = new Date().toISOString().slice(0, 10);
    if (lastKnownDate !== date) {
        // if so, continiously wait until there's been 1 minute without any user interaction
        // we can use events like mousedown, mousemove, or keydown to check for user interaction
        let idleTimer = setTimeout(() => {
            location.reload();
        }, 60000);

        function resetIdleTimer() {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                location.reload();
            }, 60000);
        }

        window.addEventListener("mousedown", resetIdleTimer);
        window.addEventListener("mousemove", resetIdleTimer);
        window.addEventListener("keydown", resetIdleTimer);
    };
}, 60000);

/////////////////////////////////////////////////////

function debug_log() {
    console.log("--- debug statz ---");
    console.log("%cuserID: " + userID, "color: yellow");
    console.log("%cdate: " + date, "color: yellow");
    console.log("%cstartDate: " + startDate, "color: yellow");
    console.log("%cdaysSinceStart: " + daysSinceStart, "color: yellow");
    console.log("%clastKnownDate: " + lastKnownDate, "color: yellow");
    console.log("%cdaysSinceLastVisit: " + daysSinceLastVisit, "color: yellow")
    console.log("%cnewDay: " + newDay, "color: yellow");
}
debug_log();