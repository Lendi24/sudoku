//KickstartScript
init(document.getElementsByClassName("slider")[0].value);

//Square Object Creation
function Box (bigBoxNr,smallBoxNr,isReadOnly,num,element,x,y){
  this.bigBoxNr = bigBoxNr;
  this.smallBoxNr = smallBoxNr;
  this.isReadOnly = isReadOnly;
  this.num = num;
  this.element = element;
  this.x = x;
  this.y = y;
}


function init (size) {
  if(document.body.contains(document.getElementById('sudokuGrid'))) {
    document.getElementById("sudokuGrid").remove();
  }

  var div = document.createElement("div");
  div.setAttribute("id", "sudokuGrid");
  document.querySelector('body').appendChild(div);

  console.log(size);
  drawGrid(size);
  createLogicalBoard(size);
}
/*
canvas.addEventListener('click', (event) => {console.log(event)});
*/

//Create logical board
var board;
function createLogicalBoard (size){
  var elem = document.getElementsByClassName("square");
  board = new Array(Math.pow(size,2));
  for (var i = 0; i < board.length; i++) {
    board[i] = new Array(Math.pow(size,2));
    for (var j = 0; j < board.length; j++) {

      var globalY = size*Math.floor(i/size) + Math.floor(j/size);
      var globalX = i*size+j-Math.floor(j/size)*size-Math.floor(i/size)*Math.pow(size,2);
//Math.floor(i/size)0 1 2
      board[i][j] = new Box(i,j,true,5,elem[i*Math.pow(size,2)+j].children[0], globalX, globalY);
    //  board[i][j].element.innerHTML = 1;
      board[i][j].element.parentElement.setAttribute("id", i+" "+j);
      board[i][j].element.parentElement.setAttribute("onClick","changeColour(this.id)");
    }
  }
}

//Draw grid
function drawGrid(size) {
  var grid = document.getElementById("sudokuGrid");
  grid.style = "grid-template: auto / repeat("+size+", auto);";

  for (var i = 0; i < Math.pow(size,2); i++) {
    var div = document.createElement("div");
    div.style = "grid-template: auto / repeat("+size+", auto);";
    div.classList.add('bigSquare');
    grid.appendChild(div);
  }

  bigSquare = document.getElementsByClassName("bigSquare");
  for (var i = 0; i < Math.pow(size,2); i++) {
    for (var j = 0; j < Math.pow(size,2); j++) {
      var div = document.createElement("div");
      div.classList.add('square');
      div.appendChild(document.createElement("div"));
      bigSquare[i].appendChild(div);
    }
  }
}

//Interactivity with board
function changeColour (x) {
  pos = x.split(' ');
  board[pos[0]][pos[1]].element.parentElement.classList.toggle("marked");

}

/*///////////////////////7
--=={[WARNING! BAD CODE BELOW]}==--
////////////////////////*/



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
//Soduko loading and displaying
function loadSudokuDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      drawTable(this);
    }
  };
//  var select = document.getElementById("selectSudoku")

  var selected = document.getElementById("selectSudoku").selectedIndex;
  selected = document.getElementsByTagName("option")[selected].value
  xhttp.open("GET", "/xmlsrv.php?ID="+selected, true);
  xhttp.send();
}

function drawTable(xml) {
  var xmlDoc = xml.responseXML;
  var table;
  //var table="<tr> <th>1</th> <th>2</th> <th>3</th> </tr>";
  var x = xmlDoc.getElementsByTagName("sudoku");

  for (i = 0; i <x.length; i++) {
    //table += "<tr><td>"+x[i].getElementsByTagName("title")[0].childNodes[0].nodeVaue+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row1")[0].childNodes[0].nodeValue+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row2")[0].childNodes[0].nodeValue+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row3")[0].childNodes[0].nodeValue+"</td><td>"
    table += "<tr><td>"+"-----------"+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row4")[0].childNodes[0].nodeValue+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row5")[0].childNodes[0].nodeValue+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row6")[0].childNodes[0].nodeValue+"</td><td>"
    table += "<tr><td>"+"-----------"+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row7")[0].childNodes[0].nodeValue+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row8")[0].childNodes[0].nodeValue+"</td><td>"
    table += "<tr><td>"+x[i].getElementsByTagName("row9")[0].childNodes[0].nodeValue+"</td><td>"
    //table += "<tr><td>"+" "+"</td><td>"
  }

  var info = "<tr> <th>ID</th> <th>Created</th> <th>UserCreated?</th> </tr>";
  info += "<tr> <th>"+xmlDoc.getElementsByTagName("ID")[0].childNodes[0].nodeValue+"</th>"+
               "<th>"+xmlDoc.getElementsByTagName("DateCreated")[0].childNodes[0].nodeValue+"</th>"+
               "<th>"+xmlDoc.getElementsByTagName("UserCreated")[0].childNodes[0].nodeValue+"</th> </tr>";

  document.getElementById("info").innerHTML = info;

  document.getElementById("demo").innerHTML = table;
}


//List loading and displaying
loadListDoc();
function loadListDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      makeList(this);
    }
  };
  xhttp.open("GET", "/xmlsrv.php?ID=0", true);
  xhttp.send();
}

function makeList(xml) {
  var i;
  var xmlDoc = xml.responseXML;
  var table="";
  var sudoku = xmlDoc.getElementsByTagName("Sudoku");
  document.getElementById("selectSudoku").innerHTML = "";
  for (i = 0; i < sudoku.length; i++) {
    //sudoku[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue
    //sudoku[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue

     var x = document.createElement("OPTION");
     x.setAttribute('value', sudoku[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue);
     var t = document.createTextNode(sudoku[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue);
     x.appendChild(t);
     document.getElementById("selectSudoku").appendChild(x);
  }
  //document.getElementById("sudokuSelect").innerHTML = table;
  //setTimeout(function(){ loadListDoc(); }, 5000);
}

