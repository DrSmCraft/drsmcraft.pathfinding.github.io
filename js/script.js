const LINE_THICKNESS = 1;
const SPACING = 30;
const DEFAULT_DIST_LABEL_COLOR = "#ff7700";
const DEFAULT_SOURCE_COLOR = "#ff0000";
const DEFAULT_TARGET_COLOR = "#0000ff";
const DEFAULT_PATH_COLOR = "#ff00ff";
const DEFAULT_OBSTACLE_COLOR = "#777777";


var distLabelColor = DEFAULT_DIST_LABEL_COLOR;
var sourceColor = DEFAULT_SOURCE_COLOR;
var targetColor = DEFAULT_TARGET_COLOR;
var pathColor = DEFAULT_PATH_COLOR;
var obstacleColor = DEFAULT_OBSTACLE_COLOR;


function extractPropertyFomCss(css, propertyToExtract) {
    let start = css.indexOf("{") + 1;
    let end = css.indexOf("}");
    css = css.substring(start, end);
    let properties = css.split(";");

    for (const property of properties) {

        let splitPoint = property.indexOf(":");
        let name = property.substring(0, splitPoint).toLowerCase().trim();
        let value = property.substring(splitPoint + 2, property.length).toLowerCase().trim();

        if (name == propertyToExtract) {
            return value;
        }

    }

    return null;


}

function setCssColors() {
    let sheet = document.styleSheets[4];
    let distColorChanged = false;
    let sourceColorChanged = false;
    let targetColorChanged = false;
    let pathColorChanged = false;
    let obsColorChanged = false;

    for (let j = 0; j < sheet.rules.length; j++) {
        let rule = sheet.rules[j];
        if (rule.selectorText !== undefined) {
            let c = extractPropertyFomCss(rule.cssText, "color");

            if (c == null) {
                continue;
            }

            console.log(rule.selectorText);

            if (rule.selectorText.indexOf(".source") > -1) {
                sourceColor = c;
                sourceColorChanged = true;
            } else if (rule.selectorText.indexOf(".target") > -1) {
                targetColor = c;
                targetColorChanged = true;
            } else if (rule.selectorText.indexOf(".distance") > -1) {
                distLabelColor = c;
                distColorChanged = true;
            } else if (rule.selectorText.indexOf(".obstacle") > -1) {
                obstacleColor = c;

                obsColorChanged = true;
            } else if (rule.selectorText.indexOf(".path") > -1) {
                pathColor = c;
                pathColorChanged = true;
            }
        }

    }

    console.log(obsColorChanged);
    if (!distColorChanged) {
        distLabelColor = DEFAULT_DIST_LABEL_COLOR;
    }
    if (!sourceColorChanged) {
        distLabelColor = DEFAULT_SOURCE_COLOR;
    }
    if (!targetColorChanged) {
        distLabelColor = DEFAULT_TARGET_COLOR;
    }
    if (!pathColorChanged) {
        distLabelColor = DEFAULT_PATH_COLOR;
    }
    if (!obsColorChanged) {
        distLabelColor = DEFAULT_OBSTACLE_COLOR;
    }

    changed = true;

}


var mousePosX = -1;
var mousePosY = -1;
var size = 700;
var obstacles = {}
var changed = true;

var startFocused = false;
var endFocused = false;
var obstacleFocused = false;
var mouseDragging = false;
var ctrlDown = false;
var visualizing = false;
var pathfinder = null;
var distList = [];
var pathToTarget = [];


function getListOfPoints() {
    let lst = []

    for (let y = 0; y < (size / SPACING) + 1; y++) {
        for (let x = 0; x < (size / SPACING) + 1; x++) {
            let hash = hashPosition(x, y);
            if (!(hash in obstacles)) {
                lst.push({x: x, y: y});
            }
        }
    }
    return lst;
}

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


