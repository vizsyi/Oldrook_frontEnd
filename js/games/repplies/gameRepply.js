//import {GAMEBOARD_CLASSES} from "../gameConfig.js"

export default class GameRepply { 
    constructor(view, factory){
        this._viewPlug = view;
        //this._statusM = view.statusM;
        this._factory = factory;

        view.repplyPlug = this;

        this._difficultyName = "";
    }

    _difficultyHandler(inputElem){
        if (inputElem && this._setDifficulty){
            const diff = inputElem.id?.substring(11);
            if (diff !== this._difficultyName){
                this._difficultyName = diff;
                this._setDifficulty(diff);
            }
        }
        
    }

    _difficultyShow(show = true){
        if (this._factory){
            this._factory.difficultyShow(show);
            this._difficultyHandler(
                this._factory.difficultyForm?.querySelector("input:checked"));
        }
        
    }

    controlClick(ev){
        const elem = ev.target.closest(".btn");
        if (elem){
            //const id = Number.parseInt(elem.getAttribute("data-id"));
            const id = elem.id;
            if(id === "cbNewGame") this._newGame();
        }
        else {
            this._difficultyHandler(ev.target.closest("#difficultyForm input"));
        }
    }

}
