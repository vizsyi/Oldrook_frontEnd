export default class MCardsSM{ 
    constructor(){
        this.brickSides = [];
        this.brickSides.length = 47;

        this.colRest = [];
        this.colRest.length = 7;

    }

    resetColRest (){
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

    reset (){
        this.brickSides.fill(2);
        this.resetColRest();
    }

}
