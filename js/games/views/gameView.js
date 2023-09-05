//import {GAMEBOARD_CLASSES} from "../gameConfig.js"

export default class GameView { 
    constructor(factory, deskE, id, gTitle, gClass){
        this._repplyPlug;
        this._statusM;

        this._factory = factory;
        this._id = id;
        this._gameTitle = gTitle;
        this._gameClass = gClass;

        this._main = false;
        
        this._deskE = deskE;
        this._fragmentF = document.createDocumentFragment();
        this._titleE = document.createElement("div");
        this._boardE = document.createElement("div");

        this._resultModal;
        this._endResult = "";

        this._jsTemplates = document.getElementById("jsTemplates");

        //this._cleanBoardClasses();
        this._initBoard();
      }

    get class (){
        return this._gameClass;
    }

    get factory (){
        return this._factory;
    }

    /**
     * @param {GameRepply} repply
     */
    set repplyPlug(repply){
        this._repplyPlug = repply;
    }

    /**
     * @param {boolean} main
     */
    set main(main){
        this._main = main;
    }

    setStatusM(){
        this._statusM = this._repplyPlug._statusM;
    }

    _boardClick(ev){}/*abstract method*/

    _deskClick(ev){
        if (this._main) this._boardClick(ev);
        else this._factory.gameClick(this._id);
    }

    _initBoard(){
        this._titleE.innerHTML = "<h3>" + this._gameTitle + "</h3>";
        this._titleE.classList.add("gamedesk_title");
        this._boardE.classList.add("gamedesk_board", this._gameClass);
        this._fragmentF.appendChild(this._titleE);
        this._fragmentF.appendChild(this._boardE);
        this._boardE.addEventListener('click', this._deskClick.bind(this));
    }

    _applyDesk(){
        this._deskE.appendChild(this._fragmentF);
    }

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
        this._repplyPlug.dispo();
        this._repplyPlug = null;
        this._statusM = null;
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
