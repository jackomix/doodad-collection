// Functions for generating goodies

// --- General Generation ---

function goodieGenerate(type, sourceText) {
    let goodie = {};

    // inventory.goodies.push({
    //     name: goodie.name,
    //     contents: goodie.contents,
    //     type: goodie.type,
    //     subtype: goodie.subtype,
    //     emoji: goodie.emoji,
    //     timeObtained: Date.now(),
    //     sourceText: goodie.sourceText || "Obtained from thin air",
    //     id: goodie.name + "_" + Date.now(),
    // });

    switch (type) {
        case "item":  goodie = goodieGenerateItem();  break;
        case "theme": goodie = goodieGenerateTheme(); break;
        case "music": goodie = goodieGenerateMusic(); break;
        case "image": goodie = goodieGenerateImage(); break;
        case "text":  goodie = goodieGenerateText();  break;
        default: console.error("Invalid goodie type: ", type); return;
    }

    goodie.emoji = emojis[Math.floor(Math.random() * emojis.length)] + goodie.emoji;

    console.log(goodie)

    inventoryAddGoodie(goodie.contents, goodieGenerateName(),  goodieGenerateDescription(), type, goodie.subtype, goodie.emoji, sourceText)

    return goodie;
}
console.log(goodieGenerate("image", "Obtained from debuggin'"))
// --- Image Generation ---

function goodieGenerateImage() {
    let goodie = {};

    // pick a random subtype
    const subtypes = ["picture", "drawing"];
    goodie.subtype = subtypes[Math.floor(Math.random() * subtypes.length)];

    if      (goodie.subtype == "drawing") { goodieGenerateDrawing(goodie) } 
    else if (goodie.subtype == "picture") { goodieGeneratePicture(goodie) }

    return goodie;
}
// How the image generator works: Returns the image after requesting https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Ccategories&generator=random&formatversion=2&piprop=original&grnnamespace=6
function goodieGeneratePicture(goodie) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=pageimages%7Ccategories&generator=random&formatversion=2&piprop=original&grnnamespace=6", false);
    xhr.send();

    if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const image = data.query.pages[0].original.source;

        goodie.contents = image;
        goodie.emoji = "📸";

        return goodie;
    } else {
        console.error("Failed to fetch image");
        return null;
    }
}
// How the drawing generator works:
// 1. Generate an array with the first item defining the size and color of the canvas (like "s50x50#000000")
// 1. Generate an array of drawing instructions. Like ["s50x50#000000", "l37x12", "c50x50x10x10", "r10x10x20x20"]
// 2. Execute the drawing instructions on the canvas
function goodieGenerateDrawing(goodie) {
    let instructions = [];

    // Generate canvas size and background color
    const sizeX = Math.floor(Math.random() * 50) + 50;
    const sizeY = Math.floor(Math.random() * 50) + 50;

    // Generate color palette
    const numColors = Math.floor(Math.random() * 4) + 2;
    const palette = [];
    for (let i = 0; i < numColors; i++) {
        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        palette.push(color);
    }
    const backgroundColor = Math.floor(Math.random() * palette.length);
    instructions.push(`s,${sizeX},${sizeY},${backgroundColor}`);

    // Generate drawing instructions
    function generateDrawingInstruction(sizeX, sizeY) {
        const commands = ["l", "cl", "c", "r", "t"];
        const command = commands[Math.floor(Math.random() * commands.length)];

        let instruction;
        let x1, y1, x2, y2, x3, y3, centerX, centerY, radius, x, y, width, height, thickness, color;

        switch (command) {
            case "l": // Draw line
                x1 = Math.floor(Math.random() * sizeX);
                y1 = Math.floor(Math.random() * sizeY);
                x2 = Math.floor(Math.random() * sizeX);
                y2 = Math.floor(Math.random() * sizeY);
                thickness = Math.floor(Math.random() * 5) + 1; // Added line thickness
                color = Math.floor(Math.random() * palette.length);
                instruction =  `l,${x1},${y1},${x2},${y2},${thickness},${color}`;
                break;
            case "cl": // Draw curved line
                x1 = Math.floor(Math.random() * sizeX);
                y1 = Math.floor(Math.random() * sizeY);
                x2 = Math.floor(Math.random() * sizeX);
                y2 = Math.floor(Math.random() * sizeY);
                x3 = Math.floor(Math.random() * sizeX);
                y3 = Math.floor(Math.random() * sizeY);
                thickness = Math.floor(Math.random() * 5) + 1;
                color = Math.floor(Math.random() * palette.length);
                instruction = `cl,${x1},${y1},${x2},${y2},${x3},${y3},${thickness},${color}`;
                break;
            case "c": // Draw circle
                centerX = Math.floor(Math.random() * sizeX);
                centerY = Math.floor(Math.random() * sizeY);
                radius = Math.floor(Math.random() * Math.min(sizeX, sizeY) / 2);
                thickness = Math.floor(Math.random() * 5) + 1;
                color = Math.floor(Math.random() * palette.length);
                instruction = `c,${centerX},${centerY},${radius},${thickness},${color}`;
                break;
            case "r": // Draw rectangle
                x = Math.floor(Math.random() * sizeX);
                y = Math.floor(Math.random() * sizeY);
                width = Math.floor(Math.random() * sizeX / 2);
                height = Math.floor(Math.random() * sizeY / 2);
                thickness = Math.floor(Math.random() * 5) + 1;
                color = Math.floor(Math.random() * palette.length);
                instruction = `r,${x},${y},${width},${height},${thickness},${color}`;
                break;
            case "t": // Draw triangle
                x1 = Math.floor(Math.random() * sizeX);
                y1 = Math.floor(Math.random() * sizeY);
                x2 = Math.floor(Math.random() * sizeX);
                y2 = Math.floor(Math.random() * sizeY);
                x3 = Math.floor(Math.random() * sizeX);
                y3 = Math.floor(Math.random() * sizeY);
                thickness = Math.floor(Math.random() * 5) + 1;
                color = Math.floor(Math.random() * palette.length);
                instruction = `t,${x1},${y1},${x2},${y2},${x3},${y3},${thickness},${color}`;
                break;
            default:
                console.error("Invalid drawing command: ", command);
        }

        return instruction;
    }

    // Generate drawing instructions
    const numInstructions = Math.floor(Math.random() * 20) + 5;
    for (let i = 0; i < numInstructions; i++) {
        instructions.push(generateDrawingInstruction(sizeX, sizeY));
    }

    goodie.contents = {
        instructions: instructions,
        palette: palette
    };
    goodie.emoji = "🎨";

    return goodie;
}

