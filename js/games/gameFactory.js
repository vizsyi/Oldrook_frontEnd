import MCardsView from "./views/mcardsView.js";
import MCardsRepply from "./repplies/mcardsRepply.js";
import C4View from "./views/c4View.js";
import C4Repply from "./repplies/c4Repply.js";

class GameFactory {
    constructor (){
        this._game;
        this._mainView;
        this._mainRepply;

        this._labelSelect = document.getElementById("gameLabel");

        //this._board = document.getElementById("gameBoard-main");
        this._board = document.querySelector("#gameDesk-main .game_board");

        this._control = document.getElementById("controlBoard");
        this.difficultyForm = this._control?.querySelector("#difficultyForm");

        this._difficultyShow = false;

        this._init();
    }

    _init (){
        let game = localStorage.getItem("rookgame");

        if (game &&
            [...this._labelSelect.options].some(op => op.value === game)){
            this._labelSelect.value = game;
        }
        else {
            game = this._labelSelect.options;
        }

        this._labelSelect.addEventListener("change", this._labelChange.bind(this));

        this._control.addEventListener('click'
            , ev => this._mainRepply?.controlClick(ev));

        this.addNewView(game);
    }

    _labelChange (){
        const game = this._labelSelect.value;
        this._labelSelect.blur();
        this.addNewView(game);
        localStorage.setItem("rookgame", game);
    }

    difficultyShow (show = false){
        console.log("diffShow", this, this.difficultyForm);
        if (this._difficultyShow !== show){
            if(show){
                this.difficultyForm?.classList.add("show");
            }
            else {
                this.difficultyForm?.classList.remove("show");
            }
            this._difficultyShow = show;
        }
    }
    
    addNewView (game = "mcard"){
        if (this._game !== game){
            this._game = game;
            this.difficultyShow (false);
            this._mainView?.dispo();
            switch(game){
                case "connect4":
                    this._mainView = new C4View(this._board);
                    this._mainRepply = new C4Repply(this._mainView, this);
                    break;
                default:
                    this._mainView = new MCardsView(this._board);
                    this._mainRepply = new MCardsRepply(this._mainView, this);
            }
        }

        return this._mainView;
    }
    
 }

 export default new GameFactory();
 