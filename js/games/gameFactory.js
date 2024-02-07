import MCardsView from "./views/mcardsView.js";
import MCardsRepply from "./repplies/mcardsRepply.js";
import C4View from "./views/c4View.js";
import C4Repply from "./repplies/c4Repply.js";
import MorrisView from "./views/morrisView.js";
//import {GAMEFIELD_CLASSES} from "./gameConfig.js"
import RLOG from "../log/rookLog.js";

class GameFactory {
    constructor (){
        this._game;
        this._mainView;
        //this._mainRepply;
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

            default:
                throw new RangeError("Unknown game");
        }

        return view;
    }

    _addNewView(game, desk, active, id){
        this._mainView?.dispo();
        this._mainView = this._createView(game, desk, active, id);
    }

    _init (){
        let game;
        
        //Activedesk init
        if (this._activeDesk){
            const urlParams = new URLSearchParams(window.location.search);
            game = urlParams.get('rg');//todo: must be lowercase
            console.log(urlParams, "UrlParam:", game);

            if (game){
                this._addNewView(game, this._activeDesk, true, 0);
            }
            else {
                game = "actg error";
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
        }
        else {
            game = "index";
            this.addNewViews();
        }
        
        //todo: replace addNewViews with a block using createView

        this._control?.addEventListener('click'
            , ev => this._mainRepply?.controlClick(ev));

        RLOG.webStart(game);//todo: webStart must accept game parameter
    }

    _labelChange (){
        const game = this._labelSelect.value;
        console.log(game);
        this._labelSelect.blur();
        if (game !== this._game){
            this._game = game;
            this._addNewView(game, this._activeDesk, true, 0);
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
 