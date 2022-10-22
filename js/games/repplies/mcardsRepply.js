import GameRepply from "./gameRepply.js";

export default class MCardsRepply extends GameRepply{ 
    constructor(view){
        super(view);

    }

    //MCARDS FUNCTIONS
    _shuffle(list){
        let i, r;

        for (i = list.lengthn; i > 1; ){
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
            selected.push(temp, temp);
        }

        this._shuffle(selected);
        return selected;
    }
}
