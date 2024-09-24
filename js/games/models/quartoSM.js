export default class quartoSM{ 
    constructor(origin, dummy){
        if (origin){
            this._side = origin._side;

            this._nextPiece = origin._nextPiece;
    
            this._restPcs = [...origin._restPcs];
    
            this._bits = [...origin._bits];

            this.finished = false;
        }
        else {
            this._side = 0;

            this._nextPiece = 0;
    
            this._restPcs = [];
    
            this._bits = [];

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

    placeStep(step){
        const i = this._restPcs.indexOf(this._nextPiece),
            bit = 1 >>> step;
        let matte = 0;

        for (i = 0; i < 4; i++) {
            c = i << 1 | this._nextPiece >>> i & 1; //caracter
            
            matte |= this.caracMatte(this._bits[c] |= bit);
        }
        
        // removing the piece from the rest ones
        this._restPcs.splice(i, 1);
        this._nextPiece = 0;

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
        //todo: implement
    }

}
