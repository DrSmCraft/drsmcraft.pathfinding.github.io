const LINE_THICKNESS = 1;
const SPACING = 30;
var mousePosX = -1;
var mousePosY = -1;
var size = 700;
var obstacles = {}

var startFocused = false;
var endFocused = false;
var obstacleFocused = false;
var mouseDragging = false;
var ctrlDown = false;
var visualizing = false;

function startFocus(e) {
    startFocused = true;
    endFocused = false;
    obstacleFocused = false;
}

function endFocus(e) {
    startFocused = false;
    endFocused = true;
    obstacleFocused = false;
}

function obstacleFocus(e) {
    startFocused = false;
    endFocused = false;
    obstacleFocused = true;

}

function noFocus(e) {
    startFocused = false;
    endFocused = false;
    obstacleFocused = false;
}

function outputOnMouseDown(e) {
    mouseDragging = true;
}


function outputOnMouseUp(e) {
    mouseDragging = false;
}

function outputKeyDown(e) {
    if (e.key === "Control") {
        ctrlDown = true;
    }
}

function outputKeyUp(e) {
    if (e.key === "Control") {
        ctrlDown = false;
    }
}

function hashPosition(x, y) {
    return (x * 0x1f1f1f1f) ^ y;
}


function handleMouseOverOutput(e, dragging) {

    if (visualizing) {
        return;
    }
    let sender = e.target || e.srcElement;
    let posX = mousePosXToGridX(e.x, sender.getBoundingClientRect().x);
    let posY = mousePosYToGridY(e.y, sender.getBoundingClientRect().y);

    if (startFocused && dragging) {
        let startXInput = document.getElementById("start-x-input");
        let startYInput = document.getElementById("start-y-input");


        startXInput.value = posX;
        startYInput.value = posY;
        return;
    }
    if (endFocused && dragging) {
        let endXInput = document.getElementById("end-x-input");
        let endYInput = document.getElementById("end-y-input");


        endXInput.value = posX;
        endYInput.value = posY;
        return;
    }
    if (obstacleFocused && dragging) {
        let point = {x: posX, y: posY};
        let hash = hashPosition(posX, posY);
        let exists = hash in obstacles;


        if (ctrlDown) {
            if (exists) {
                delete obstacles[hash];
            }
            return;
        }
        if (!exists) {
            obstacles[hash] = point;
        }


    }
}

function outputClicked(e) {
    handleMouseOverOutput(e, true);

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

    let date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    document.cookie = "theme=light; " + expires + "; path=/";
    return false;
}

function setThemeDark() {
    let link = document.getElementById("theme-style");
    link.setAttribute("href", "css/style-dark.css");


    let date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    document.cookie = "theme=dark; " + expires + "; path=/";
    return false;
}


function drawGrid(outputContainer, output, stage) {

    size = Math.min(outputContainer.clientWidth, outputContainer.clientHeight);
    size = clamp(700, 800, size);
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

    handleMouseOverOutput(e, mouseDragging);
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

    for (let key in obstacles) {

        let pt = obstacles[key];
        shape.graphics.beginFill("grey").drawRect(pt.x * SPACING, pt.y * SPACING, SPACING, SPACING);

    }
    stage.addChild(shape);

}


function disableSettings() {
    document.getElementById("poly-radio").setAttribute("disabled", "");
    document.getElementById("dijkstra-radio").setAttribute("disabled", "");
    document.getElementById("aStar-radio").setAttribute("disabled", "");
    document.getElementById("grid-radio").setAttribute("disabled", "");

    document.getElementById("poly-radio").setAttribute("disabled", "");
    document.getElementById("start-x-input").setAttribute("disabled", "");
    document.getElementById("start-y-input").setAttribute("disabled", "");
    document.getElementById("end-x-input").setAttribute("disabled", "");
    document.getElementById("end-y-input").setAttribute("disabled", "");
    document.getElementById("obstacle-listbox").setAttribute("disabled", "");

}


function enableSettings() {
    document.getElementById("poly-radio").removeAttribute("disabled");
    document.getElementById("dijkstra-radio").removeAttribute("disabled");
    document.getElementById("aStar-radio").removeAttribute("disabled");
    document.getElementById("grid-radio").removeAttribute("disabled");

    document.getElementById("poly-radio").removeAttribute("disabled");
    document.getElementById("start-x-input").removeAttribute("disabled");
    document.getElementById("start-y-input").removeAttribute("disabled");
    document.getElementById("end-x-input").removeAttribute("disabled");
    document.getElementById("end-y-input").removeAttribute("disabled");
    document.getElementById("obstacle-listbox").removeAttribute("disabled");

}

function enableControls() {
    document.getElementById("run-btn").removeAttribute("disabled");
    document.getElementById("run-once-btn").removeAttribute("disabled");
    document.getElementById("stop-btn").removeAttribute("disabled");

}

function disableControls() {
    document.getElementById("run-btn").setAttribute("disabled", "");
    document.getElementById("run-once-btn").setAttribute("disabled", "");
    document.getElementById("stop-btn").setAttribute("disabled", "");

}

function startVisualization() {
    disableSettings();
    enableControls();
    visualizing = true;
}

function stopVisualization() {
    enableSettings();
    disableControls();
    visualizing = false;
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


    for (let key in obstacles) {
        let pt = obstacles[key];
        let option = document.createElement("option");
        option.innerText = "(" + pt.x + ", " + pt.y + ")";

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