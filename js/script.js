const LINE_THICKNESS = 1;
const SPACING = 30;
var mousePosX = -1;
var mousePosY = -1;
var size = 700;
var obstacles = []

var startFocused = false;
var endFocused = false;
var obstacleFocused = false;


function startFocus() {
    startFocused = true;
    endFocused = false;
    obstacleFocused = false;
}

function endFocus() {
    startFocused = false;
    endFocused = true;
    obstacleFocused = false;
}

function obstacleFocus() {
    startFocused = false;
    endFocused = false;
    obstacleFocused = true;

}

function noFocus(){
    startFocused = false;
    endFocused = false;
    obstacleFocused = false;
}
function outputClicked(e) {

    let sender = e.target || e.srcElement;
    let posX = mousePosXToGridX(e.x, sender.getBoundingClientRect().x);
    let posY = mousePosYToGridY(e.y, sender.getBoundingClientRect().y);

    if (startFocused) {
        let startXInput = document.getElementById("start-x-input");
        let startYInput = document.getElementById("start-y-input");


        startXInput.value = posX;
        startYInput.value = posY;
        return;
    }
    if (endFocused) {
        let endXInput = document.getElementById("end-x-input");
        let endYInput = document.getElementById("end-y-input");


        endXInput.value = posX;
        endYInput.value = posY;
        return;
    }
    if (obstacleFocused) {
        let point = [posX, posY];
        if (obstacles.indexOf(point) === -1) {
            obstacles.push(point);
        }

        return;
    }

}

function clamp(min, max, value) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max
    }
    return value;
}

function mousePosXToGridX(x, offsetX) {
    return Math.floor((x - offsetX) / SPACING);
}

function mousePosYToGridY(y, offsetY) {
    return Math.floor((y - offsetY) / SPACING);
}

function setThemeLight() {
    let link = document.getElementById("theme-style");
    link.setAttribute("href", "css/style-light.css");
    return false;
}

function setThemeDark() {
    let link = document.getElementById("theme-style");
    link.setAttribute("href", "css/style-dark.css");
    return false;
}


function drawGrid(outputContainer, output, stage) {

    size = Math.min(outputContainer.clientWidth, outputContainer.clientHeight);
    size = clamp(700, 1000, size);
    size = Math.floor(size / SPACING) * SPACING
    output.setAttribute("width", size);
    output.setAttribute("height", size);


    var shape = new createjs.Shape();
    for (let y = 0; y < size / SPACING; y++) {
        let startx = 0;
        let starty = y * SPACING - LINE_THICKNESS / 2;
        let width = size;
        let height = LINE_THICKNESS;

        shape.graphics.beginFill("black").drawRect(startx, starty, width, height);
    }

    for (let x = 0; x < size / SPACING; x++) {
        let startx = x * SPACING - LINE_THICKNESS / 2;
        let starty = 0;
        let width = LINE_THICKNESS;
        let height = size;

        shape.graphics.beginFill("black").drawRect(startx, starty, width, height);
    }

    // stage.clear();

    stage.addChild(shape);
}


function drawMouseOverlay(outputContainer, output, stage) {
    var shape = new createjs.Shape();
    shape.graphics.beginFill("yellow").drawRect(mousePosX * SPACING, mousePosY * SPACING, SPACING, SPACING);

    // stage.clear();

    stage.addChild(shape);


}

function mouseMoveOverOutput(e) {
    let sender = e.target || e.srcElement;
    mousePosX = mousePosXToGridX(e.x, sender.getBoundingClientRect().x);
    mousePosY = mousePosYToGridY(e.y, sender.getBoundingClientRect().y);


}


function drawStartOverlay(outputContainer, output, stage, posX, posY) {
    var shape = new createjs.Shape();
    shape.graphics.beginFill("blue").drawRect(posX * SPACING, posY * SPACING, SPACING, SPACING);
    stage.addChild(shape);
}


function drawEndOverlay(outputContainer, output, stage, posX, posY) {
    var shape = new createjs.Shape();
    shape.graphics.beginFill("red").drawRect(posX * SPACING, posY * SPACING, SPACING, SPACING);
    stage.addChild(shape);
}

function drawObstacles(outputContainer, output, stage) {
    var shape = new createjs.Shape();

    for (let i = 0; i < obstacles.length; i++) {
        let pt = obstacles[i];
        shape.graphics.beginFill("grey").drawRect(pt[0] * SPACING, pt[1] * SPACING, SPACING, SPACING);

    }
    stage.addChild(shape);

}


createjs.Ticker.addEventListener("tick", mainLoop);

function mainLoop(e) {
    let startXInput = document.getElementById("start-x-input");
    let startYInput = document.getElementById("start-y-input");
    startXInput.setAttribute("max", size / SPACING - 1);
    startYInput.setAttribute("max", size / SPACING - 1);


    let endXInput = document.getElementById("end-x-input");
    let endYInput = document.getElementById("end-y-input");
    startXInput.setAttribute("max", size / SPACING - 1);
    startYInput.setAttribute("max", size / SPACING - 1);


    let startX = startXInput.value;
    let startY = startYInput.value;

    let endX = endXInput.value;
    let endY = endYInput.value;

    let obstacleListbox = document.getElementById("obstacle-listbox");
    obstacleListbox.innerHTML = "";

    for (let i = 0; i < obstacles.length; i++) {
        let option = document.createElement("option");
        option.innerText = "(" + obstacles[i][0] + ", " + obstacles[i][1] + ")";
        obstacleListbox.appendChild(option);
    }

    var outputContainer = document.getElementById("output-container");
    var output = document.getElementById("output");
    var stage = new createjs.Stage(output);

    stage.clear();

    drawGrid(outputContainer, output, stage);

    drawObstacles(outputContainer, output, stage);
    drawStartOverlay(outputContainer, output, stage, startX, startY);
    drawEndOverlay(outputContainer, output, stage, endX, endY);


    if (mousePosX > -1 && mousePosY > -1)
        drawMouseOverlay(outputContainer, output, stage);


    stage.update(e);


}