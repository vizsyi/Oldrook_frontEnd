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

    get statusM(){
        return this._statusM;
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
}