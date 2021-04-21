//Globals for events
var mouseDown = false;
document.onmousedown = function() {
  mouseDown = true;
}
document.onmouseup = function() {
  mouseDown = false;
}
document.mouseleave = function() {
  mouseDown = false;
}

var altDown = false;
document.addEventListener('keyup', (e) => {
  if (e.code === "AltLeft") {altDown = false}
});
document.addEventListener('keydown', (e) => {
  if (e.code === "AltLeft") {altDown = true}
});

//KickstartMyHeartScript
init(document.getElementsByClassName("slider")[0].value);

//Square Object Creation
function Box (bigBoxNr,smallBoxNr,isReadOnly,num,hint,element,x,y){
  this.bigBoxNr = bigBoxNr;
  this.smallBoxNr = smallBoxNr;
  this.isReadOnly = isReadOnly;
  this.num = num;
  this.hint = hint;
  this.element = element;
  this.x = x;
  this.y = y;
}


function init (size) {

  drawGrid(size);
  createLogicalBoard(size);
}
/*
canvas.addEventListener('click', (event) => {console.log(event)});
*/
//här skriver jag nåt!
//Create logical board
var localBoard;
var globalBoard;
function createLogicalBoard (size){
  var elem = document.getElementsByClassName("square");
  localBoard = new Array(Math.pow(size,2));
  globalBoard = new Array(Math.pow(size,2));
  for (var i = 0; i < localBoard.length; i++) {
    localBoard[i] = new Array(Math.pow(size,2));
    globalBoard[i] = new Array(Math.pow(size,2));
    for (var j = 0; j < localBoard.length; j++) {

      var globalY = size*Math.floor(i/size) + Math.floor(j/size);
      var globalX = i*size+j-Math.floor(j/size)*size-Math.floor(i/size)*Math.pow(size,2);
    //Math.floor(i/size)0 1 2
      localBoard[i][j] = new Box(i,j,false,5,0,elem[i*Math.pow(size,2)+j].children[0], globalX, globalY);
    //  board[i][j].element.innerHTML = 1;
      localBoard[i][j].element.parentElement.setAttribute("id", i+" "+j);
      localBoard[i][j].element.parentElement.setAttribute("onmousedown","makeSelect(this.id)");
      localBoard[i][j].element.parentElement.setAttribute("onmouseenter","makeSelectDrag(this.id)");
    }
  }
  for (var i = 0; i < localBoard.length; i++) {
    for (var j = 0; j < localBoard.length; j++) {
      globalBoard[localBoard[i][j].x][localBoard[i][j].y] = localBoard[i][j];
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
function clearSelect(selected){
  var selectedLength = selected.length;
  for (let i = 0; i < selectedLength; i++) {
    selected[0].classList.remove("selected")
  }
}

function makeSelect (xy) {
  clearSelect(document.getElementsByClassName("selected"));
  pos = xy.split(' ');
  var elem = localBoard[pos[0]][pos[1]].element.parentElement;
  elem.classList.add("selected");
}

function makeSelectDrag (xy) {
  if (mouseDown) {
    pos = xy.split(' ');
    localBoard[pos[0]][pos[1]].element.parentElement.classList.add("selected");
  }
}



/*////////////////////////
--==SodukuEditing==--
////////////////////////*/

document.addEventListener("keydown", (event) => {
  var selected = document.getElementsByClassName("selected");
  if (parseInt(event.key)){
    for (let i = 0; i < selected.length; i++) {
      var bigBox = selected[i].id.split(' ')[0];
      var smallBox = selected[i].id.split(' ')[1];
      updateElem(localBoard[bigBox][smallBox], event.key);
      if (altDown) {
        selected[i].classList.add("isHint");
      }
    }
  }
});

//How to use:
//Pass localBoard[bigSquare][smallBox] or globalBoard[x][y]. Then pass the new value
//example below:
//updateElem(localBoard[1][1],"T")


function updateArray(arr) {
}

function updateElem(obj, value) {
  obj.num = value
  obj.element.innerHTML = value;
}

function updateAll(){
  for (var x = 0; x < globalBoard.length; x++) {
    for (var y = 0; y < globalBoard.length; y++) {
      globalBoard[x][y].element.innerHTML = globalBoard[x][y].num;
    }
  }
}


/*////////////////////////
--=={[WARNING! BAD CODE BELOW]}==--
////////////////////////*/

function loadSudokuDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      drawTable(this);
    }
  };

  var selected = document.getElementById("selectSudoku").selectedIndex;
  selected = document.getElementsByTagName("option")[selected].value
  xhttp.open("GET", "/findSudokuByID.php?ID="+selected, true);
  xhttp.send();
}

function drawTable(xml) {
  var xmlDoc = xml.responseXML;
  var table;
  //var table="<tr> <th>1</th> <th>2</th> <th>3</th> </tr>";
  var rows = xmlDoc.getElementsByTagName("row");
  var row;

  for (i = 0; i < rows.length; i++) {
	row = rows[i].childNodes[0].nodeValue;
	for (j = 0; j < row.length; j++) {
	  updateElem(globalBoard[j][i], row[j]);
    }
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
  xhttp.open("GET", "/findSudokuByID.php?ID=0", true);
  xhttp.send();
}

function makeList(xml) {
  var i;
  var xmlDoc = xml.responseXML;
  var table="";
  var sudoku = xmlDoc.getElementsByTagName("Sudoku");
  document.getElementById("selectSudoku").innerHTML = "";
  for (i = 0; i < sudoku.length; i++) {

     var x = document.createElement("OPTION");
     x.setAttribute('value', sudoku[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue);
     var t = document.createTextNode(sudoku[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue);
     x.appendChild(t);
     document.getElementById("selectSudoku").appendChild(x);
  }
}
