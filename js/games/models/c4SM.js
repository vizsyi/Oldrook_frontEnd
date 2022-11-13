export default class C4SM{ 
    constructor(){
        this.brickSides = [];
        this.brickSides.length = 47;

        this.side = 0;

        this._colRest = [];
        this._colRest.length = 7;

        this._bits;

        this.finished = false;
    }

    get colRest(){
        return this._colRest;
    }

    get bits(){
        return this._bits;
    }

    _resetColRest(){
        let col, i = 0;
        this._colRest.fill(6);

        for (let rest = 5; rest >= 0; rest--){
            for (col = 0; col < 7; col++){
                if (this.brickSides[i++] !== 2){
                    if(this._colRest[col] !== rest + 1)
                        throw new Error ("Invalid status model");
                    
                    this._colRest[col] = rest;
                }
            }
            i++;
        }
    }

    _setBit(pos, side, bits = this._bits){
        if (pos > 31){
            pos -= 32;
            side += 2;
        }

        bits[side] |= 1 << pos;
    }

    move(col, side = this.side, bits = this._bits, colRest = this._colRest){
        this._setBit((40 - (--colRest[col] << 3)) | col, side, bits);
    }

    nextColPos(col){
        if (this._colRest[col] === 0){
            return null;
        }
        else {
            return ((48 - (this._colRest[col] << 3)) | col);
        }
    }

    nextSide(){
        this.side ^= 1;
    }

    _resetBits(){
        this._bits = [0, 0, 0, 0];
        this.brickSides.forEach((side, pos) => {
            if (side !== 2) this._setBit(pos, side);
        })
    }

    reset(){
        this.brickSides.fill(2);
        this._resetColRest();

        this._resetBits();

        this.side = 0;
        this.finished = false;
    }

    matte(side = this.side, bits = this._bits, fast = true){
        let horDown, horUp, leftDown, rightDown, verDown, xUp;
        const downB = bits[side],
            upB = bits[side + 2];
        // Horizontal
        horDown = downB & (downB >>> 1);
        horDown &= (horDown >>> 2);
        horUp = upB & (upB >>> 1);
        horUp &= (horUp >>> 2);
        // Vertical
        xUp = upB & (upB >>> 8);
        verDown = downB & ((downB >>> 8) | (upB << 24));
        verDown &= (verDown >>> 16) | (xUp << 16);
        // Left diagonal
        xUp = upB & (upB >>> 9);
        leftDown = downB & ((downB >>> 9) | (upB << 23));
        leftDown &= (leftDown >>> 18) | (xUp << 14);
        // Right diagonal
        xUp = upB & (upB >>> 7);
        rightDown = downB & ((downB >>> 7) | (upB << 25));
        rightDown &= (rightDown >>> 14) | (xUp << 18);
        // Return
        if (fast){
            return horDown | horUp | leftDown | rightDown | verDown;
        }
        else {
            return [horDown, horUp, leftDown, rightDown, verDown];
        }
    }

}
