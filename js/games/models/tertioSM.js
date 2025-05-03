import QuartoSM from "./quartoSM.js";

export default class TertioSM extends QuartoSM {
    constructor(origin) {
        super(origin);

        this._caracCount = 3;

    }

    _caracMatte(bit) {
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

    whichMatte() {
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

}
