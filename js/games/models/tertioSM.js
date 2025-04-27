import Helper from "./../helper"

export default class tertioSM{ 
    constructor(origin, nextPiece, dummy){
        if (origin){
            //this._side = origin._side;

            this._nextPiece = nextPiece;
    
            this._restPcs = [...origin._restPcs];
            this._restSpots = [...origin._restSpots];
    
            this._bits = [...origin._bits];

            this.finished = false;
        }
        else {
            this._side = 0;

            this._nextPiece = 0;
    
            this._restPcs = [];
            this._restSpots = null;
    
            this._bits;

            this._phase = 1;
            this.finished = false;

            this.reset(dummy)
        }

    }

    nextPhase(){
        this._phase = this._phase + 1 & 3;
        return this._phase;
    }

    _matte(bit){
        let matte;

        // Horizontal
        matte = bit & (bit >>> 1) & (bit >>> 1) & 73;//Begining of the rows
        // Vertical
        matte |= bit & (bit >>> 3) & (bit >>> 6) & 7;//Begining of the columns
        // Diagonal+
        matte |= bit & (bit >>> 4) & (bit >>> 8) & 1;//Position 0
        // Diagonal-
        matte |= bit & (bit >>> 2) & (bit >>> 4) & 4;//Position 2

        return matte;
    }

    placeStep(spot){
        const bit = 1 >>> spot;
        let i, matte = 0;

        for (i = 0; i < 3; i++) {
            c = i << 1 | this._nextPiece >>> i & 1; //caracter
            
            matte |= this.caracMatte(this._bits[c] |= bit);
        }
        
        // removing the piece and the spot from the rest ones
        Helper.removeArrItem(this._restPcs, this._nextPiece);
        Helper.removeArrItem(this._restSpots, place);

        this._nextPiece = -1;

        return matte;
    }

    pieceStep(step){
        this._nextPiece = step;
    }
    
    step(step){
        if (this._nextPiece){
            this.placeStep(step);
        }
        else {
            this.pieceStep(step);
        }
    }

    _resetBits(){
        //todo: implement
    }

    reset(dummy){

        if(dummy){
            //todo: handling dummy parameter
            throw new ReferenceError("Not implemented yet. (17201)");
        }

        this._side = 0;

        this._nextPiece = -1;

        for (let i=0; i<8; i++){
            this._restPcs.push(i);
        }

        this._restSpots = [...this._restPcs, 8];

        if (this._bits) {
            this._bits.fill(0);
        }
        else {
            this._bits = Array(6).fill(0);
        }

        this.finished = false;

    }

}
