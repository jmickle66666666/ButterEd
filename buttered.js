console.log("frt");

window.onload = function () {

    canvas = document.getElementById("mapCanvas");
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext("2d");
    canvas.onclick = function(e) {
        // console.log(e.offsetX, e.offsetY);
        let mp = mouseToGridPos(e.offsetX, e.offsetY);
        addPoint(point(mp.x, mp.y), ctrlHeld?0:1);
        render();
    }

    canvas.onmousedown = function(e) {
        mouseDown = true;
    }

    canvas.onmouseup = function(e) {
        mouseDown = false;
    }

    canvas.onmousemove = function(e) {
        mousePos = mouseToGridPos(e.offsetX, e.offsetY);

        if (mouseDown) {
            let mp = mouseToGridPos(e.offsetX, e.offsetY);
            addPoint(point(mp.x, mp.y), ctrlHeld?0:1);
        }

        render();
    }

    document.onkeydown = function(e) {
        if (e.key == "Control" || e.key == "Meta") {
            ctrlHeld = true;
        }
    }

    document.onkeyup = function(e) {
        if (e.key == "Control" || e.key == "Meta") {
            ctrlHeld = false;
        }
    }
    
    initData();
    render();
}

var zoom = 40;
var canvas;
var ctx;
var mousePos = {x:-100, y:-100};
var mouseDown = false;
var ctrlHeld = false;

function render() {
    ctx.beginPath();
    ctx.fillStyle = "#111111";
    ctx.rect(0,0, canvas.width, canvas.height);
    ctx.fill();

    
    
    // console.log("hi?");
    for (let point of mapData.keys()) {
        if (isPoint(point)) {
            ctx.fillStyle = "#d97d3c";
        } else {
            ctx.fillStyle = "#333333";
        }
        let p = readPoint(point);
        // console.log(p);
        ctx.beginPath();
        ctx.ellipse(p.x * zoom, p.y * zoom, 2, 2, 0, 0, 360);
        ctx.fill();
    }

    ctx.fillStyle = "#d97d3c";
    ctx.beginPath();
    ctx.ellipse(mousePos.x * zoom, mousePos.y * zoom, 4, 4, 0, 0, 360);
    ctx.fill();

    // ctx.strokeStyle = "#999999";
    // for (let point of linesData.keys()) {
    //     let line = linesData.get(point);
    //     let p = readPoint(point);
    //     for(var i = 0; i < line.length; i+= 2) {
    //         let x1 = line[i].x + p.x;
    //         let y1 = line[i].y + p.y - 2;
    //         let x2 = line[i+1].x + p.x;
    //         let y2 = line[i+1].y + p.y - 2;
    //         ctx.beginPath();
    //         ctx.moveTo(x1 * zoom, y1 * zoom);
    //         ctx.lineTo(x2 * zoom, y2 * zoom);
    //         ctx.stroke();
    //     }
    // }

    ctx.strokeStyle = "#ffffff";
    for (let point of linesData.keys()) {
        let line = linesData.get(point);
        let p = readPoint(point);
        for(var i = 0; i < line.length; i+= 2) {
            let x1 = line[i].x + p.x;
            let y1 = line[i].y + p.y;
            let x2 = line[i+1].x + p.x;
            let y2 = line[i+1].y + p.y;
            ctx.beginPath();
            ctx.moveTo(x1 * zoom, y1 * zoom);
            ctx.lineTo(x2 * zoom, y2 * zoom);
            ctx.stroke();
        }
    }
}

function initData() {
    mapData = new Map();
    linesData = new Map();
    curveTiles();
    fillTiles();
}

function point(x, y)
{
    return x.toString() + "," + y.toString();
}

function readPoint(point)
{
    return {
        x: parseFloat(point.split(',')[0]),
        y: parseFloat(point.split(',')[1])
    };
}

function mouseToGridPos(x, y)
{
    x /= zoom;
    y /= zoom;
    return {x:Math.round(x),y:Math.round(y)};
}

function addPoint(point, value)
{
    mapData.set(point, value);
    updateLines(readPoint(point).x, readPoint(point).y);
    updateLines(readPoint(point).x-1, readPoint(point).y);
    updateLines(readPoint(point).x, readPoint(point).y-1);
    updateLines(readPoint(point).x-1, readPoint(point).y-1);
}

function updateLines(x, y)
{
    var sqrIndex = 0;
    if (isPoint(point(x,y))) sqrIndex += 1;
    if (isPoint(point(x+1,y))) sqrIndex += 2;
    if (isPoint(point(x,y+1))) sqrIndex += 4;
    if (isPoint(point(x+1,y+1))) sqrIndex += 8;
    var lines = squaresData[sqrIndex].slice();

    linesData.set(point(x,y), lines);
}

function isPoint(point)
{
    let p = mapData.get(point);
    if (p == undefined) return false;
    if (p == 0) return false;
    return true;
}

var mapData;
var linesData;

// marching squares data

function standardTiles() {
    squaresData[0] = [];
    squaresData[1] = [ topPoint, leftPoint ];
    squaresData[3] = [ rightPoint, leftPoint ];
    squaresData[7] = [ rightPoint, bottomPoint ];
    squaresData[15] = [];
}

function squareTiles() {
    squaresData[0] = [];
    squaresData[1] = [ topPoint, centerPoint, centerPoint, leftPoint ];
    squaresData[3] = [ rightPoint, leftPoint ];
    squaresData[7] = [ rightPoint, centerPoint, centerPoint, bottomPoint ];
    squaresData[15] = [];
}

function curveTiles() {
    squaresData[0] = [];
    squaresData[1] = [ topPoint, sq00, sq00, leftPoint ];
    squaresData[3] = [ rightPoint, leftPoint ];
    squaresData[7] = [ rightPoint, sq11, sq11, bottomPoint ];
    squaresData[15] = [];
}

var topPoint = {x:0.5, y:0};
var bottomPoint = {x:0.5, y:1};
var leftPoint = {x:0, y:0.5};
var rightPoint = {x:1, y:0.5};
var centerPoint = {x:0.5, y:0.5};
var sq00 = {x:0.36, y:0.36};
var sq01 = {x:0.64, y:0.36};
var sq10 = {x:0.36, y:0.64};
var sq11 = {x:0.64, y:0.64};
var squaresData = [];

function fillTiles() {
    squaresData[2] = rotateDataCW(squaresData[1]);
    squaresData[4] = rotateDataCCW(squaresData[1]);
    squaresData[5] = rotateDataCCW(squaresData[3]);
    squaresData[6] = squaresData[2].concat(squaresData[4]);
    squaresData[8] = rotateDataCW(squaresData[2]);
    squaresData[9] = squaresData[1].concat(squaresData[8]);
    squaresData[10] = rotateDataCW(squaresData[3]);
    squaresData[11] = rotateDataCW(squaresData[7]);
    squaresData[12] = rotateDataCW(squaresData[10]);
    squaresData[13] = rotateDataCCW(squaresData[7]);
    squaresData[14] = rotateDataCCW(squaresData[13]);
}

function rotateDataCW(data) {
    let output = [];
    for (let i = 0; i < data.length; i++) {
        output.push(rotate(0.5, 0.5, data[i].x, data[i].y, -90));
    }
    return output;
}

function rotateDataCCW(data) {
    let output = [];
    for (let i = 0; i < data.length; i++) {
        output.push(rotate(0.5, 0.5, data[i].x, data[i].y, 90));
    }
    return output;
}

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {x:nx, y:ny};
}