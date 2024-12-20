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

function inventoryAddGoodie(goodie) {
    if (!inventory.goodies) {
        inventory.goodies = [];
    }
    inventory.goodies.push({
        name: goodie.name,
        contents: goodie.contents,
        type: goodie.type,
        subtype: goodie.subtype,
        emoji: goodie.emoji,
        timeObtained: Date.now(),
        sourceText: goodie.sourceText || "Obtained from thin air",
        id: goodie.name + "_" + Date.now(),
    });
}

function filterGoodiesByType(type) {
    return inventory.goodies.filter(goodie => goodie.type === type);
}