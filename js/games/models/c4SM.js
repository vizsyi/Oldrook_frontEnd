export default class MCardsSM{ 
    constructor(){
        this.brickColors = [];
        this.brickColors.length = 42;

        this.colRest = [];
        this.colRest.length = 7;

    }

    resetColRest (){
        let col, i = 0;
        this.colRest.fill(6);

        for (let rest = 5; rest >= 0; rest--){
            for (col = 0; col < 8; col++){
                if (this.brickColors[i++] !== 2){
                    if(this.colRest[col] !== rest + 1)
                        throw new Error ("Invalid status model");
                    
                    this.colRest[col] = rest;
                }
            }
        }
    }

    reset (){
        this.brickColors.fill(2);
        this.resetColRest();
    }

}
