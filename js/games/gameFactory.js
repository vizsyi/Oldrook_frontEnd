import MCardsView from "./views/mcardsView.js";
import MCardsRepply from "./repplies/mcardsRepply.js";
import C4View from "./views/c4View.js";
import C4Repply from "./repplies/c4Repply.js";
import MorrisView from "./views/morrisView.js";
import QuartoView from "./views/quartoView.js";
import TertioView from "./views/tertioView.js";
import TertioRepply from "./repplies/tertioRepply.js";
//import {GAMEFIELD_CLASSES} from "./gameConfig.js"
import RLOG from "../log/rookLog.js";

class GameFactory {
    constructor() {
        // Landing part
        this._landing_games = ["matching-players", "connect-4", "tertio"];
        this._landingE = document.getElementById("gameLanding");

        // Active part
        this._game;
        this._activeView;
        //this._activeRepply;

        this._labelSelect;

        this._control;
        this.difficultyForm;

        this._difficultyShow = false;

        this._activeDesk = document.getElementById("activeGameDesk");
        //this._fieldE = document.getElementById("gameField");

        // Obsolate
        //this._views = [];
        //this._showDesks = document.querySelectorAll(".gamedesk:not(#activeGameDesk)");
        //let game = localStorage.getItem("rookgame");

        this._init();
        //this.addNewViews();
    }

    _createView(gname, desk, active = false) {
        let view;
        switch (gname) {
            case "matching-players":
                view = new MCardsView(this, desk, active);
                new MCardsRepply(view);
                break;

            case "connect-4":
                view = new C4View(this, desk, active);
                new C4Repply(view);
                break;

            case "morris":
                view = new MorrisView(this, desk, active);
                break;

            case "quarto":
                view = new QuartoView(this, desk, active);
                break;

            case "tertio":
                view = new TertioView(this, desk, active);
                new TertioRepply(view);
                break;

            default:
                gname = "BadC/UkG_" + gname;
                throw new RangeError("Unknown game");
        }

        return [view, gname];
    }

    _gameCardClick(ev) {
        const cardE = ev.target.closest(".gamecard");
        if (cardE) {
            //const id = cardE.getAttribute("data-game");
            const gname = cardE.dataset.game;
            sessionStorage.setItem("rgame", gname);
            window.location.href = "rookgame.html";
        }
    }

    _landing(rules) {
        const fragmentF = document.createDocumentFragment();
        let cardE, deskE, divE, rowE, titleE, view, rule;

        this._landing_games.forEach(gname => {
            cardE = document.createElement("div");
            cardE.classList.add("gamecard");
            titleE = document.createElement("h2");
            cardE.appendChild(titleE);
            rowE = document.createElement("div");
            cardE.appendChild(rowE);
            //drawing the row
            //anchE =document.createElement("a");
            //rowE.appendChild(anchE);
            deskE = document.createElement("div");
            deskE.classList.add("gamedesk");
            rowE.appendChild(deskE);
            rowE.appendChild(document.createElement("div"));
            divE = document.createElement("div");
            rowE.appendChild(divE);
            //drawing the desk
            view = this._createView(gname, deskE)[0];
            //setting the properties
            //anchE.href = "rookgame.html?rg=" + gname;
            cardE.dataset.game = gname;
            titleE.textContent = view.gameTitle;
            if (rules !== null) {
                rule = rules[gname];
                if (rule) {
                    divE.innerHTML = rule;
                }
            }

            fragmentF.appendChild(cardE);
        });

        this._landingE.appendChild(fragmentF);
    }

    _addActiveView(game, desk, active, id) {
        this._activeView?.dispo();
        [this._activeView, game] = this._createView(game, desk, active, id);

        document.title = this._activeView
            ? this._activeView.gameTitle + " at Oldrook"
            : "Oldrook";

        return game;
    }

    _keyboardEventHandler(ev) {
        this._activeView?.keyboardEvent(ev);
    }

    _labelChange() {
        const game = this._labelSelect.value;
        console.log(game);
        this._labelSelect.blur();
        if (game !== this._game) {
            this._game = game;
            this._addActiveView(game, this._activeDesk, true, 0);
        }
        //localStorage.setItem("rookgame", game);
    }

    difficultyShow(show = false) {
        if (this._difficultyShow !== show) {
            if (show) {
                this.difficultyForm?.classList.add("show");
            }
            else {
                this.difficultyForm?.classList.remove("show");
            }
            this._difficultyShow = show;
        }
    }

    _init() {
        let gname;

        // Landing page init
        if (this._landingE) {
            gname = "index";

            fetch("./src/game_rules.json")
                .then(response => response.json())
                .then(data => {
                    this._landing(data);
                })
                .catch(error => {
                    console.error("Error loading the JSON file: ", error);
                    this._landing(null);
                });

            this._landingE.addEventListener("click", this._gameCardClick);
        }

        // Activedesk init
        if (this._activeDesk) {
            this._labelSelect = document.getElementById("gameLabel");

            this._control = document.getElementById("controlBoard");
            this.difficultyForm = this._control?.querySelector("#difficultyForm");

            const urlParams = new URLSearchParams(window.location.search);
            gname = urlParams.get("game"); //todo: must be lowercase
            //console.log(urlParams, "UrlParam:", gname);

            if (!gname) gname = sessionStorage.getItem("rgame");

            if (gname) {
                gname = this._addActiveView(gname.toLowerCase(), this._activeDesk, true, 0);
            }
            else {
                gname = "BadC/NoRGame";
            }

            if (this._labelSelect) {
                if (gname &&
                    [...this._labelSelect.options].some(op => op.value === gname)) {
                    this._labelSelect.value = gname;
                }
                else {
                    this._labelSelect.value = "-";
                }

                this._labelSelect.addEventListener("change", this._labelChange.bind(this));
            }

            document.addEventListener("keydown", this._keyboardEventHandler.bind(this));

            this._control?.addEventListener("click", ev =>
                this._activeView?.repplyPlug?.controlClick(ev),
            );
        }
        /*
        else {
            gname = "index";
            this.addNewViews();
        }*/

        if (!gname) {
            gname = "BadC/NoGElem";
        }

        //todo: replace addNewViews with a block using createView

        RLOG.webStart(gname); //todo: webStart must accept gname parameter
    }

    /**
     * 
     * @param {int} id 
     */
    /*
    gameClick(id){
        //todo: must rework
        if (id < 0 || id >= this._views.length) throw new RangeError("Invalid desk index");
        this._activeView?.deactivate();

        this._activeView = this._views[id];
        //this._activeRepply = this._activeView.repplyPlug;
        this._activeView.activate();

        // Class Cleaning
        this._fieldE.classList.remove("gf-show");
        // [...this._fieldE.classList].forEach(cl => {
        //     if(!GAMEFIELD_CLASSES.includes(cl)) this._fieldE.classList.remove(cl);
        // });

    }
        */

    /*
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
    */

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
