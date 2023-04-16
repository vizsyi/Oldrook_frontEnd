//import {GAMEBOARD_CLASSES} from "../gameConfig.js"

export default class GameRepply { 
    constructor(view){
        this._viewPlug = view;
        //this._statusM = view.statusM;

        view.repplyPlug = this;
    }

    controlClick(ev){
        const elem = ev.target.closest(".btn-control");
        if (elem){
            //const id = Number.parseInt(elem.getAttribute("data-id"));
            const id = elem.id;
            if(id === "cbNewGame") this._newGame();

        }
    }


}
