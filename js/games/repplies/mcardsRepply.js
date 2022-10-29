import GameRepply from "./gameRepply.js";
import {DUMMY_CELEBS} from "../dummyData.js"

export default class MCardsRepply extends GameRepply{ 
    constructor(view){
        super(view);

        this._pieces = view.pieces;
        this._allCards = [...DUMMY_CELEBS];
        this._gameCards;
        this._firstMem = null;

        this._newGame();
    }

    _newGame (){
        this._gameCards = this._selectingCards(this._allCards, this._pieces);

        this._statusM.reset();
        this._viewPlug.newGame();
    }

    _move (index){
        let card;

        if (index < 0 || index >= this._pieces) 
            throw new RangeError("Invalid position");

        if (this._statusM.unsolvedCards[index] !== 1
            || this._firstMem && this._firstMem.index === index) return;

        card = this._gameCards[index];
        card.index = index;

        if(this._firstMem){
            this._viewPlug.move([this._firstMem, card]
                , this._firstMem.pairId === card.pairId);
            this._firstMem = null;
        }
        else {
            this._firstMem = card;
            this._viewPlug.move([card]);
        }
    }

    intend (index){
        setTimeout(this._move.bind(this, index), 500);
    }

    //MCARDS FUNCTIONS
    _shuffle(list){
        let i, r;

        for (i = list.length; i > 1; ){
            r = Math.floor(Math.random() * i--);
            if (i != r) [list [i], list [r]] = [list [r], list [i]];
        }
    }

    _selectingCards(list, pcs){
        let half, i, len, r, temp;
        const selected = [];

        half = Math.floor (pcs / 2);
        len = list.length;
        if(half > len) throw new Error("Dummy list too short!");

        for (i = 0; i < half; i++){
            r = Math.floor(Math.random() * (len - i) + i);
            temp = list [r];
            if (i != r) [list [i], list [r]] = [list [r], list [i]];

            temp.pairId = i;
            temp.solved = false;
            selected.push(temp, {...temp});
        }

        this._shuffle(selected);
        return selected;
    }
}
