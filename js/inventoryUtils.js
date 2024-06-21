function getDoodad(namespace) {
    return database.doodads.find(doodad => doodad.namespace === namespace);
}

function getRandomDoodad() {
    return database.doodads.filter(
        doodad => doodad.namespace === namespace && 
        doodad.isObtainable
    )[Math.floor(Math.random() * database.doodads.length)];
}

function inventoryGetDoodad(namespace) {
    return inventory.doodads.find(doodad => doodad.namespace === namespace);
}


function inventoryAddDoodad(namespace, sourceText="Obtained from thin air") {
    const doodad = getDoodad(namespace);
    if (!doodad) {
        console.error("Failed to add non-existing doodad: ", namespace);
        return;
    };

    if (!inventory.doodads) {
        inventory.doodads = [];
    }
    inventory.doodads.push({
        namespace: doodad.namespace,
        timeObtained: Date.now(),
        sourceText: sourceText,
        hidden: false,
    });
}

function inventoryDeleteItem(namespace) {
    inventory.doodads = inventory.doodads.filter(doodad => doodad.namespace !== namespace);

    const doodadElement = document.getElementById("doodad_" + namespace);
    if (doodadElement) doodadElement.remove();
}

function inventoryAddGoodie(contents, name, description, type, subtype, emoji, sourceText="Obtained from thin air") {
    if (!inventory.goodies) {
        inventory.goodies = [];
    }
    inventory.goodies.push({
        name: name,
        contents: contents,
        type: type,
        subtype: subtype,
        emoji: emoji,
        timeObtained: Date.now(),
        sourceText: sourceText,
        id: name + "_" + Date.now(),
    });
}

function filterGoodiesByType(type) {
    return inventory.goodies.filter(goodie => goodie.type === type);
}