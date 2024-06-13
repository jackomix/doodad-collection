import Doodad from "../../js/doodad.js";

// define the doodad, "fortune_cookie" by me -- jackomix
let doodad = new Doodad({
    codename: "inventory",
    nickname: "Inventory",
    author: "jackomix",
    description: "Look at all the goodies you've collected over the days!",
    emoji: "📦🏠",
    isObtainable: false,
    autoObtained: true,
});

doodad.HTML = `
<style>
    ${doodad.cssPrefix} .wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        height: 100%;
    }

    ${doodad.cssPrefix} .categorySelection {
        display: flex;
        gap: 0.5em;
        justify-content: stretch;
        height: 10%;
        flex-shrink: 0;
    }

    ${doodad.cssPrefix} .categorySelection button {
        padding: 0.5em 1em;
        border: none;
        background: var(--background-color);
        cursor: pointer;
        flex-grow: 1;
        outline: 1px solid var(--active-color);
        position: relative;
    }

    ${doodad.cssPrefix} .categorySelection button.active::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        clip-path: polygon(0% 0%, 0% 100%, 6px 100%, 6px 6px, calc(100% - 6px) 6px, calc(100% - 6px) calc(100% - 6px), 6px calc(100% - 6px), 6px 100%, 100% 100%, 100% 0%);
        background: linear-gradient(45deg, 
            var(--active-color) 5%, 
            transparent 5%, 
            transparent 50%, 
            var(--active-color) 50%, 
            var(--active-color) 55%, 
            transparent 55%, 
            transparent 100%);
        background-size: 15px 15px;
        transition: clip-path 0.3s ease;
    }

    ${doodad.cssPrefix} .grid {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        gap: 1px;
        overflow-x: hidden;
        overflow-y: scroll;
        outline: 1px solid var(--active-color);
        flex-grow: 1;
    }

    ${doodad.cssPrefix} .item {
        background-color: var(--background-color);
        outline: 1px solid var(--active-color);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(25% - 1px);
        aspect-ratio: 1/1;
        font-size: 1.25rem;
        white-space: nowrap;
    }

    ${doodad.cssPrefix} .item:hover {
        animation: ${doodad.namespace}_wiggle infinite 0.25s;
    }

    @keyframes ${doodad.namespace}_wiggle {
        0% {transform: rotate(0deg);}
        25% {transform: rotate(5deg);}
        50% {transform: rotate(0deg);}
        75% {transform: rotate(-5deg);}
        100% {transform: rotate(0deg);}
    }

    ${doodad.cssPrefix} .info {
        background-color: var(--active-color);
        outline: 1px solid var(--active-color);
        white-space: nowrap;
        overflow: hidden;
        height: 1.5rem;
        flex-shrink: 0;
    }

    ${doodad.cssPrefix} .info p {
        color: var(--background-color);
        line-height: 1.5rem;
        animation: ${doodad.namespace}_marquee 5s linear infinite;
    }

    ${doodad.cssPrefix} #infoText {
        width: fit-content;
        display: inline-block;
        white-space:nowrap;
        will-change: transform;
        padding-left: 100%;
    }

    @keyframes ${doodad.namespace}_marquee {
        0% {
            transform: translateX(0%);
        }
        100% {
            transform: translateX(-100%);
        }
    }

</style>

<div class="wrapper">
    <div class="categorySelection">
        <button value="goodies">Goodies</button>
        <button value="doodads">Doodads</button>
    </div>
    <div class="grid" id="goodies"></div>
    <div class="grid" id="doodads"></div>
    <div class="info"><p id="infoText">inventory woohoo!!</p></div>
</div>
`;

function inventoryUpdateDoodad() {
    const goodies = doodad.e("#goodies");
    const doodads = doodad.e("#doodads");

    goodies.innerHTML = "";
    doodads.innerHTML = "";

    const defaultInfoText = "inventory woohoo!! asdiasdasioudhaspiudhasiudhasiudhsaiudhaiudhu";

    const appendItem = (item, container) => {
        if (category === "doodads") {
            var itemDatabase = getDoodad(item.namespace);
        } else {
            var itemDatabase = item;
        }
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.innerHTML = itemDatabase.emoji;

        itemElement.addEventListener("mouseenter", function () {
            updateInfoText(`<b>${itemDatabase.nickname}</b> | ${itemDatabase.description} | <i>${item.sourceText}</i>`);
        });

        itemElement.addEventListener("mouseleave", function () {
            updateInfoText(defaultInfoText);
        });

        container.appendChild(itemElement);
    };

    var category;
    for (category in inventory) {
        if (Array.isArray(inventory[category])) {
            inventory[category].forEach(item => appendItem(item, doodad.e("#" + category)));
        }
    }
}

function updateInfoText(text) {
    doodad.e("#infoText").innerHTML = text;
    const animationDuration = doodad.e("#infoText").offsetWidth / 200; // adjust the division factor to control the animation speed
    doodad.e("#infoText").style.animation = "none";
    window.requestAnimationFrame(() => {
        doodad.e("#infoText").style.animation = `${doodad.namespace}_marquee ${animationDuration}s linear infinite`;
    });
};

doodad.onLoad = function () {
    const categorySelection = doodad.e(".categorySelection");
    const goodies = doodad.e("#goodies");
    const doodads = doodad.e("#doodads");

    let currentCategory = "goodies";

    function switchCategory(category) {
        if (category === "goodies") {
            goodies.style.display = "flex";
            doodads.style.display = "none";
        } else {
            goodies.style.display = "none";
            doodads.style.display = "flex";
        }
    }

    categorySelection.addEventListener("click", function (event) {
        currentCategory = event.target.value;

        const buttons = categorySelection.querySelectorAll("button");
        buttons.forEach((button) => button.classList.remove("active"));
        event.target.classList.add("active");

        switchCategory(currentCategory);
    });

    const onLoadButton = categorySelection.querySelector("button[value='" + currentCategory + "']");
    onLoadButton.classList.add("active");
    switchCategory(currentCategory);

    inventoryUpdateDoodad();
}

doodad.ready();