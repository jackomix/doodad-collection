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

function inventoryAddGoodie(object, type, emoji, sourceText="Obtained from thin air") {
    if (!inventory.goodies) {
        inventory.goodies = [];
    }
    inventory.goodies.push({
        object: object,
        type: type,
        emoji: emoji,
        timeObtained: Date.now(),
        sourceText: sourceText
    });
}

function filterGoodiesByType(type) {
    return inventory.goodies.filter(goodie => goodie.type === type);
}