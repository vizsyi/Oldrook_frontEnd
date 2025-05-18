import Helper from "./../helper.js"

export default class QuartoSM {
    constructor(origin) { //, dummy, selectedPc

        this._caracCount = 4;

        if (origin) {
            //this._side = origin._side;

            this._selectedPc = origin._selectedPc;

            this.restPcs = [...origin.restPcs];
            this.restSpots = [...origin.restSpots];

            this._bits = [...origin._bits];

            this._finished = false;
        }
        else {
            this._side = 0;

            this._selectedPc = -1;

            this.restPcs = []; //todo: must it be defined?
            this.restSpots = null;

            this._bits;

            this._phase = 1;
            this._finished = false;

            this._gameNr = 0;

            //this.reset(dummy)
        }

    }

    get nextPhase() {
        this._phase = this._phase + 1 & 3;
        return this._phase;
    }

    get phase() {
        return this._phase;
    }

    get restCount() {
        return this.restPcs.length;
    }

    get selectedPc() {
        return this._selectedPc;
    }

    get finished() {
        return this._finished;
    }

    isFinished() {
        if (this.restPcs.length === 0) {
            this.finished = true;
            return true;
        }

        return false;
    }

    finish() {
        this._finished = true;
        return true;
    }

    newSM() {
        return new QuartoSM(this);
    }

    _caracMatte(bit) {
        let m1, matte;

        // Horizontal
        matte = bit & (bit >>> 1);
        matte &= (matte >>> 2) & 4369;//Begining of the rows
        // Vertical
        m1 = bit & (bit >>> 4);
        matte |= m1 & (m1 >>> 8) & 15;//Begining of the columns
        // Diagonal+
        m1 = bit & (bit >>> 5);
        matte |= m1 & (m1 >>> 10) & 1;//Position 0
        // Diagonal-
        m1 = bit & (bit >>> 3);
        matte |= m1 & (m1 >>> 6) & 8;//Position 3

        return matte
    }

    whichMatte() { // todo: it is tertio, must make quarto
        let matte = 0, m1;
        this._bits.forEach(bit => {
            // Horizontal
            m1 = bit & (bit >>> 1);
            m1 &= (m1 >>> 2) & 4369;//Begining of the rows
            if (m1) {
                m1 |= m1 << 1;
                matte |= m1 | m1 << 2;
            }
            // Vertical
            m1 = bit & (bit >>> 4);
            m1 &= (m1 >>> 8) & 15;//Begining of the columns
            if (m1) {
                m1 |= m1 << 4;
                matte |= m1 | m1 << 8;
            }
            // Diagonal+
            if ((bit & 33825 ^ 33825) === 0) { //Position 0
                matte |= 33825;
            }
            // Diagonal-
            if ((bit & 4680 ^ 4680) === 0) { //Position 3
                matte |= 4680;
            }
        });

        return matte;
    }

    placeStep(spot) {
        const bit = 1 << spot;
        let caracter, i, matte = 0;

        for (i = 0; i < this._caracCount; i++) {
            caracter = i << 1 | this._selectedPc >>> i & 1; //caracter

            matte |= this._caracMatte(this._bits[caracter] |= bit);
        }

        // removing the piece and the spot from the rest ones
        Helper.removeArrItem(this.restPcs, this._selectedPc);
        Helper.removeArrItem(this.restSpots, spot);

        this._selectedPc = -1;// For safetyness

        return matte;
    }

    select(step) {
        this._selectedPc = step;
    }

    reset(dummy = null) {
        const pieceCount = 1 << this._caracCount;

        if (dummy) {
            //todo: handling dummy parameter
            throw new ReferenceError("Not implemented yet. (16201)");
        }

        this._side = 0;

        this._selectedPc = -1;

        this.restPcs = [];
        for (let i = 0; i < pieceCount; i++) {
            this.restPcs.push(i);
        }

        this.restSpots = this._caracCount === 3 ? [...this.restPcs, 8] : [...this.restPcs];

        if (this._bits) {
            this._bits.fill(0);
        }
        else {
            this._bits = Array(this._caracCount * 2).fill(0);
        }

        this._phase = ++this._gameNr & 1 ? 1 : 3;

        this._finished = false;

    }

}