function handleMouseOverOutput(e, dragging) {
    if (visualizing) {
        return;
    }

    if (dragging) {
        changed = true;
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
    setCssColors();
    return false;
}

function setThemeDark() {
    let link = document.getElementById("theme-style");
    link.setAttribute("href", "css/style-dark.css");


    let date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    document.cookie = "theme=dark; " + expires + "; path=/";
    setCssColors();
    return false;
}


function drawGrid(outputContainer, output, stage) {

    const numGrid = 20;
    // size = Math.min(outputContainer.clientWidth, outputContainer.clientHeight);
    // size = clamp(700, 800, size);
    // size = Math.floor(size / SPACING) * SPACING

    size = numGrid * SPACING;
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
    shape.graphics.beginFill(sourceColor).drawRect(posX * SPACING, posY * SPACING, SPACING, SPACING);
    stage.addChild(shape);
}


function drawEndOverlay(outputContainer, output, stage, posX, posY) {
    var shape = new createjs.Shape();
    shape.graphics.beginFill(targetColor).drawRect(posX * SPACING, posY * SPACING, SPACING, SPACING);
    stage.addChild(shape);
}

function drawObstacles(outputContainer, output, stage) {
    var shape = new createjs.Shape();

    for (let key in obstacles) {

        let pt = obstacles[key];
        shape.graphics.beginFill(obstacleColor).drawRect(pt.x * SPACING, pt.y * SPACING, SPACING, SPACING);

    }
    stage.addChild(shape);

}

function drawPathToTarget(outputContainer, output, stage) {
    var shape = new createjs.Shape();

    for (let i = 0; i < pathToTarget.length; i++) {

        let pt = pathToTarget[i];
        shape.graphics.beginFill(pathColor).drawRect(pt.x * SPACING, pt.y * SPACING, SPACING, SPACING);

    }
    stage.addChild(shape);
}


function drawDistances(outputContainer, output, stage) {

    for (let i = 0; i < distList.length; i++) {

        let pt = distList[i].point;
        let dist = distList[i].dist;

        let text = new createjs.Text(dist + "", "20px Arial", distLabelColor);
        text.x = pt.x * SPACING + (SPACING * 0.3);
        text.y = pt.y * SPACING + (SPACING * 0.3);
        stage.addChild(text);


    }
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
    document.getElementById("obstacle-listbox").setAttribute("disabled", "");
    document.getElementById("start-btn").setAttribute("disabled", "");

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
    document.getElementById("start-btn").removeAttribute("disabled");


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

    let startX = document.getElementById("start-x-input").value;
    let startY = document.getElementById("start-y-input").value;

    let endX = document.getElementById("end-x-input").value;
    let endY = document.getElementById("end-y-input").value;

    pathfinder = new Dijkstra(getListOfPoints(), {x: startX, y: startY}, {x: endX, y: endY}, obstacles);


}

function stopVisualization() {
    enableSettings();
    disableControls();
    visualizing = false;
    pathfinder = null;
    distList = [];
    pathToTarget = [];
}


function runVisualization() {
    if (!visualizing || pathfinder == null) {
        return;
    }
    while (!pathfinder.done) {
        pathfinder.runOneStep();
    }
    document.getElementById("step-label").innerText = "Step " + pathfinder.step;


    distList = pathfinder.getDistances();

    pathToTarget = pathfinder.getPathToTarget();
    changed = true;
}

function runVisualizationOneStep() {
    if (!visualizing || pathfinder == null) {
        return;
    }
    if (!pathfinder.done) {
        pathfinder.runOneStep();
        document.getElementById("step-label").innerText = "Step " + pathfinder.step;
    } else {
        pathToTarget = pathfinder.getPathToTarget();
        document.getElementById("step-label").innerText = "Sim Finished";
    }


    distList = pathfinder.getDist();
    changed = true;


}

createjs.Ticker.addEventListener("tick", mainLoop);

function mainLoop(e) {

    if (!changed) {
        return;
    }

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
        option.classList.add("obstacle");
        option.innerText = "(" + pt.x + ", " + pt.y + ")";
        obstacleListbox.appendChild(option);
    }

    var outputContainer = document.getElementById("output-container");
    var output = document.getElementById("output");
    var stage = new createjs.Stage(output);

    stage.clear();

    drawGrid(outputContainer, output, stage);

    if (pathToTarget.length > 0) {
        drawPathToTarget(outputContainer, output, stage);
    }

    drawObstacles(outputContainer, output, stage);

    drawStartOverlay(outputContainer, output, stage, startX, startY);
    drawEndOverlay(outputContainer, output, stage, endX, endY);


    if (visualizing && distList.length > 0) {
        drawDistances(outputContainer, output, stage);
    }


    if (mousePosX > -1 && mousePosY > -1)
        drawMouseOverlay(outputContainer, output, stage);


    stage.update(e);

    changed = false;


}