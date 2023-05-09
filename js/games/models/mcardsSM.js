export default class MCardsSM{ 
    constructor(pieces){
        this.unsolvedCards = [];
        this.unsolvedCount;
        this.selectedCard = null;
        this._pieces = pieces;

        this.startTime;
        this.endTime;
        this.stepCount = 0;
    }

    reset() {
        this.unsolvedCards.length = this._pieces;
        this.unsolvedCards.fill(1);
        this.unsolvedCount = this._pieces;

        this.stepCount = 0;
    }

    oneStep(){
        if (this.stepCount++ === 0){
            this.startTime = new Date();
        }
    }

    solved(){
        this.unsolvedCount -= 2;
        if (this.unsolvedCount <= 0){
            this.endTime = new Date();
            return true;
        }
        return false;
    }
}
