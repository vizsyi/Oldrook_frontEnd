import MCardsView from "./views/mcardsView.js";
import MCardsRepply from "./repplies/mcardsRepply.js";
import C4View from "./views/c4View.js";

class GameFactory {
    constructor (){
        this._game;
        this._mainView;
        this._mainRepply;
        //this._board = document.getElementById("gameBoard-main");
        this._board = document.querySelector("#gameDesk-main .game_board");
        this._labelSelect = document.getElementById("gameLabel");

        this._init();
    }

    _init (){
        let game = localStorage.getItem("rookgame");

        if (game &&
            [...this._labelSelect.options].some(op => op.value === game)){
            this._labelSelect.options = game;
        }
        else {
            game = this._labelSelect.options;
        }

        this._labelSelect.addEventListener("change", this._labelChange.bind(this));

        this.addNewView(game);
    }

    _labelChange (){
        console.log("label changed");
        this._labelSelect.blur();
        this.addNewView(this._labelSelect.value);
    }

    addNewView (game = "mcard"){
        if (this._game !== game){
            this._game = game;
            this._mainView?.dispo();
            switch(game){
                case "connect4":
                    this._mainView = new C4View(this._board);
                    break;
                default:
                    this._mainView = new MCardsView(this._board);
                    this._mainRepply = new MCardsRepply(this._mainView);
            }
        }

        return this._mainView;
    }
    
 }

 export default new GameFactory();
 