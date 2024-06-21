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
        cursor: pointer;
        user-select: none;
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5em;
        text-align: center;
        padding: 1em;
        flex-grow: 1;
    }
    ${doodad.cssPrefix} .closerLookInfo .item {
        bottom-margin: 2em;
        transform-style: preserve-3d;
    }
    ${doodad.cssPrefix} .closerLookInfo p {
        z-index: 1;
    }

    ${doodad.cssPrefix} .closerLookButtons {
        display: flex;
        gap: 1px;
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

    @keyframes ${doodad.namespace}_3dspin1 {
        0% {
            transform: rotate3d(1, 1, 1, 0deg);
        }
        100% {
            transform: rotate3d(1, 2, 1, 360deg);
        }
    }
    @keyframes ${doodad.namespace}_3dspin2 {
        0% {
            transform: rotate3d(1, 1, 1, 0deg);
        }
        100% {
            transform: rotate3d(2, 1, 1, 360deg);
        }
    }
    @keyframes ${doodad.namespace}_3dspin3 {
        0% {
            transform: rotate3d(1, 1, 1, 0deg);
        }
        100% {
            transform: rotate3d(1, -2, 1, 360deg);
        }
    }
    @keyframes ${doodad.namespace}_3dspin4 {
        0% {
            transform: rotate3d(1, 1, 1, 0deg);
        }
        100% {
            transform: rotate3d(-2, 1, 1, 360deg);
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
    <div class="info"><p id="infoText"></p></div>
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

    updateInfoText(item.sourceText);

    // if doodad, make a square with the emoji, and add a 3d spinning animation in all axis
    if (currentCategory === "doodads") {
        const iconElement = document.createElement("div");
        iconElement.classList.add("item");
        iconElement.innerHTML = itemDatabase.emoji;
        iconElement.style.animation = `${doodad.namespace}_3dspin${Math.floor(Math.random() * 4) + 1} 5s ease-in-out infinite`;
        iconElement.style.animationDelay = "-" + (Math.random()*10 + 1) + "s";
        iconElement.style.cursor = "default";
        iconElement.style.width = "8rem";
        iconElement.style.fontSize = "2rem";
        doodad.e(".closerLookInfo").appendChild(iconElement);
        // When the rotation completes, randomize the direction of the spin
        iconElement.addEventListener("animationiteration", () => {
            let newAnim, currAnim = getCurrentAnim(iconElement.style.animation);
            while ((newAnim = Math.floor(Math.random() * 4) + 1) === currAnim);
            iconElement.style.animation = `${doodad.namespace}_3dspin${newAnim} 5s ease-in-out infinite`;
        });
        
        const getCurrentAnim = (anim) => +(anim.match(/_3dspin(\d+)/) || [0, 0])[1];

        const nicknameElement = document.createElement("p");
        nicknameElement.innerHTML = `<b>${itemDatabase.nickname}</b>`;
        doodad.e(".closerLookInfo").appendChild(nicknameElement);

        const authorElement = document.createElement("p");
        authorElement.innerHTML = `by ${itemDatabase.author}`;
        authorElement.style.fontSize = "0.75rem";
        authorElement.style.marginTop = "-0.5em";
        doodad.e(".closerLookInfo").appendChild(authorElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.innerHTML = itemDatabase.description;
        doodad.e(".closerLookInfo").appendChild(descriptionElement);
    }

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
            inventoryDeleteItem(item.namespace);
            inventoryUpdateDoodad();
            closerLookCloseButton.click();
        } else {
            const remainingClicks = 5 - clickCount;
            deleteButton.innerText = `Click ${remainingClicks} time` + (remainingClicks === 1 ? "" : "s");
            const redness = Math.floor((clickCount / 5) * 100);
            deleteButton.style.background = `color-mix(in srgb, var(--red) ${redness}%, transparent)`;
        }
    });

    switch (item.namespace) {
        case doodad.namespace: // Hide the hide and delete buttons for the inventory
            hideButton.style.display = "none";
            deleteButton.style.display = "none";
            break;
        case "jackomix--po_box": // Hide the delete button for the po_box
            deleteButton.style.display = "none";
            break;
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
        itemElement.dataset.namespace = item.namespace; // Add the namespace as a data attribute

        itemElement.addEventListener("mouseenter", function () {
            updateInfoText(`<b style="color: var(--yellow);">${itemDatabase.nickname}</b> | ${itemDatabase.description}`);
        });

        itemElement.addEventListener("mouseleave", function () {
            if (!doodad.e(".closerLook").style.display || doodad.e(".closerLook").style.display === "none") {
                updateInfoText(defaultInfoText);
            }
        });

        itemElement.addEventListener("click", function () {
            closerLook(item, itemDatabase);
        });

        itemElement.draggable = true;

        itemElement.addEventListener("dragstart", function (event) {
            itemElement.classList.add("dragging");
            event.dataTransfer.setData("text/plain", itemElement.dataset.namespace);
        });

        itemElement.addEventListener("dragover", function (event) {
            event.preventDefault();
            const rect = itemElement.getBoundingClientRect();
            const mouseX = event.clientX;
            const itemCenter = rect.left + rect.width / 2;
            const isLeft = mouseX < itemCenter;

            if (isLeft) {
            itemElement.style.borderLeft = "3px solid var(--green)";
            itemElement.style.borderRight = "none";
            } else {
            itemElement.style.borderRight = "3px solid var(--green)";
            itemElement.style.borderLeft = "none";
            }
        });

        itemElement.addEventListener("dragleave", function (event) {
            event.preventDefault();
            itemElement.style.borderLeft = "none";
            itemElement.style.borderRight = "none";
        });

        itemElement.addEventListener("drop", function (event) {
            event.preventDefault();
            itemElement.classList.remove("dragging");
            const draggedItemNamespace = event.dataTransfer.getData("text/plain");
            const draggedItem = inventory[currentCategory].find(item => item.namespace === draggedItemNamespace);
            const targetItemNamespace = itemElement.dataset.namespace;
            const targetItem = inventory[currentCategory].find(item => item.namespace === targetItemNamespace);
            const draggedItemIndex = inventory[currentCategory].indexOf(draggedItem);
            const targetItemIndex = inventory[currentCategory].indexOf(targetItem);

            // If the dragged item is dropped onto itself, do nothing
            if (draggedItemNamespace === targetItemNamespace) {
                // Sometimes the border stays, so remove it here
                itemElement.style.borderLeft = "none";
                itemElement.style.borderRight = "none";
                return;
            }

            // Check which side of the targetItem the mouse was on
            const rect = itemElement.getBoundingClientRect();
            const mouseX = event.clientX;
            const itemCenter = rect.left + rect.width / 2;
            const isLeft = mouseX < itemCenter;

            // If the dragged item is the first or last, and is dropped on 2nd or 2nd last on the left or right side, do nothing
            if ((draggedItemIndex === 0 && 
                targetItemIndex === 1) &&
                isLeft || 

                (draggedItemIndex === inventory[currentCategory].length - 1 && 
                targetItemIndex === inventory[currentCategory].length - 2) &&
                !isLeft)
            {
                    return;
            }

            // Determine the index to insert the dragged item
            let insertIndex;
            if (isLeft) {
                insertIndex = targetItemIndex;
            } else {
                insertIndex = targetItemIndex + 1; // this was + 1 but had issues. check later if this is correct
            }

            // Remove the dragged item from its original position
            inventory[currentCategory].splice(draggedItemIndex, 1);

            // Insert the dragged item at the new position
            inventory[currentCategory].splice(insertIndex, 0, draggedItem);

            inventoryUpdateDoodad();

            // Update the order of the actual doodad divs outside of this doodad by iterating through them and moving them to the correct position
            const draggedDoodadElement = document.querySelector(`#doodad_${draggedItemNamespace}`);
            const targetDoodadElement = document.querySelector(`#doodad_${targetItemNamespace}`);
            const containerElement = draggedDoodadElement.parentElement;

            if (isLeft) {
                containerElement.insertBefore(draggedDoodadElement, targetDoodadElement);
            } else {
                containerElement.insertBefore(draggedDoodadElement, targetDoodadElement.nextSibling);
            }

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

    updateInfoText(defaultInfoText);

    inventoryUpdateDoodad();
}

doodad.onInventoryUpdate = function () {
    inventoryUpdateDoodad();
}

doodad.ready();