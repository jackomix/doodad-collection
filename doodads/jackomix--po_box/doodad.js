import Doodad from "../../js/doodad.js";

// define the doodad, "fortune_cookie" by me -- jackomix
let doodad = new Doodad({
    codename: "po_box",
    nickname: "PO Box",
    author: "jackomix",
    description: "A place where mail can magically show up",
    emoji: "📦📬",
    isObtainable: false,
    autoObtained: true,
});

// here's our doodad's html code
doodad.HTML = `
<style>
    ${doodad.cssPrefix} .grid {
        display: flex;
        flex-wrap: wrap;
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
    ${doodad.cssPrefix} .item:nth-child(2) { animation-delay: 0.5s; }
    ${doodad.cssPrefix} .item:nth-child(3) { animation-delay: 1s; }
    ${doodad.cssPrefix} .item:nth-child(4) { animation-delay: 1.5s; }
    ${doodad.cssPrefix} .item:nth-child(5) { animation-delay: 2s; }

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

<div class="grid">
    <div class="item">📦</div>
    <div class="item">🎁</div>
    <div class="item">💌</div>
</div>
`;

doodad.onReset = function () {}

doodad.onLoad = function () {}