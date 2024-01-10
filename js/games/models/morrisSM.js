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

        x = this._bits & ~mill;

        return x ? x : this._bits[side];
    }

    possibilies (){
        //todo: implement
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

        if ((from > 0) && ((this._toPlacePcs > 0) || this._shootingStep)
            || from < 0 || from > 23 || to > 23)
            throw new RangeError("Invalid step");

        if (this._shootingStep){
            this._side ^= 1;
            if ((this._bits[this._side] & toBit) === 0) throw new RangeError("Invalid shooting step");
            this._bits[this._side] ^= toBit;
            this._shootingStep = false;
            this.newMill();
        }
        else {
            const allBits = this._bits[0] | this._bits[1];
            if (this._toPlacePcs){
                if (allBits & toBit) throw new RangeError("Invalid placing step");
                this._bits[this._side] |= toBit;
            }
            else {
                const fromBit = 1 >>> from;
                if ((from === to) || ((fromBit & this._bits[this._side]) === 0) || (allBits & toBit))
                    throw new RangeError("Invalid moving step");
                this._bits[this._side] ^= fromBit | toBit;
            }
            if (this.newMill()){
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
