import Helper from "./../helper.js"

export default class TertioSM{ 
    constructor(origin, dummy){ //, selectedPc
        if (origin){
            //this._side = origin._side;

            this._selectedPc = origin._selectedPc;
    
            this.restPcs = [...origin.restPcs];
            this.restSpots = [...origin.restSpots];
    
            this._bits = [...origin._bits];

            this.finished = false;
        }
        else {
            this._side = 0;

            this._selectedPc = -1;
    
            this.restPcs = [];
            this.restSpots = null;
    
            this._bits;

            this._phase = 1;
            this.finished = false;

            //this.reset(dummy)
        }

    }

    get nextPhase(){
        this._phase = this._phase + 1 & 3;
        return this._phase;
    }

    get phase(){
        return this._phase;
    }

    get restCount(){
        return this.restPcs.length;
    }

    get selectedPc(){
        return this._selectedPc;
    }

    isFinished() {
        if(this.restPcs.length === 0){
            this.finished = true;
            return true;
        }

        return false;
    }

    _caracMatte(bit){
        let matte;

        // Horizontal
        matte = bit & (bit >>> 1) & (bit >>> 2) & 73;//Begining of the rows
        // Vertical
        matte |= bit & (bit >>> 3) & (bit >>> 6) & 7;//Begining of the columns
        // Diagonal+
        matte |= bit & (bit >>> 4) & (bit >>> 8) & 1;//Position 0
        // Diagonal-
        matte |= bit & (bit >>> 2) & (bit >>> 4) & 4;//Position 2

        return matte;
    }

    whichMatte(){
        let matte = 0, m1;
        this._bits.forEach(bit => {
            // Horizontal
            m1 = bit & (bit >>> 1) & (bit >>> 2) & 73;//Begining of the rows
            if(m1){
                matte |= m1 | m1 << 1 | m1 << 2;
            }
            // Vertical
            m1 = bit & (bit >>> 3) & (bit >>> 6) & 7;//Begining of the columns
            if(m1){
                matte |= m1 | m1 << 3 | m1 << 6;
            }
            // Diagonal+
            m1 = bit & (bit >>> 4) & (bit >>> 8) & 1;//Position 0
            if(m1){
                matte |= 273;
            }
            // Diagonal-
            m1 = bit & (bit >>> 2) & (bit >>> 4) & 4;//Position 2
            if(m1){
                matte |= 84;
            }
        });

        return matte;
    }

    placeStep(spot){
        const bit = 1 << spot;
        let c, i, matte = 0;

        for (i = 0; i < 3; i++) {
            c = i << 1 | this._selectedPc >>> i & 1; //caracter
            
            matte |= this._caracMatte(this._bits[c] |= bit);
        }
        
        // removing the piece and the spot from the rest ones
        Helper.removeArrItem(this.restPcs, this._selectedPc);
        Helper.removeArrItem(this.restSpots, spot);

        this._selectedPc = -1;// For safetyness

        return matte;
    }

    select(step){
        this._selectedPc = step;
    }
    
    step(step){
        if (this._selectedPc){
            this.placeStep(step);
        }
        else {
            this.select(step);
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

        this._selectedPc = -1;

        for (let i=0; i<8; i++){
            this.restPcs.push(i);
        }

        this.restSpots = [...this.restPcs, 8];

        if (this._bits) {
            this._bits.fill(0);
        }
        else {
            this._bits = Array(6).fill(0);
        }

        this.finished = false;

    }

}
