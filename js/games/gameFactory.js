import MCardsView from "./views/mcardsView.js";
import MCardsRepply from "./repplies/mcardsRepply.js";
import C4View from "./views/c4View.js";
import C4Repply from "./repplies/c4Repply.js";
import MorrisView from "./views/morrisView.js";
import QuartoView from "./views/quartoView.js";
import TertioView from "./views/tertioView.js";
//import {GAMEFIELD_CLASSES} from "./gameConfig.js"
import RLOG from "../log/rookLog.js";

class GameFactory {
    constructor (){
        this._game;
        this._activeView;
        //this._activeRepply;
        this._views = [];

        this._labelSelect = document.getElementById("gameLabel");
        this._activeDesk = document.getElementById("activeGameDesk");
        //this._fieldE = document.getElementById("gameField");

        this._showDesks = document.querySelectorAll(".gamedesk:not(#activeGameDesk)");

        this._control = document.getElementById("controlBoard");
        this.difficultyForm = this._control?.querySelector("#difficultyForm");

        this._difficultyShow = false;

        this._init();
        //this.addNewViews();
    }

    _createView (game, desk, active = false, i=0){
        let view;
        switch(game){
            case "mcard":
                view = new MCardsView(this, desk, active, i);
                new MCardsRepply(view);
                break;

            case "c4":
                view = new C4View(this, desk, active, i);
                new C4Repply(view);
                break;

            case "morris":
                view = new MorrisView(this, desk, active, i);
                break;

            case "quarto":
                view = new QuartoView(this, desk, active, i);
                break;

            case "tertio":
                view = new TertioView(this, desk, active, i);
                break;

            default:
                game = "BadC/UkG_" + game;
                throw new RangeError("Unknown game");
        }

        return [view, game];
    }

    _addActiveView(game, desk, active, id){
        this._activeView?.dispo();
        [this._activeView, game] = this._createView(game, desk, active, id);
        return game;
    }

    _keyboardEventHandler(ev){
        this._activeView?.keyboardEvent(ev);
    }

    _init (){
        let game;
        
        //Activedesk init
        if (this._activeDesk){
            const urlParams = new URLSearchParams(window.location.search);
            game = urlParams.get('rg');//todo: must be lowercase
            console.log(urlParams, "UrlParam:", game);

            if (game){
                game = this._addActiveView(game, this._activeDesk, true, 0);
            }
            else {
                game = "BadC/NoRGame";
            }
            //let game = localStorage.getItem("rookgame");

            if(this._labelSelect){
                if (game &&
                    [...this._labelSelect.options].some(op => op.value === game)){
                    this._labelSelect.value = game;
                }
                else {
                    this._labelSelect.value = "-";
                }
    
                this._labelSelect.addEventListener("change", this._labelChange.bind(this));
            }

            document.addEventListener("keydown", this._keyboardEventHandler.bind(this));
        }
        else {
            game = "index";
            this.addNewViews();
        }
        
        //todo: replace addNewViews with a block using createView

        this._control?.addEventListener('click'
            , ev => this._activeView?.repplyPlug?.controlClick(ev));

        RLOG.webStart(game);//todo: webStart must accept game parameter
    }

    _labelChange (){
        const game = this._labelSelect.value;
        console.log(game);
        this._labelSelect.blur();
        if (game !== this._game){
            this._game = game;
            this._addActiveView(game, this._activeDesk, true, 0);
        }
        //localStorage.setItem("rookgame", game);
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
        //todo: must rework
        if (id < 0 || id >= this._views.length) throw new RangeError("Invalid desk index");
        this._activeView?.deactivate();

        this._activeView = this._views[id];
        this._activeRepply = this._activeView.repplyPlug;
        this._activeView.activate();

        // Class Cleaning
        this._fieldE.classList.remove("gf-show");
        // [...this._fieldE.classList].forEach(cl => {
        //     if(!GAMEFIELD_CLASSES.includes(cl)) this._fieldE.classList.remove(cl);
        // });

    }
    
    addNewViews (){
        let view;
        if (this._showDesks.length < 2) throw RangeError("Too less game desks");
        // MCards
        view = new MCardsView(this, this._showDesks[0], false, 0);
        new MCardsRepply(view);
        this._views.push(view);
        // C4
        view = new C4View(this, this._showDesks[1], false, 1);
        new C4Repply(view);
        this._views.push(view);
        // Morris
        if (this._showDesks.length > 2){
            view = new MorrisView(this, this._showDesks[2], false, 2);
        }
    }

/*  addNewView (game = "mcard"){
        if (this._game !== game){
            this._game = game;
            this.difficultyShow (false);
            this._activeView?.dispo();
            switch(game){
                case "connect4":
                    this._activeView = new C4View(this._desk);
                    this._activeRepply = new C4Repply(this._activeView, this);
                    break;
                default:
                    this._activeView = new MCardsView(this._desk);
                    this._activeRepply = new MCardsRepply(this._activeView, this);
            }
        }

        return this._activeView;
    }*/
    
 }

 export default new GameFactory();
 