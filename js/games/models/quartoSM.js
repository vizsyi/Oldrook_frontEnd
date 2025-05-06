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

            this.finished = false;
        }
        else {
            this._side = 0;

            this._selectedPc = -1;

            this.restPcs = []; //todo: must it be defined?
            this.restSpots = null;

            this._bits;

            this._phase = 1;
            this.finished = false;

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

    isFinished() {
        if (this.restPcs.length === 0) {
            this.finished = true;
            return true;
        }

        return false;
    }

    newSM() {
        return new QuartoSM(this);
    }

    _caracMatte(bit) {
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

        return matte
    }

    whichMatte() { // todo: it is tertio, must make quarto
        let matte = 0, m1;
        this._bits.forEach(bit => {
            // Horizontal
            m1 = bit & (bit >>> 1) & (bit >>> 2) & 73;//Begining of the rows
            if (m1) {
                matte |= m1 | m1 << 1 | m1 << 2;
            }
            // Vertical
            m1 = bit & (bit >>> 3) & (bit >>> 6) & 7;//Begining of the columns
            if (m1) {
                matte |= m1 | m1 << 3 | m1 << 6;
            }
            // Diagonal+
            m1 = bit & (bit >>> 4) & (bit >>> 8) & 1;//Position 0
            if (m1) {
                matte |= 273;
            }
            // Diagonal-
            m1 = bit & (bit >>> 2) & (bit >>> 4) & 4;//Position 2
            if (m1) {
                matte |= 84;
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

        this.finished = false;

    }

}
