import {GAMEBOARD_CLASSES} from "../gameConfig.js"

export default class GameView { 
    constructor(board){
        this._repplyPlug;
        this._statusM;
        this._board = board;
        this._cleanBoardClasses();

        this._board.addEventListener('click', this._boardClick.bind(this));
    }

    set repplyPlug(repply){
        this._repplyPlug = repply;
    }

    setStatusM(){
        this._statusM = this._repplyPlug._statusM;
    }

    _cleanBoardClasses(){
        [...this._board.classList].forEach(cl => {
            if(!GAMEBOARD_CLASSES.includes(cl)) this._board.classList.remove(cl);
        });
    }

    _boardClick(ev){}/*abstract method*/

    dispo(){
        this._board.innerHTML = "";
        this._board.removeEventListener('click', this._boardClick.bind(this));
    }

    bitToArray(bit){
        let arr = [], i, x;

        if (bit === 0) return arr;

        for (let a = 255, x = 0; a !== 0; a <<= 8, x += 8){
            if (a & bit){
                for (i = x; i < x + 8; i++) {
                    if (bit & (1 << i)) arr.push(i);
                }
            }
        }
        return arr;
    }
}
