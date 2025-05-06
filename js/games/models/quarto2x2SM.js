import QuartoSM from "./quartoSM.js";

export default class Quarto2x2SM extends QuartoSM {
    constructor(origin) {
        super(origin);
    }

    newSM() {
        return new Quarto2x2SM(this);
    }

    _caracMatte(bit) {
        let matte;

        // 2x2
        matte = bit & (bit >>> 1);
        matte = matte & (matte >>> 4) & 1911;// All expect last row & last column

        return matte;
    }

    whichMatte() {
        let matte = 0;
        this._bits.forEach(bit => {
            matte |= this._caracMatte(bit);
        });

        matte |= matte << 1;
        matte |= matte << 4;

        return matte;
    }

}
