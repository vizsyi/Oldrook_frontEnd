import GameRepply from "./gameRepply.js";

export default class C4Repply extends GameRepply{ 
    constructor(view){
        super(view);

        this._newGame();
    }

    _newGame (){
        this._statusM.reset();
        this._viewPlug.newGame();
    }

    _move (col){

        if (col < 0 || col >= 7) 
            throw new RangeError("Invalid position");

        if (this._statusM.colRest[col] <= 0 || this._statusM.finished) return;

        this._statusM.move(col);
        if (this._statusM.matte() || this._statusM.restPcs <=0)
            this._statusM.finished = true;

        this._viewPlug.move(col);
        this._statusM.nextSide();
    }

    intend (col){
        setTimeout(this._move.bind(this, col), 500);
    }

}
