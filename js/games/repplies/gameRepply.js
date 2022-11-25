//import {GAMEBOARD_CLASSES} from "../gameConfig.js"

export default class GameRepply { 
    constructor(view){
        this._viewPlug = view;
        //this._statusM = view.statusM;

        view.repplyPlug = this;
    }


}
