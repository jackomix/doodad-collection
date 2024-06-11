import Doodad from "../../js/doodad.js";

// define the doodad, "fortune_cookie" by me -- jackomix
let doodad = new Doodad({
    codename: "inventory",
    nickname: "Inventory",
    author: "jackomix",
    description: "Look at all the goodies you've collected over the days!",
    emoji: "📦🏠",
    isObtainable: false,
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
    }

    ${doodad.cssPrefix} .grid {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        gap: 1px;
        overflow-x: none;
        overflow-y: scroll;
        outline: 1px solid var(--active-color);
        flex-grow: 1;
    }

    ${doodad.cssPrefix} .item {
        outline: 1px solid var(--active-color);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(25% - 1px);
        aspect-ratio: 1/1;
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
        animation: inventory_marquee 5s linear infinite;
    }

    @keyframes inventory_marquee {
        0% {
            transform: translateX(100%);
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
    <div class="grid" id="goodies">
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
    </div>
    <div class="grid" id="doodads">
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
        <div class="item">AB</div>
    </div>
    <div class="info"><p id="infoText">inventory woohoo!!</p></div>
</div>
`;

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
}

doodad.load();