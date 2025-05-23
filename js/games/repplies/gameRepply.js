//import {GAMEBOARD_CLASSES} from "../gameConfig.js"

export default class GameRepply { 
    constructor(view, difficultyDepthMap = null){
        this._viewPlug = view;
        this._factory = view.factory;
        this._statusM;

        view.repplyPlug = this;

        //Negamax depth & difficulty form
        this._difficultyDepthMap = difficultyDepthMap;

        this._useDifficulty = difficultyDepthMap !== null;
        this._negamaxDepth = this._useDifficulty ? difficultyDepthMap.values().next().value : 0;
        this._difficultyName = "";

        if (this._viewPlug.active) this.activate();
    }

    _setDifficulty(diffName){
        let depth = this._difficultyDepthMap.get(diffName);
        if (depth){
            this._negamaxDepth = depth;
        }
        else {
            throw new RangeError("Invalid difficulty id");
        }
        console.log("Diff setDiff: ", this._negamaxDepth);
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

    activate(){
        // Show difficulty form
        if (this._useDifficulty) this._difficultyShow(true);
    }

    deactivate(){
        this._difficultyShow(false);
    }

    controlClick(ev){
        console.log("Control click");
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

    dispo(){
        this._viewPlug = null;
        this._statusM = null;
        this._factory = null;
    }

}
