export default class C4SM{ 
    constructor(origin){
        if (origin){
            this.side = origin.side ^ 1;
    
            this._colRest = [...origin._colRest];
            this._restPcs = origin._restPcs;
    
            this.finished = false;
    
            this._bits = [...origin._bits];
        }
        else {
            this.brickSides;

            this.side = 0;
    
            this._colRest = [];
            this._colRest.length = 7;
            this._restPcs = 0;
    
            this.finished = false;
    
            this._bits;
        }

    }

    get colRest(){
        return this._colRest;
    }

    get restPcs(){
        return this._restPcs;
    }

    get bits(){
        return this._bits;
    }

    _setBit(pos, side = this.side){
        if (pos > 31){
            pos -= 32;
            side += 2;
        }

        this._bits[side] |= 1 << pos;
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

    emptyCol(col){
        return this._colRest[col] <= 0;
    }

    _resetRest(){
        let col, i = 0;
        this._colRest.fill(6);
        this._restPcs = 42;

        for (let rest = 5; rest >= 0; rest--){
            for (col = 0; col < 7; col++){
                if (this.brickSides[i++] !== 2){
                    this._restPcs--;
                    if(this._colRest[col] !== rest + 1)
                        throw new Error ("Invalid status model");
                    
                    this._colRest[col] = rest;
                }
            }
            i++;
        }

        this.finished =  (this._restPcs <= 0);
    }
    
    _resetBits(){
        this._bits = [0, 0, 0, 0];
        this.brickSides.forEach((side, pos) => {
            if (side !== 2) this._setBit(pos, side);
        })
    }

    reset(brickSides = []){
        const len = brickSides.length;
        brickSides.length = 47;
        this.brickSides = brickSides.fill(2, len);

        this._resetRest();

        this._resetBits();

        this.side = 0;
    }

    matte(fast = true){
        let horDown, horUp, leftDown, rightDown, verDown, xUp;
        const downB = this._bits[this.side],
            upB = this._bits[this.side | 2];
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

    move(col){
        this._setBit((40 - (--this._colRest[col] << 3)) | col);
        this._restPcs--;
        //this.matte(true);
    }

}
