database.doodads = {
    "fortune_cookie": {
        emoji: "🥠🍀",
        name: "Fortune Cookie",
        description: "A cookie with a special fortune inside... What's inside!?",
        file: "fortune_cookie.js"
    },
}

// Check inventory.doodads for doodads that are in the inventory, if they are, add the file script to the #doodadScripts div
for (let doodad in inventory.doodads) {
    let doodadFile = database.doodads[doodad].file;
    let script = document.createElement('script');
    script.src = "./doodads/" + doodadFile;
    document.querySelector('#doodadScripts').appendChild(script);
}