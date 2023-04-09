import GameRepply from "./gameRepply.js";
import C4SM from "../models/c4SM.js";

export default class C4Repply extends GameRepply{ 
    constructor(view){
        super(view);

        this._statusM = new C4SM();
        view.setStatusM();

        this._newGame();
    }

    _repply (){
        function negaMax (column, parSM, possCol, a, b, depth){
            const sMod = new C4SM(parSM);
            let col, score;

            sMod.move(column);
            if (column === 6){
                console.log("61", sMod.matte(), sMod);
            }
            if (sMod.matte()) return 1048576 + 16384 * depth;
            if (sMod.restPcs === 0) return 0;
            if (column === 6){
                console.log("69");
            }

            if (sMod.emptyCol(col)){
                possCol = [...possCol].splice(possCol.indexOf(col), 1);
            }

            if (depth <= 0 && possCol.length > 1) return 0;

            possCol.forEach(col => {
                score = - negaMax(col, sMod, possCol, -b, -a, depth - 1);
                console.log ("col_1st: ", col, "scr: ", score, "a: ", a,  "b: ", b, (score > a));
                if (score <= b) return score;
                if (score < a) a = score;
            });

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

        const sMod = new C4SM(this._statusM);
        return new Promise(function(resolve, reject){
            const possCol = [3, 2, 4, 1, 5, 0, 6] //[3, 4, 5, 6] [6, 5, 4, 3] 
                .filter(col => sMod.colRest[col] > 0),
                possCount = possCol.length;

            if(possCount > 1){
                const extraPs = [0, 128, 256, 512, 256, 128, 0];
                let a = -1073741824, b = 1073741824, bestC = 0, ex, depth = 2, score;

                possCol.forEach(col => {
                    ex = extraPs[col] + Math.floor(Math.random() * 1024 * 0);
                    score = negaMax(col, sMod, possCol, b, a - ex, depth - 1) + ex;
                    console.log ("col: ", col, "scr: ", score, "a: ", a,  "best: ", bestC);
                    if (score > a) {
                        a = score;
                        bestC = col;
                    }
                });
                resolve (bestC);
            } else if (possCol === 1){
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
            } else if (possCol === 1){
                resolve (possCol[0]);
            } else {
                reject("There is no more possible move!");
            }
        });
    }

    _newGame (){
        this._statusM.reset();
        this._viewPlug.newGame();
    }

    _move (col){

        if (col < 0 || col >= 7) 
            throw new RangeError("Invalid position");

        if (this._statusM.colRest[col] <= 0 || this._statusM.finished) return;

        this._statusM.move(col);
        if (this._statusM.matte() || this._statusM.restPcs <=0)
            this._statusM.finished = true;

        this._viewPlug.move(col);
        this._statusM.nextSide();

        if (!this._statusM.finished && this._statusM.side === 1){
            this._repply()
                .then(col => this._move(col))
                .catch(err => console.error(err));
        }
    }

    intend (col){
        setTimeout(this._move.bind(this, col), 500);
    }

}
