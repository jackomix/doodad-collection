import Doodad from "../../js/doodad.js";
import { cookieTaste, fortunes } from "./data.js";

// define the doodad with some properties
let doodad = new Doodad({
    codename: "fortune_cookie",
    nickname: "Fortune Cookie",
    author: "jackomix",
    description: "A cookie with a special fortune inside... Whats it say!?",
    emoji: "🥠🍀",
    isObtainable: true,
    showInInventory: false
});

// here's our doodad's html code
doodad.HTML = `
<style>
    ${doodad.cssPrefix} .cookie {
        filter: hue-rotate(${doodad.random("hue", -20, 20)}deg) brightness(${doodad.random("brightness", 0.85, 1.25)});
        transform: scaleX(${doodad.random("flip", 0, 1) < 0.5 ? "-1" : "1"});
    }

    ${doodad.cssPrefix} .cookie[data-upside-down="true"] {
        transform: scaleX(${doodad.random("flip", 0, 1) < 0.5 ? "-1" : "1"}) rotate(180deg);
    }

    ${doodad.cssPrefix} .cookie[data-rainbow="true"] {
        filter: hue-rotate(${doodad.random("hue", 0, 360)}deg);
    }

    ${doodad.cssPrefix} #taste[data-uppercase="true"] {
        text-transform: uppercase;
    }
</style>

<div class="centerHorizontally centerVertically">
    <p id="taste"></p>
    <p id="text"></p>
    <img src="${doodad.path}/img/cookie.png" class="cookie" id="unopenedCookie" style="cursor: pointer;">
    <img src="${doodad.path}/img/cookieopened.png" class="cookie" id="openedCookie">
</div>
`;

doodad.onReset = function () {
    doodad.set("cookieOpened", false);
}

doodad.onLoad = function () {
    if (doodad.get("cookieOpened") === false) {
        unopenedCookie();
    } else {
        openCookie();
    }

    doodad.e("#unopenedCookie").addEventListener("click", function () {
        if (doodad.get("cookieOpened") === false) {
            doodad.set("cookieOpened", true);
            openCookie();
        }
    });

    randomizeCookieVisual();

    function unopenedCookie() {
        doodad.e("#openedCookie").style.display = "none";
        doodad.e("#unopenedCookie").style.display = "inline-block";

        doodad.e("#taste").style.display = "none";
        doodad.e("#text").innerHTML = "You will find a fortune cookie in your future";
    }

    function openCookie() {
        doodad.e("#openedCookie").style.display = "inline-block";
        doodad.e("#unopenedCookie").style.display = "none";

        // randomize the description of the cookie
        const cookieName = ["cookie ", "treat "][doodad.random("cookieName", 0, 1)]
        const cookieIs = ["is ", "tastes ", "looks "][doodad.random("cookieIs", 0, 2)]
        const taste = cookieTaste[doodad.random("taste", 0, cookieTaste.length - 1)]
        const says = ["says:", "reads:"][doodad.random("says", 0, 1)]

        doodad.e("#taste").style.display = "block";
        doodad.e("#taste").innerHTML = "The " + cookieName + cookieIs + taste + ". It " + says;

        doodad.e("#text").innerHTML = fortunes[doodad.random("fortune", 0, fortunes.length - 1)];
        doodad.e("#text").style.color = "var(--blue)";
    }

    function randomizeCookieVisual() {
        // with a 1% chance, flip the cookie upside down
        if (doodad.random("upsideDown", 0, 100) < 2) {
            doodad.eAll(".cookie").forEach(cookie => {
                cookie.setAttribute("data-upside-down", "true");
            });
        }

        // with a 1% chance, set the hue to a random one between 0 and 360
        if (doodad.random("rainbow", 0, 100) < 2) {
            doodad.eAll(".cookie").forEach(cookie => {
                cookie.setAttribute("data-rainbow", "true");
            });
        }

        // with a 1% chance, set #taste to be all uppercase
        if (doodad.random("uppercase", 0, 100) < 2) {
            doodad.e("#taste").setAttribute("data-uppercase", "true");
        }
    }
}

doodad.ready();