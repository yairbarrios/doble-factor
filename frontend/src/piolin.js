//import * as dat from "dat.gui";
//importing chessborad component
//import "./components/ChessBoard.js";


/* - Here we initialize the board by creating the board element in the HTML.
   - Then we set the initial position if the chess pieces.
   - The initial sequence is the following:
      - the lowercase are for the black pieces
      - the eights are for the blank cells
      - the uppercase are for the white pieces
*/
//const board = document.createElement("chess-board");
//board.setFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");


/* Here we are using dat.GUI library as a sking controller.
    - when we initialize the library, we set the options for
      pieces and themes and inside those options we create the
      different skins */

/*Verifico suscripción*/
const getPlayer = async (Utils) => {
  try {
    const response = await Utils.postService({
        service: "validateSession", 
        data: {}, 
        method: "GET" 
    });
    if(response.succes){
      return {
        succes: true,
        player: response.player
      };
    }else{
      if(response.error.cod === "UNAUTHORIZED"){
        Utils.navigate({
          route: "login"
        });
      }else{
        alert(response.error.cod + ": " + response.error.message);
      }
    }
  } catch(error) {
    console.error(error);
  }
  return {
    succes: false
  };
}

let player = await getPlayer(document.Utils);
if(player.succes){
  let playerData = player.player;
  let usuario = playerData.id;
}