import Doodad from "../../js/doodad.js";

// define the doodad, "fortune_cookie" by me -- jackomix
let doodad = new Doodad({
    codename: "po_box",
    nickname: "PO Box",
    author: "jackomix",
    description: "A place where mail can magically show up",
    emoji: "📦📬",
    isObtainable: false,
});

// here's our doodad's html code
doodad.HTML = `
<style>
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
</style>

<div class="grid">
    <div class="item">📦</div>
    <div class="item">📦</div>
    <div class="item">📦</div>
</div>
`;

doodad.onReset = function () {}

doodad.onLoad = function () {}

doodad.load();