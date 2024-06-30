// Functions for generating goodies

// --- General Generation ---

function goodieGenerate(type, sourceText) {
    let goodie = {};

    switch (type) {
        case "item":  goodie = goodieGenerateItem();  break;
        case "theme": goodie = goodieGenerateTheme(); break;
        case "music": goodie = goodieGenerateMusic(); break;
        case "image": goodie = goodieGenerateImage(); break;
        case "text":  goodie = goodieGenerateText();  break;
        default: console.error("Invalid goodie type: ", type); return;
    }

    inventoryAddGoodie(goodie.contents, goodieGenerateName(),  goodieGenerateDescription(), type, goodie.subtype, goodie.emoji, sourceText)
}

// --- Image Generation ---

function goodieGenerateImage() {
    let goodie = {};

    // pick a random subtype
    const subtypes = ["picture", "drawing"];
    goodie.subtype = subtypes[Math.floor(Math.random() * subtypes.length)];

    if (goodie.subtype === "drawing") {
        goodie.contents = goodieGenerateDrawing();
    }

    return goodie;
}

function goodieGenerateDrawing() {
    // Generate a random drawing using canvas, and return the dataURL
    const canvas = document.createElement("canvas");

    const aspectRatios = [
        { width: 1, height: 1 },   // square
        { width: 4, height: 3 },   // standard
        { width: 16, height: 9 },  // widescreen
    ];
    const randomAspectRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
    const canvasWidth = 200;
    const canvasHeight = canvasWidth * (randomAspectRatio.height / randomAspectRatio.width);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });

    // generate a random palette of colors
    let colors = [];
    for (let i = 0; i < Math.floor(Math.random() * 8) + 2; i++) {
        colors.push(`hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 25) + 75}%, 50%)`);
    }
    console.log(colors)

    // pick random background color
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < Math.floor(Math.random() * 100) + 1; i++) {
        // pick a random tool: shape, line, curved line, fill
        const tools = ["shape", "line", "fill"];
        const tool = tools[Math.floor(Math.random() * tools.length)];

        // pick a random color
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.strokeStyle = ctx.fillStyle;

        switch (tool) {
            case "shape":
                const shapeType = Math.floor(Math.random() * 3); // 0: square, 1: circle, 2: triangle

                ctx.beginPath();

                switch (shapeType) {
                    case 0: // square
                    const shapeWidth = Math.random() * (canvasWidth / 2) + (canvasWidth / 4);
                    const shapeHeight = Math.random() * (canvasHeight / 2) + (canvasHeight / 4);
                    const shapeX = Math.random() * (canvasWidth - shapeWidth);
                    const shapeY = Math.random() * (canvasHeight - shapeHeight);
                    ctx.rect(shapeX, shapeY, shapeWidth, shapeHeight);
                    break;
                    case 1: // circle
                    const circleRadius = Math.random() * (Math.min(canvasWidth, canvasHeight) / 4) + (Math.min(canvasWidth, canvasHeight) / 8);
                    const circleX = Math.random() * canvasWidth;
                    const circleY = Math.random() * canvasHeight;
                    ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
                    break;
                    case 2: // triangle
                    const triangleSize = Math.random() * (Math.min(canvasWidth, canvasHeight) / 2) + (Math.min(canvasWidth, canvasHeight) / 4);
                    const triangleX = Math.random() * (canvasWidth - triangleSize);
                    const triangleY = Math.random() * (canvasHeight - triangleSize);
                    ctx.moveTo(triangleX, triangleY);
                    ctx.lineTo(triangleX + triangleSize, triangleY);
                    ctx.lineTo(triangleX + triangleSize / 2, triangleY + triangleSize);
                    ctx.closePath();
                    break;
                }

                ctx.fill();

                break;
            case "line":
                const startX = Math.random() * canvasWidth;
                const startY = Math.random() * canvasHeight;
                const endX = Math.random() * canvasWidth;
                const endY = Math.random() * canvasHeight;

                ctx.lineWidth = Math.random() * 10 + 1;

                ctx.beginPath();
                ctx.moveTo(startX, startY);

                const lineTypes = ["straight", "curved"];
                const lineType = lineTypes[Math.floor(Math.random() * lineTypes.length)];
                if (lineType === "straight") {
                    ctx.lineTo(endX, endY);
                } else {
                    const controlX = Math.random() * canvasWidth;
                    const controlY = Math.random() * canvasHeight;
                    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                }

                ctx.stroke();
                break;
            case "fill":
                const fillX = Math.floor(Math.random() * canvasWidth);
                const fillY = Math.floor(Math.random() * canvasHeight);
                const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
                const targetColor = imageData.data.slice((fillY * canvasWidth + fillX) * 4, (fillY * canvasWidth + fillX) * 4 + 3);
                const fillColor = ctx.fillStyle;

                const stack = [[fillX, fillY]];
                while (stack.length) {
                    const [x, y] = stack.pop();
                    if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) continue;
                    const index = (y * canvasWidth + x) * 4;
                    if (imageData.data[index] === targetColor[0] && imageData.data[index + 1] === targetColor[1] && imageData.data[index + 2] === targetColor[2]) {
                        imageData.data[index] = fillColor[0];
                        imageData.data[index + 1] = fillColor[1];
                        imageData.data[index + 2] = fillColor[2];
                        stack.push([x + 1, y]);
                        stack.push([x - 1, y]);
                        stack.push([x, y + 1]);
                        stack.push([x, y - 1]);
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                break;
        }
    }

    return canvas.toDataURL();
}

// --- Debug Function ---

function debugGoodieGenerateDrawing() {
    const drawing = goodieGenerateDrawing();
    const image = new Image();
    image.src = drawing;
    document.body.appendChild(image);
}

// Call the debug function
debugGoodieGenerateDrawing();