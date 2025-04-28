import Helper from "./../helper.js"

export default class quartoSM{ 
    constructor(origin, nextPiece, dummy){
        if (origin){
            this._side = origin._side;

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

            this.finished = false;

            this.reset(dummy)
        }

    }

    caracMatte(bit){
        let neigh, matte;

        // Horizontal
        matte = bit & (bit >>> 1);
        matte &= (matte >>> 2) & 4369;//Begining of the rows
        // Vertical
        neigh = bit & (bit >>> 4);
        matte |= neigh & (neigh >>> 8) & 15;//Begining of the columns
        // Diagonal+
        neigh = bit & (bit >>> 5);
        matte |= neigh & (neigh >>> 10) & 1;//Position 0
        // Diagonal-
        neigh = bit & (bit >>> 3);
        matte |= neigh & (neigh >>> 6) & 8;//Position 3

        // Return
        return matte
    }

    placeStep(spot){
        const bit = 1 >>> spot;
        let matte = 0;

        for (i = 0; i < 4; i++) {
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

    reset(dummy){
        
        if(dummy){
            //todo: handling dummy parameter
            throw new ReferenceError("Not implemented yet. (16201)");
        }

        this._side = 0;

        this._nextPiece = -1;

        for (let i=0; i<16; i++){
            this._restPcs.push(i);
        }

        this._restSpots = [...this._restPcs];

        if (this._bits) {
            this._bits.fill(0);
        }
        else {
            this._bits = Array(8).fill(0);
        }

        this.finished = false;

    }

}
