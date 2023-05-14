import {GAMEBOARD_CLASSES} from "../gameConfig.js"

export default class GameView { 
    constructor(desk){
        this._repplyPlug;
        this._statusM;
        
        this._desk = desk;
        this._board = document.createElement("div");

        this._resultModal;
        this._endResult = "";

        this._jsTemplates = document.getElementById("jsTemplates");

        //this._cleanBoardClasses();
        this._initBoard();
      }

    _initBoard(){
        this._board.classList.add("game_board");
        this._board.addEventListener('click', this._boardClick.bind(this));
    }

    set repplyPlug(repply){
        this._repplyPlug = repply;
    }

    setStatusM(){
        this._statusM = this._repplyPlug._statusM;
    }

/*     _cleanBoardClasses(){
        [...this._board.classList].forEach(cl => {
            if(!GAMEBOARD_CLASSES.includes(cl)) this._board.classList.remove(cl);
        });
    } */

    _boardClick(ev){}/*abstract method*/

    _setResult(result){
        if (this._resultModal && result !== this._endResult){
            this._endResult = result;
            this._resultModal.classList.add(result);
        }
    
    }

    _clearResult(){
        if (this._endResult !== ""){
            this._resultModal.classList.remove(this._endResult);
            this._endResult = "";
        }
    }

    showResult(result){
        if (result > 0){
            this._setResult("result-won");
        }
        else if (result < 0){
            this._setResult("result-lost");
        }
        else {
            this._setResult("result-draw");
        }
    }

    _resultModalClick(ev){
        const elem = ev.target.closest(".btn-close");
        if (elem){
            this._clearResult();
        }
    }

    _setResultModal(modal, hasBtns = true){
        if (hasBtns) modal.addEventListener('click', this._resultModalClick.bind(this));
        this._resultModal = modal;
    }

    _appendResultModal(parent){
        const modal = this._jsTemplates.querySelector(".gameresult")?.cloneNode(true);
        parent.appendChild(modal);
        this._setResultModal(modal);
    }

    dispo(){
        this._desk.innerHTML = "";
        //this._board.removeEventListener('click', this._boardClick.bind(this));
    }

    bitToArray(bit){
        let arr = [], i;

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
