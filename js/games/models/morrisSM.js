export default class MorrisSM{ 
    constructor(origin){
        if (origin){
            this._side = origin._side;
    
            this._toPlacePcs = origin._toPlacePcs;
            this._restPcs = [...origin._restPcs];
            this._shootingStep = origin._shootingStep;
    
            this._bits = [...origin._bits];
            this._millBits = [...origin._millBits];

            this.finished = false;
        }
        else {
            this._side = 0;
    
            this._toPlacePcs = 18;
            this._restPcs = [9, 9];
            this._shootingStep = false;
    
            this._bits = [0, 0];
            this._millBits = [0, 0];

            this.finished = false;

        }

    }

    _removableMen(){
        let x = this._millBits[this._side ^ 1];
        const a = x & 1381653,
            b = x & 4210752,
            c = x & 170,
            mill = a | (a << 1) | (a << 2)
                | b | (b << 1) | (b >>> 6)
                | c | (c << 8) | (c << 16);

        x = this._bits & ~mill; // Pieces not in mills

        return x ? x : this._bits[side];
    }

    _possibilities (){
        const possies = [];
        let b, fr, to, possB;
        if (this._shootingStep || this._toPlacePcs > 0){
            // Shooting
            if (this._shootingStep){
                fr = 28;
                possB = this._removableMen();
            }
            // Placing
            else {
                fr = 26;
                possB = 16777215 ^ (this._bits[0] | this._bits[1]);//Bits All
            }
            // Schooting & Placing
            for (to = 0, b = 1; to < 24; to++, b <<= 1){
                if (possB & b) possies.push([fr, to]);
            }
        }
        else {
            const emptyPls = 16777215 ^ (this._bits[0] | this._bits[1]);//Bits: All
            // Moving
            if (this._restPcs[this._side] > 3){
                // Goes CW
                b = (emptyPls & bit) >>> 1 & this._bits[this._side];//Bits: not(0, 8, 16)
                fr = 0;
                while (b) {
                    if (b & 1) possies.push([fr, fr + 1]);
                    b >>>= 1;
                    fr++;
                }
                // Overflowings
                b = ((emptyPls & ~bit) << 7 & this._bits[this._side]) >>> 7;//Bits: 0, 8, 16
                fr = 7;
                while (b) {
                    if (b & 1) possies.push([fr, fr - 7]);
                    b >>>= 8;
                    fr += 8;
                }
                // Goes CCW
                b = ((emptyPls & bit) << 1 & this._bits[this._side]) >>> 1;//Bits: not(7, 15, 23)
                fr = 1;
                while (b) {
                    if (b & 1) possies.push([fr, fr - 1]);
                    b >>>= 1;
                    fr++;
                }
                // Overflowings
                b = (emptyPls & ~bit) >>> 7 & this._bits[this._side];//Bits: 7, 15, 23
                fr = 0;
                while (b) {
                    if (b & 1) possies.push([fr, fr + 7]);
                    b >>>= 8;
                    fr += 8;
                }
                // Goes Inner //todo: implement
                b = ((emptyPls & bit) >>> 8 & this._bits[this._side]) >>> 1;//Bits: odds 9 - 23
                fr = 1;
                while (b) {
                    if (b & 1) possies.push([fr, fr + 8]);
                    b >>>= 2;
                    fr += 2;
                }
                // Goes Outer //todo: implement
                b = ((emptyPls & bit) << 8 & this._bits[this._side]) >>> 9;//Bits: odds 1 - 15
                fr = 9;
                while (b) {
                    if (b & 1) possies.push([fr, fr - 8]);
                    b >>>= 2;
                    fr += 2;
                }
            }
            // Flying
            else {
                //Flying piece positions
                const flyersL = [];
                b = this._bits[this._side];
                fr = 0;
                while (b) {
                    if (b & 1) flyersL.push(fr);
                    b >>>= 1;
                    fr ++;
                }
                //Multiplying with the empty places
                b = emptyPls;//Bits: not(0, 8, 16)
                to = 0;
                while (b) {
                    if (b & 1) flyersL.forEach(flyer => possies.push([flyer, to]));
                    b >>>= 1;
                    to++;
                }
            }
        }

        return possies
    }

    _newMill(side = this._side){
        let x = this._bits[side];
        const m = x & 1381653 & (x >>> 1) & (x >>> 2)
            | x & 4210752 & (x >>> 1) & (x << 6)
            | x & 170 & (x >>> 8) & (x >>> 16);

        x = m & ~this._millBits[side];

        this._millBits[side] = m;

        return x;
    }

    step(step){
        const from = step >>> 5, to = step & 31, toBit = 1 >>> to;

        if (this._shootingStep){
            this._side ^= 1;
            if ((from !== 28) || !(this._bits[this._side] & toBit)) throw new RangeError("Invalid shooting step");
            this._bits[this._side] ^= toBit;
            this._restPcs[this._side]--;
            this._shootingStep = false;
            this._newMill();
        }
        else {
            const allBits = this._bits[0] | this._bits[1];
            if (this._toPlacePcs > 0){
                if ((from !== 26) || (allBits & toBit)) throw new RangeError("Invalid placing step");
                this._bits[this._side] |= toBit;
                this._toPlacePcs--;
            }
            else {
                const fromBit = 1 >>> from;
                if (from < 0 || from > 23 || to > 23 || (from === to)
                    || !(fromBit & this._bits[this._side]) || (allBits & toBit))
                    throw new RangeError("Invalid moving step");
                this._bits[this._side] ^= fromBit | toBit;
            }
            if (this._newMill()){
                this._shootingStep = true;
            }
            else {
                this._side ^= 1;
            }
        }
    }

    _resetBits(){
        //todo: implement
    }

    reset(){
        //todo: implement
    }

}
