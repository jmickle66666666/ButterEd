console.log("frt");

window.onload = function () {

    canvas = document.getElementById("mapCanvas");
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext("2d");
    // canvas.onclick = function(e) {
    //     // console.log(e.offsetX, e.offsetY);
    //     let mp = mouseToGridPos(e.offsetX, e.offsetY);
    //     addPoint(point(mp.x, mp.y), 1);
    //     render();
    // }

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
            addPoint(point(mp.x, mp.y), Math.random());
        }

        render();
    }
    
    initData();
    render();
}

var zoom = 40;
var canvas;
var ctx;
var mousePos = {x:-100, y:-100};
var mouseDown = false;

function render() {
    ctx.beginPath();
    ctx.fillStyle = "#111111";
    ctx.rect(0,0, canvas.width, canvas.height);
    ctx.fill();

    
    ctx.fillStyle = "#d97d3c";
    // console.log("hi?");
    for (let point of mapData.keys()) {
        let p = readPoint(point);
        // console.log(p);
        ctx.beginPath();
        ctx.ellipse(p.x * zoom, p.y * zoom, 2, 2, 0, 0, 360);
        ctx.fill();
    }

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
    // console.log("init");
    mapData = new Map();
    linesData = new Map();

    // console.log("initData");
    // mapData.set(point(5,5), 1);
    // updateLines(5,5);
    // addPoint(point(5,5), 1);
    // addPoint(point(6,5), 1);
    // addPoint(point(6,6), 1);
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
    let p00 = mapData.get(point(x,y));
    let p10 = mapData.get(point(x+1,y));
    let p01 = mapData.get(point(x,y+1));
    let p11 = mapData.get(point(x+1,y+1));
    if (p00 != undefined) sqrIndex += 1;
    if (p10 != undefined) sqrIndex += 2;
    if (p01 != undefined) sqrIndex += 4;
    if (p11 != undefined) sqrIndex += 8;
    var lines = squaresData[sqrIndex].slice();
    
    // weights 

    // let xWeight = 

    linesData.set(point(x,y), lines);
}

var mapData;
var linesData;

// marching squares data

var topPoint = {x:0.5, y:0};
var bottomPoint = {x:0.5, y:1};
var leftPoint = {x:0, y:0.5};
var rightPoint = {x:1, y:0.5};

var squaresData = [];
squaresData[0] = [];
squaresData[1] = [ topPoint, leftPoint ];
squaresData[2] = [ rightPoint, topPoint ];
squaresData[3] = [ rightPoint, leftPoint ];
squaresData[4] = [ leftPoint, bottomPoint ];
squaresData[5] = [ topPoint, bottomPoint ];
squaresData[6] = [ leftPoint, bottomPoint, rightPoint, topPoint ];
squaresData[7] = [ rightPoint, bottomPoint];
squaresData[8] = [ bottomPoint, rightPoint ];
squaresData[9] = [ topPoint, leftPoint, bottomPoint, rightPoint ];
squaresData[10] = [ bottomPoint, topPoint ];
squaresData[11] = [ leftPoint, bottomPoint ];
squaresData[12] = [leftPoint, rightPoint];
squaresData[13] = [topPoint, rightPoint];
squaresData[14] = [leftPoint, topPoint];
squaresData[15] = [];
