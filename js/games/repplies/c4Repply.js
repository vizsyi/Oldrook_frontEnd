import GameRepply from "./gameRepply.js";

export default class C4Repply extends GameRepply{ 
    constructor(view){
        super(view);

        this._newGame();
    }

    _newGame (){
        this._gameCards = this._selectingCards(this._allCards, this._pieces);

        this._statusM.reset();
        this._viewPlug.newGame();
    }

    _move (col){

        if (col < 0 || index >= 6) 
            throw new RangeError("Invalid position");

        if (this._statusM.colRest[col] <= 0) return;

        this._viewPlug.move(col);
    }

    intend (col){
        setTimeout(this._move.bind(this, col), 500);
    }

}
