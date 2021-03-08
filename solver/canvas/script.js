//SomeVariables
var canvas = document.getElementById("sudokuCanvas");
var ctx = canvas.getContext('2d');
var gridSize = 9;
var bigGridSize = 3;
var boxSize = ctx.canvas.width/gridSize;
var canvasSize = gridSize*boxSize;

ctx.canvas.width = canvasSize;
ctx.canvas.height = canvasSize;

//Square Object Creation
class Box {
  constructor(x,y,isReadOnly,num,){
    this.x = x;
    this.y = y;
    this.isReadOnly = isReadOnly;
    this.num = num;
  }

  draw(ctx){ //Draw function for squares in sudoku
    ctx.beginPath();
    ctx.rect(this.x, this.y, boxSize, boxSize);
    ctx.stroke();
    ctx.closePath();
  }

  clickBox() {
    console.log(this.x);
  }
}
/*
canvas.addEventListener('click', (event) => {console.log(event)});

//Create logical board
var board = new Array(gridSize);
  for (var x = 0; x < board.length; x++) {
    board[x] = new Array(9);
    for (var y = 0; y < board.length; y++) {
      board[x][y] = new Box(x*boxSize,y*boxSize,true,5);
      board[x][y].draw(ctx);
    }
  }

*/

var grid = document.getElementById("sudokuGrid");
grid.style = "grid-template: auto / repeat("+bigGridSize+", auto);";

for (var i = 0; i < Math.pow(bigGridSize,2); i++) {
  var div = document.createElement("div");
  div.classList.add('bigSquare');
  grid.appendChild(div);
}

bigSquare = document.getElementsByClassName("bigSquare");
for (var i = 0; i < Math.pow(bigGridSize,2); i++) {
  for (var j=0; j < 9; j++){
    var div = document.createElement("div");
    div.classList.add('square');
    bigSquare[i].appendChild(div);
  }
}




/*
  var drawGrid = function(w, h, grid) {
    ctx.canvas.width  = w;
    ctx.canvas.height = h;

    for (x=0;x<=w;x+=(w/gridSize)) {
      for (y=0;y<=h;y+=(w/gridSize)) {
          /*ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();*//*

          ctx.beginPath();
          ctx.fillStyle="yellow";
          /*ctx.fillRect(x,y,w/gridSize,h/gridSize)*//*
          ctx.rect(x,y,w/gridSize,h/gridSize);
          ctx.stroke();


        }
      }
    };*/

//drawGrid(600, 600, "grid");

