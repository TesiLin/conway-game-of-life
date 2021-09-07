const CELL_SIZE = 5;            //每个格子的像素尺寸
const GRID_COLOR = "#232323";   //格子默认颜色
const DEAD_COLOR = "#FFFFFF";   //细胞死亡颜色
const ALIVE_COLOR = "#000000";  //存活颜色


//设置画布尺寸
    //导入康威生命游戏核心类
import { memory } from "@bezos/wasm-game-of-life/wasm_game_of_life_bg";
import { Universe } from "@bezos/wasm-game-of-life";
//import FPS from "./fps";

    //创建示例，设置横纵格子数
const universe = Universe.new();
universe.set_width(64)
universe.set_height(64)
universe.init()
    //设置canvas像素宽高
const canvas = document.getElementById('game-of-life-canvas');
const playPauseBtn = document.getElementById('play-pause');
const body = document.getElementById('body');
const ctx = canvas.getContext('2d');
    

const width = universe.width();
const height = universe.height();
canvas.width = (CELL_SIZE + 1) * width + 1;
canvas.height = (CELL_SIZE + 1) * height + 1;

function getIndex(row, column) {
    return row * width + column;
}
  
const bitInSet = (n, arr) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << n % 8;
    return (arr[byte] & mask) === mask;
};
  
function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 10;
    for (let i = 0; i <= width; i++){
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }
    for (let i = 0; i <= height; i++){
        ctx.moveTo(0, i * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1)(width) + 1, i * (CELL_SIZE + 1) + 1);
    }
    ctx.stroke();
}

function drawCells() {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);
    ctx.beginPath();
  
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col);
        ctx.fillStyle = bitInSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;
        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }
  
    ctx.stroke();
}
  
let animationId;
function renderLoop() {
    universe.tick();
    drawCells();
    animationId = requestAnimationFrame(renderLoop);
}
function play() {
    playPauseBtn.textContent = "暂停";
    renderLoop();
}


canvas.addEventListener("click", event => {
    let boundingRect = canvas.getBoundingClientRect();

    //计算缩放
    let scaleX = canvas.width / boundingRect.width;
    let scaleY = canvas.height / boundingRect.height;
    
    //计算出发点在canvas中的位置
    let canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    let canvasTop = (event.clientY - boundingRect.top) * scaleY;

    //计算坐标
    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    //改变状态并重新绘制
    universe.toggle_cell(row, col);
    drawCells();
})




playPauseBtn.onclick = play;