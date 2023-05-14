export default class MCardsSM{ 
    constructor(pieces){
        this.unsolvedCards = [];
        this.unsolvedCount;
        this.selectedCard = null;
        this._pieces = pieces;

        this._startTime;
        this._endTime;
        this._stepCount = 0;
        this._periodTS;
        this._points;
    }

    get period() {
        if (this._startTime && this._endTime && this._endTime > this._startTime){
            this._periodTS = this._endTime - this._startTime;
            let m = Math.floor (this._periodTS / 60000);
            const h = Math.floor (m / 60),
                sf = ((this._periodTS - m * 60000) / 1000).toFixed(2);
            m -= h * 60;
            return h ? `${h} h ${m} min ${sf} s`
                : (m ? `${m} min ${sf} s` : `${sf} s`);
        }
        this._periodTS = -1;
        return "";
    }

    get stepCount(){
        const halftimeTS = 100 * 1000,
            halfSteps = this._pieces - 10;
        if (this._periodTS > 0 && this._stepCount >= this._pieces){
            this._points = Math.ceil(halftimeTS * 5000 / (this._periodTS + halftimeTS)
                + halfSteps * 5000 / (this._stepCount + halfSteps - this._pieces));
            return this._stepCount.toString();
        }
        this._points = 0;
        return "";
    }

    get points(){
        return this._points;
    }

    reset() {
        this.unsolvedCards.length = this._pieces;
        this.unsolvedCards.fill(1);
        this.unsolvedCount = this._pieces;

        this._stepCount = 0;
    }

    oneStep(){
        if (this._stepCount++ === 0){
            this._startTime = new Date();
        }
    }

    solved(){
        this.unsolvedCount -= 2;
        if (this.unsolvedCount <= 0){
            this._endTime = new Date();
            return true;
        }
        return false;
    }
}
