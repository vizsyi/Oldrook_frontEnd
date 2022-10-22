export default class MCardsSM{ 
    constructor(pieces){
        this.unsolvedCards = [];
        this.unsolvedCount;
        this.selectedCard = null;
        this._pieces = pieces;
    }

    reset () {
        this.unsolvedCards.length = this._pieces;
        this.unsolvedCards.fill(1);
        this.unsolvedCount = this._pieces;
    }
}