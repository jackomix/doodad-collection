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

    ${doodad.cssPrefix}  button {
        padding: 0.5em 1em;
        border: none;
        background: var(--background-color);
        cursor: pointer;
        flex-grow: 1;
        outline: 1px solid var(--active-color);
        position: relative;
    }

    ${doodad.cssPrefix} .categoryButton.active::before {
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

    ${doodad.cssPrefix} .closerLook {
        outline: 1px solid var(--active-color);
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    
    ${doodad.cssPrefix} .closerLookInfo {
        flex-grow: 1;
    }

    ${doodad.cssPrefix} .closerLookButtons {
        display: flex;
    }

    ${doodad.cssPrefix} .closerLookButtons button {
        padding: 0.5em 1em;
        border: none;
        cursor: pointer;
        outline: 1px solid var(--active-color);
        flex: 1 1 0px;
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
        <button class="categoryButton" value="goodies">Goodies</button>
        <button class="categoryButton" value="doodads">Doodads</button>
        <button id="closerLookClose" value="close">Close</button>
    </div>
    <div class="closerLook">
        <div class="closerLookInfo"></div>
        <div class="closerLookButtons"></div>
    </div>
    <div class="grid" id="goodies"></div>
    <div class="grid" id="doodads"></div>
    <div class="info"><p id="infoText">inventory woohoo!!</p></div>
</div>
`;

const defaultInfoText = "inventory woohoo!!";

function closerLook(item, itemDatabase) {
    const closerLookDiv = doodad.e(".closerLook");
    const closerLookCloseButton = doodad.e("#closerLookClose");

    const grids = doodad.eAll(".grid");
    grids.forEach((grid) => {
        grid.style.display = "none";
    });
    const buttons = doodad.eAll(".categorySelection button");
    buttons.forEach((button) => {
        if (button.id !== "closerLookClose") {
            button.style.display = "none";
        }
    });

    // Show the closerLook div and closerLookClose button
    closerLookDiv.style.display = "flex";
    closerLookCloseButton.style.display = "block";

    doodad.e(".closerLookInfo").innerHTML = "";
    doodad.e(".closerLookButtons").innerHTML = "";

    // Display info about the item
    const infoText = `${itemDatabase.description}`;
    updateInfoText(infoText);

    let hideButton;
    if (currentCategory === "goodies") {
        makeCloserLookButton("Use", function () {
            // Use the item
            //useItem(item, category);
        });
    } else if (currentCategory === "doodads") {
        let hideButtonName = item.hidden ? "Unhide" : "Hide";
        hideButton = makeCloserLookButton(hideButtonName, null);
        hideButton.addEventListener("click", function () {
            item.hidden = !item.hidden;
            itemDatabase.doIHide(item.hidden);

            // Rename the button to the opposite action
            hideButton.innerText = item.hidden ? "Unhide" : "Hide";
        });
    }

    // Handle the closerLookClose button
    closerLookCloseButton.addEventListener("click", function () {
        // Hide the closerLook div and closerLookClose button
        closerLookDiv.style.display = "none";
        closerLookCloseButton.style.display = "none";

        // Show the grid and category buttons
        buttons.forEach((button) => {
            if (button.id !== "closerLookClose") {
                button.style.display = "block";
            }
        });
        switchCategory(currentCategory);

        // Reset the info text
        updateInfoText(defaultInfoText);
    });

    // Add buttons for deleting and using the item
    let deleteButton = makeCloserLookButton("Delete", null);
    let clickCount = 0;
    deleteButton.addEventListener("click", function () {
        clickCount++;
        if (clickCount === 5) {
            // Delete the item
            // deleteItem(item, category);
            closerLookCloseButton.click();
        } else {
            const remainingClicks = 5 - clickCount;
            deleteButton.innerText = `Click ${remainingClicks} time` + (remainingClicks === 1 ? "" : "s");
            const redness = Math.floor((clickCount / 5) * 100);
            deleteButton.style.background = `color-mix(in srgb, var(--red) ${redness}%, transparent)`;
        }
    });

    // Disable hiding or deleting the inventory doodad
    if (item.namespace === doodad.namespace) {
        hideButton.style.display = "none";
        deleteButton.style.display = "none";
    }
}

function makeCloserLookButton(text, onClick) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", onClick);

    // If button is "Delete", make it slightly red
    if (text === "Delete") {
        button.style.background = "color-mix(in srgb, var(--red) 10%, transparent)";
    }

    doodad.e(".closerLookButtons").appendChild(button);
    
    return button;
}

function inventoryUpdateDoodad() {
    const goodies = doodad.e("#goodies");
    const doodads = doodad.e("#doodads");

    goodies.innerHTML = "";
    doodads.innerHTML = "";

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
            updateInfoText(`<b style="color: var(--yellow);">${itemDatabase.nickname}</b> | ${itemDatabase.description}`);
        });

        itemElement.addEventListener("mouseleave", function () {
            updateInfoText(defaultInfoText);
        });

        itemElement.addEventListener("click", function () {
            closerLook(item, itemDatabase);
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

function switchCategory(category) {
    if (!category) return;

    switch (category) {
        case "goodies":
            goodies.style.display = "flex";
            doodads.style.display = "none";
            break;
        case "doodads":
            goodies.style.display = "none";
            doodads.style.display = "flex";
            break;
    }

    const buttons = doodad.eAll(".categorySelection button");
    buttons.forEach((button) => {
        if (button.value === category) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

let currentCategory = "goodies";
doodad.onLoad = function () {
    const categorySelection = doodad.e(".categorySelection");
    const goodies = doodad.e("#goodies");
    const doodads = doodad.e("#doodads");

    doodad.e(".closerLook").style.display = "none";
    doodad.e("#closerLookClose").style.display = "none";

    doodad.eAll(".categorySelection button").forEach((button) => {
        if (button.id !== "closerLookClose") {
            button.addEventListener("click", function (event) {
                currentCategory = event.target.value;
                switchCategory(currentCategory);
            });
        }
    });

    const onLoadButton = categorySelection.querySelector("button[value='" + currentCategory + "']");
    onLoadButton.classList.add("active");
    switchCategory(currentCategory);

    inventoryUpdateDoodad();
}

doodad.ready();