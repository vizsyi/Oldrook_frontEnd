export default class quartoSM{ 
    constructor(origin, dummy){
        if (origin){
            this._side = origin._side;
    
            this._restPcs = [...origin._restPcs];
    
            this._bits = [...origin._bits];

            this.finished = false;
        }
        else {
            this._side = 0;
    
            this._restPcs = [];
    
            this._bits = [];

            this.finished = false;

            this.reset(dummy)
        }

    }

    caracMatte(bit){
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

        // Return
        return matte
    }

    step(step){
        //todo: implement
    }

    _resetBits(){
        //todo: implement
    }

    reset(dummy){
        //todo: implement
    }

}
