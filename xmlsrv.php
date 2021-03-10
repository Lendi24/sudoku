<?php //hackerman
  //XML init stuff
  header('Content-Type: text/xml');
  echo "<data>";
//detta fungera?
  //This script has the conection variable, and for security reasons, is outside the html folder
  include '../php/connectBrowserDB-User.php';

  //Getting the "?ID=" variable from url.
  switch($_GET[ID]){
    case '-1': //ID -1 is not used, so it is used to show mow long DB-table is
      echo 'FUNCTION';
      break;

    case '0': //ID 0 is not used, so it is used to list names
      $sql = "SELECT ID, name FROM sudoku;";
      $result = mysqli_query($conn, $sql);
      if (mysqli_num_rows($result) > 0) {
      // output data of each row
        while($row = mysqli_fetch_assoc($result)) {
          echo "<Sudoku>";
          echo "<Name>".$row["name"]."</Name>";
          echo "<ID>".$row["ID"]."</ID>";
          echo "</Sudoku>";
        }
      }
      break;

    default:
      $sql = "SELECT * FROM sudoku WHERE ID=".$_GET[ID].";";
      $result = mysqli_query($conn, $sql);
      if (mysqli_num_rows($result) > 0) {
      // output data of each row
        while($row = mysqli_fetch_assoc($result)) {
          echo "<ID>".$row["ID"]."</ID>";
          echo "<Name>".$row["name"]."</Name>";
          echo "<UserCreated>".$row["userCreated"]."</UserCreated>";
          echo "<DateCreated>".$row["dateCreated"]."</DateCreated>";

          if (file_exists($row["xmlDir"])) { //Add sudoku file to XML out
            echo file_get_contents($row["xmlDir"]);
          }
        }
      }
      break;
  }

  echo "</data>"; //XML out
  mysqli_close($conn); //Kill conection to db
?>
