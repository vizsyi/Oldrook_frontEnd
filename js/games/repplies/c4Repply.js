import GameRepply from "./gameRepply.js";
import C4SM from "../models/c4SM.js";

export default class C4Repply extends GameRepply{ 
    constructor(view){
        super(view, true);

        this._statusM = new C4SM();
        view.setStatusM();

        this._difficultyDepthMap = new Map([
            ["easy", 2],
            ["med", 4],
            ["hard", 6],
            ["robin", 8]
        ]);
        this._negamaxDepth = 2;

        this._newGame();

    }

    _setDifficulty(diffName){
        let depth = this._difficultyDepthMap.get(diffName);
        if (depth){
            this._negamaxDepth = depth;
        }
        else {
            throw new RangeError("Invalid difficulty id");
        }
        console.log("depth: ", this._negamaxDepth);
    }

    _repply (){
        function negaMax (column, parSM, possCol, a, b, depth, test){
            const sMod = new C4SM(parSM);
            let col, score;

            test.push([a, b]);

            sMod.move(column);
            if (sMod.matte()) return 1048576 + 16384 * depth;
            if (sMod.restPcs === 0) return 0;

            if (sMod.emptyCol(col)){
                possCol = [...possCol].splice(possCol.indexOf(col), 1);
            }

            if (depth <= 0 && possCol.length > 1) return 0;

            for (col of possCol){
                let test1 = [];
                score = - negaMax(col, sMod, possCol, -b, -a, depth - 1, test1);
                test1.unshift (sMod.side ^ 1, col, depth -1, score);
                test.push(test1);
                //console.log ("col_1st: ", col, "scr: ", score, "a: ", a,  "b: ", b, (score < a));
                if (score <= b) return score;
                if (score < a) a = score;
            };

            /*
            possCol.forEach(col => {
                let test1 = [];
                score = - negaMax(col, sMod, possCol, -b, -a, depth - 1, test1);
                test1.unshift (sMod.side ^ 1, col, depth -1, score);
                test.push(test1);
                console.log ("col_1st: ", col, "scr: ", score, "a: ", a,  "b: ", b, (score < a));
                if (score <= b) return score;
                if (score < a) a = score;
                console.log ("a: ", a);
            });*/

            /*
            for (col of possCol){
                score = negaMax(col, sMod, possCol, -b, -a, depth - 1);
                console.log ("col_1st: ", col, "scr: ", score, "a: ", a,  "b: ", b, (score > a));
                if (score >= b) return -score;
                if (score > a) a = score;
            }
            */

            return a;
        }

        const sMod = new C4SM(this._statusM),
            depth = this._negamaxDepth - 1;
        return new Promise(function(resolve, reject){
            const possCol = [3, 2, 4, 1, 5, 0, 6] //[3, 4, 5, 6] [6, 5, 4, 3] 
                .filter(col => sMod.colRest[col] > 0),
                possCount = possCol.length;

            let test = [sMod.side]

            if(possCount > 1){
                const extraPs = [0, 128, 256, 512, 256, 128, 0];
                let a = -1073741824, b = 1073741824, bestC = 0, ex, score;

                possCol.forEach(col => {
                    ex = extraPs[col] + Math.floor(Math.random() * 1024);
                    let test1 = [];
                    score = negaMax(col, sMod, possCol, b, a - ex, depth, test1) + ex;
                    test1.unshift (sMod.side ^ 1, col, depth, score);
                    test.push(test1);
                    console.log ("col: ", col, "scr: ", score, "a: ", a,  "best: ", bestC);
                    if (score > a) {
                        a = score;
                        bestC = col;
                    }
                });
                console.log(test);
                resolve (bestC);
            } else if (possCount === 1){
                resolve (possCol[0]);
            } else {
                reject("There is no more possible move!");
            }
        });
    }

    _repply1st (){
        const sMod = this._statusM;
        return new Promise(function(resolve, reject){
            let col;
            const possCol = [];
            sMod.colRest.forEach((rest, col) => {
                if (rest > 0) possCol.push(col);
            });
            const possCount = possCol.length;

            if(possCount > 1){
                col = possCol[Math.floor(Math.random() * possCount)];
                resolve (col);
            } else if (possCount === 1){
                resolve (possCol[0]);
            } else {
                reject("There is no more possible move!");
            }
        });
    }

    _newGame (){
        this._statusM.reset();
        //this._statusM.reset([0, 0, 0, 1, 1, 1]);
        //this._statusM.reset([1, 2, 1, 0, 0]);
        this._viewPlug.newGame();
    }

    _move (col, isMach = false){
        let matte;

        if (col < 0 || col >= 7) 
            throw new RangeError("Invalid position");

        if (this._statusM.colRest[col] <= 0 || this._statusM.finished) return;

        this._statusM.move(col);
        matte = this._statusM.matte();
        if (matte || this._statusM.restPcs <=0)
            this._statusM.finished = true;

        this._viewPlug.move(col, matte, isMach);
        this._statusM.nextSide();

        if (!this._statusM.finished && this._statusM.side === 1){
            this._repply()
                .then(col => this._move(col, true))
                .catch(err => console.error(err));
        }
    }

    intend (col){
        setTimeout(this._move.bind(this, col), 500);
    }

}
