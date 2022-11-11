export default class MCardsSM{ 
    constructor(){
        this.brickSides = [];
        this.brickSides.length = 47;

        this.side = 0;

        this.colRest = [];
        this.colRest.length = 7;

        this.bits;
    }

    _resetColRest(){
        let col, i = 0;
        this.colRest.fill(6);

        for (let rest = 5; rest >= 0; rest--){
            for (col = 0; col < 8; col++){
                if (this.brickSides[i++] !== 2){
                    if(this.colRest[col] !== rest + 1)
                        throw new Error ("Invalid status model");
                    
                    this.colRest[col] = rest;
                }
            }
            i++;
        }
    }

    _setBit(pos, side, bits = this.bits){
        if (pos > 31){
            pos -= 32;
            side += 2;
        }

        bits[side] |= 1 << pos;
    }

    move(col, side = this.side, bits = this.bits, colRest = this.colRest){
        this._setBit((40 - (--colRest[col] << 3)) | col, side, bits);
    }

    nextSide(){
        this.side ^= 1;
    }

    _resetBits(){
        this.bits = [0, 0, 0, 0];
        this.brickSides.forEach((side, pos) => {
            if (side !== 2) this._setBit(pos, side);
        })
    }

    reset(){
        this.brickSides.fill(2);
        this._resetColRest();

        this._resetBits();

        this.side = 0;
    }

}
