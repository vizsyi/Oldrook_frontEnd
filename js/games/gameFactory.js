import MCardsView from "./views/mcardsView.js";
import MCardsRepply from "./repplies/mcardsRepply.js";

class GameFactory {
    constructor (){
        this._mainView;
        this._mainRepply;
        this._board = document.getElementById("gameBoard-main");
    }

    addNewView (){
        this._mainView?.dispo();
        this._mainView = new MCardsView(this._board);
        this._mainRepply = new MCardsRepply(this._mainView);
        return this._mainView;
    }
    
 }

 export default new GameFactory();
 