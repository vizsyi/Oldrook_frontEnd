import MCardView from "./views/mcardsView.js";

class GameFactory {
    constructor (){
        this._mainGame;
        this._board = document.getElementById("gameBoard-main");
    }

    addNewView (){
        this._mainGame?.dispo();
        this._mainGame = new MCardView(this._board);
        return this._mainGame;
    }
    
 }

 export default new GameFactory();