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
let daysSinceStart = Math.floor((new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24));

// date of the last visit to the site
lastKnownDate = localStorage.getItem("lastKnownDate"); 

// boolean that is true if the user has not visited the site today
let newDay = lastKnownDate !== date; 
localStorage.setItem("lastKnownDate", date)

// define database object
let database = {};

// load or define inventory object
if (!localStorage.getItem("inventory")) {
    localStorage.setItem("inventory", "{}");
}
inventory = JSON.parse(localStorage.getItem("inventory"));

/////////////////////////////////////////////////////

function debug_log() {
    console.log("%c--- debug statz ---", "color: yellow");
    console.log("%cuserID: " + userID, "color: yellow");
    console.log("%cdate: " + date, "color: yellow");
    console.log("%cstartDate: " + startDate, "color: yellow");
    console.log("%cdaysSinceStart: " + daysSinceStart, "color: yellow");
    console.log("%clastKnownDate: " + lastKnownDate, "color: yellow");
    console.log("%cnewDay: " + newDay, "color: yellow");
}
debug_log();