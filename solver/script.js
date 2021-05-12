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

//KickstartInitScript
init(document.getElementsByClassName("slider")[0].value);

//Square Object Creation
function Box (bigBoxNr,smallBoxNr,element,x,y){
  this.bigBoxNr = bigBoxNr;
  this.smallBoxNr = smallBoxNr;
  this.isReadOnly = false;
  this.num = "";
  this.centerHint;
  this.cornerHint;
  this.colourHint;
  this.element = element;
  this.x = x;
  this.y = y;
}

function init (size) {
  drawGrid(size);
  createLogicalBoard(size);
}

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
    
      localBoard[i][j] = new Box(
        i,j,                                      //bigBoxNr,smallBoxNr
        elem[i*Math.pow(size,2)+j].children[0],   //Element ref
        globalX, globalY);                        //Global X and Y possition (useful for correction algorithms)

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
  var grid = document.getElementById("sudokuGridChild");
  if(grid != null) {
    grid.remove();
  }
  grid = document.createElement("div")
  grid.id = "sudokuGridChild"
  document.getElementById("sudokuGrid").appendChild(grid);
  
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

function numpad(numpadnumber){
  if (!isNaN(numpadnumber)){
    var selected = document.getElementsByClassName("selected");
    for (let i = 0; i < selected.length; i++) {
      var bigBox = selected[i].id.split(' ')[0];
      var smallBox = selected[i].id.split(' ')[1];
      updateElem(localBoard[bigBox][smallBox], numpadnumber);  
    }
  }

  else{
    updateSelectedModifier(numpadnumber);
  }
}

/*////////////////////////
--==SodukuEditing==--
////////////////////////*/

document.addEventListener("keydown", (event) => {
  var selected = Array.from(document.getElementsByClassName("selected"));
  var key = (event.code[event.code.length-1]);//This does not work in current consumer Versions of firefox, but bete works fine (2021-05-12)
  if (parseInt(key)){
    for (let i = 0; i < selected.length; i++) {
      var bigBox = selected[i].id.split(' ')[0];
      var smallBox = selected[i].id.split(' ')[1];
      
      if (event.shiftKey) {
        selected[i].classList.add("cornerHint");
      }

      else if (event.ctrlKey) {
        selected[i].classList.add("centerHint");
      }

      else if (event.altKey) {
        selected[i].classList.add("colourHint");
      }

      else{
        selected[i].classList.value = "square selected";
        updateElem(localBoard[bigBox][smallBox], "");
      }

      updateElem(localBoard[bigBox][smallBox], localBoard[bigBox][smallBox].num+""+key);

      if (document.getElementById("selectionClearing").checked){
        selected[i].classList.remove("selected");
      }
    }
  }
  else if(event.key == "Shift" || event.key == "Alt" || event.key == "Control") {updateSelectedModifier(event.key);}
  event.preventDefault();
});

document.addEventListener("keyup", (event) => {
  if(event.key == "Shift" || event.key == "Alt" || event.key == "Control"){updateSelectedModifier("Normal");}
});

function updateSelectedModifier(editModifierMode){
  var modiKeys = document.getElementsByClassName("modifierKey");
  var selectedKeys = document.getElementsByClassName("selectedButton");

  if (selectedKeys.length != 0){
    while(selectedKeys.length > 0){
      selectedKeys[0].classList.remove("selectedButton");
    }
  }
  
  switch (editModifierMode) {
    case "Alt":
      document.getElementById("altToggleButton").classList.toggle("selectedButton");
      break;

    case "Shift":
      document.getElementById("shiftToggleButton").classList.toggle("selectedButton");
      break;  

    case "Control":
      document.getElementById("controlToggleButton").classList.toggle("selectedButton");
      break;  
    
    case "Normal":
      document.getElementById("normalToggleButton").classList.toggle("selectedButton");
      break;  

    default:
      console.error("[ERROR] Requested modifier mode not found! Are you using the wrong version?");
      console.error("[ERROR] How did you manage to fuck up this bad? Please call us at {$PHONE_NUMBER_HERE}");
      break;
  }
}

//How to use:
//Pass localBoard[bigSquare][smallBox] or globalBoard[x][y]. Then pass the new value
//exempel below:
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
