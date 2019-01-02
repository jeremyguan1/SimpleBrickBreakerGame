let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7;
let canvas, canvasContext;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROW = 14;

let brickGrid = new Array(BRICK_COLS * BRICK_ROW);
let paddleX = 400;
let mouseX = 0; 
let mouseY = 0;

let score = 0;
let bricksLeft = 0;

let colors = ['red', 'blue', 'orange', 'yellow', 'green', 'brown'];

window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvas.style.display = 'none';
    let framesPerSecond = 30;
    let start = document.getElementById('start');
    start.addEventListener('click', function(){
        canvasContext = canvas.getContext('2d');
        canvas.style.display = 'block';
        document.getElementById('currentScore').style.display = 'block';
        start.style.display = 'none';
        setInterval(updateAll, 1000/framesPerSecond);
    });

    canvas.addEventListener('mousemove', updateMousePos)
    brickReset();
    ballReset();
}

function updateMousePos(event){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;

    mouseX = event.clientX - rect.left - root.scrollLeft;
    mouseY = event.clientY - rect.top - root.scrollTop;
    paddleX = mouseX - PADDLE_WIDTH/2;
    // ballX = mouseX;
    // ballY = mouseY;
    // ballSpeedX = 4;
    // ballSpeedY = -4
}

function updateAll() {
    moveAll();
    drawAll();
    scoreUpdate();
}

function scoreUpdate(){
    document.getElementById('currentScore').innerHTML = `Score : ${score}`;
    
}

function ballReset() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function ballMove(){
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if(ballX < 0 && ballSpeedX < 0.0){
        ballSpeedX *= -1;
    }

    if(ballX > canvas.width && ballSpeedX > 0.0){
        ballSpeedX *= -1;
    }

    if(ballY < 0 && ballSpeedY < 0.0){
        ballSpeedY *= -1;
    }

    if(ballY > canvas.height){
        ballReset();
        brickReset();
    }
}

function isBrickAtColRow(col,row){
    if(col >= 0 && col < BRICK_COLS && row>= 0 && row < BRICK_ROW){
        let brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    }else{
        return false;
    }

}

function ballBrickHandling(){
    let ballBrickCol = Math.floor(ballX / BRICK_W);
    let ballBrickRow = Math.floor(ballY / BRICK_H);
    let brickIndexUnderball = rowColToArrayIndex(ballBrickCol, ballBrickRow);
    if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && BRICK_ROW >= 0 && ballBrickRow < BRICK_ROW){
        if(isBrickAtColRow(ballBrickCol, ballBrickRow)){
            brickGrid[brickIndexUnderball] = false;
            bricksLeft--;
            score++;
            let prevBallX = ballX -ballSpeedX;
            let prevBallY = ballY - ballSpeedY;
            let prevBrickCol = Math.floor(prevBallX / BRICK_W);
            let prevBrickRow = Math.floor(prevBallY / BRICK_H);
            let bothTextsFailed = true;
            if(prevBrickCol != ballBrickCol){
                if(isBrickAtColRow(prevBrickCol, ballBrickRow) == false){
                    ballSpeedX *=-1;
                    bothTextsFailed = false;
                }
            }
            if(prevBrickRow != ballBrickRow){
                if(isBrickAtColRow(ballBrickCol, prevBrickRow) == false){
                    ballSpeedY *=-1;
                    bothTextsFailed = false;
                }
            }

            if(bothTextsFailed){
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
        }
    }
}

function ballPaddleHandling(){
    let paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;
    let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    let paddleLeftEdgeX = paddleX;
    let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
    if( ballY > paddleTopEdgeY && 
        ballY < paddleBottomEdgeY &&
        ballX > paddleLeftEdgeX && 
        ballX < paddleRightEdgeX){
            ballSpeedY *= -1;
            let centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
            let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
            ballSpeedX = ballDistFromPaddleCenterX *0.35;
    }

    if(bricksLeft == 0){
        brickReset();
    }
}

function moveAll(){
    ballMove();
    ballBrickHandling();
    ballPaddleHandling();
}

function brickReset(){
    bricksLeft = 0;
    score = 0;
    let i;
    for(i = 0; i<3*BRICK_COLS; i++){
        brickGrid[i] = false;
    }
    for(; i <BRICK_COLS*BRICK_ROW; i++){
            brickGrid[i] = true;
            bricksLeft++;
    }
}

function drawAll(){
    colorRect(0,0,canvas.width, canvas.height,'black');
    colorCircle(ballX,ballY, 10,'white')
    colorRect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS);
    drawBricks();


}

function rowColToArrayIndex(col,row){
    return BRICK_COLS * row + col;
}

function drawBricks(){
    let colorIndex = 0;
    for (let eachRow = 0; eachRow< BRICK_ROW; eachRow++){
        for (let eachCol = 0; eachCol<BRICK_COLS; eachCol++){
            let arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if(brickGrid[arrayIndex]){
                colorIndex = 0;
                colorRect(BRICK_W*eachCol,BRICK_H*eachRow,BRICK_W-BRICK_GAP,BRICK_H - BRICK_GAP, colors[Math.floor(Math.random() * Math.floor(colors.length))]);
            }
        }
    }
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor){
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY,radius, fillColor){
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY,radius, 0,Math.PI*2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor){
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}