function goodieRenderDrawing(drawing) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const instructions = drawing.instructions;
    const palette = drawing.palette;

    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        const parts = instruction.split(",");
        const command = parts[0];

        switch (command) {
            case "s": // Set size and color
                canvas.width = parseInt(parts[1]);
                canvas.height = parseInt(parts[2]);
                ctx.fillStyle = palette[parseInt(parts[3])];
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
            case "l": // Draw line
                ctx.beginPath();
                ctx.moveTo(parseInt(parts[1]), parseInt(parts[2]));
                ctx.lineTo(parseInt(parts[3]), parseInt(parts[4]));
                ctx.lineWidth = parseInt(parts[5]);
                ctx.strokeStyle = palette[parseInt(parts[6])];
                ctx.stroke();
                break;
            case "cl": // Draw curved line
                ctx.beginPath();
                ctx.moveTo(parseInt(parts[1]), parseInt(parts[2]));
                ctx.quadraticCurveTo(parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]), parseInt(parts[6]));
                ctx.lineWidth = parseInt(parts[7]);
                ctx.strokeStyle = palette[parseInt(parts[8])];
                ctx.stroke();
                break;
            case "c": // Draw circle
                ctx.beginPath();
                ctx.arc(parseInt(parts[1]), parseInt(parts[2]), parseInt(parts[3]), 0, 2 * Math.PI);
                ctx.fillStyle = palette[parseInt(parts[5])];
                ctx.fill();
                ctx.lineWidth = parseInt(parts[4]);
                ctx.strokeStyle = palette[parseInt(parts[5])];
                ctx.stroke();
                break;
            case "r": // Draw rectangle
                ctx.fillStyle = palette[parseInt(parts[6])];
                ctx.fillRect(parseInt(parts[1]), parseInt(parts[2]), parseInt(parts[3]), parseInt(parts[4]));
                ctx.lineWidth = parseInt(parts[5]);
                ctx.strokeStyle = palette[parseInt(parts[6])];
                ctx.stroke();
                break;
            case "t": // Draw triangle
                ctx.beginPath();
                ctx.moveTo(parseInt(parts[1]), parseInt(parts[2]));
                ctx.lineTo(parseInt(parts[3]), parseInt(parts[4]));
                ctx.lineTo(parseInt(parts[5]), parseInt(parts[6]));
                ctx.fillStyle = palette[parseInt(parts[8])];
                ctx.fill();
                ctx.lineWidth = parseInt(parts[7]);
                ctx.strokeStyle = palette[parseInt(parts[8])];
                ctx.stroke();
                break;
            default:
            console.error("Invalid drawing instruction: ", instruction);
        }
    }

    return canvas.toDataURL();
}

// --- Debug Function ---

// function debugGoodieGenerateDrawing() {
//     const drawing = goodieRenderDrawing(goodieGenerateDrawing());
//     const image = new Image();
//     image.src = drawing;
//     document.body.appendChild(image);
// }

// // Call the debug function
// debugGoodieGenerateDrawing();