import MCardsView from "./views/mcardsView.js";
import MCardsRepply from "./repplies/mcardsRepply.js";
import C4View from "./views/c4View.js";
import C4Repply from "./repplies/c4Repply.js";
//import {GAMEFIELD_CLASSES} from "./gameConfig.js"
import RLOG from "../log/rookLog.js";

class GameFactory {
    constructor (){
        this._game;
        this._mainView;
        this._mainRepply;
        this._views = [];

        this._labelSelect = document.getElementById("gameLabel");
        this._fieldE = document.getElementById("gameField");

        this._desks = this._fieldE?.querySelectorAll(".gamedesk");
        //this._desk = document.getElementById("gameDesk-main");
        //this._board = document.querySelector("#gameDesk-main .game_board");

        this._control = document.getElementById("controlBoard");
        this.difficultyForm = this._control?.querySelector("#difficultyForm");

        this._difficultyShow = false;

        this._init();
    }

    _init (){
        RLOG.webStart();
        
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

        //this.addNewView(game);
        this.addNewViews();
    }

    _labelChange (){
        const game = this._labelSelect.value;
        this._labelSelect.blur();
        this.addNewView(game);
        localStorage.setItem("rookgame", game);
    }

    difficultyShow (show = false){
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

    /**
     * 
     * @param {int} id 
     */
    gameClick(id){
        if (id < 0 || id >= this._views.length) throw RangeError("Invalid desk index");
        this._mainView?.resetMain();

        this._mainView = this._views[id];
        this._mainRepply = this._mainView.repplyPlug;
        this._mainView.setMain();

        // Class Cleaning
        this._fieldE.classList.remove("gf-show");
        // [...this._fieldE.classList].forEach(cl => {
        //     if(!GAMEFIELD_CLASSES.includes(cl)) this._fieldE.classList.remove(cl);
        // });

    }
    
    addNewViews (){
        let view;
        if (this._desks.length < 2) throw RangeError("Too less game desks");
        // MCards
        view = new MCardsView(this, this._desks[0], 0);
        new MCardsRepply(view);
        this._views.push(view);
        // C4
        view = new C4View(this, this._desks[1], 1);
        new C4Repply(view);
        this._views.push(view);
    }

/*  addNewView (game = "mcard"){
        if (this._game !== game){
            this._game = game;
            this.difficultyShow (false);
            this._mainView?.dispo();
            switch(game){
                case "connect4":
                    this._mainView = new C4View(this._desk);
                    this._mainRepply = new C4Repply(this._mainView, this);
                    break;
                default:
                    this._mainView = new MCardsView(this._desk);
                    this._mainRepply = new MCardsRepply(this._mainView, this);
            }
        }

        return this._mainView;
    }*/
    
 }

 export default new GameFactory();
 