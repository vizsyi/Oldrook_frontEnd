//import {GAMEBOARD_CLASSES} from "../gameConfig.js"

export default class GameView { 
    constructor(factory, deskE, active = false, id
        ,gTitle, gClass, iconButtons = 0, hasMessageBoard = true
        ,dropZoneClass = null){

        this._repplyPlug;
        this._statusM;

        this._factory = factory;
        //this._id = id;
        this._gameTitle = gTitle;
        this._gameClass = gClass;

        this._iconButtons = iconButtons;
        this._hasMessageBoard = hasMessageBoard;

        this._active = active;
        
        this._deskE = deskE;
        //this._fragmentF = document.createDocumentFragment();
        this._titleE = document.createElement("h3");
        this._boardE = document.createElement("div");

        this._messageBoardE;

        this._resultModal;
        this._endResult = "";

        this._gameTemplates = document.getElementById("gameTemplates");

        //Keyboard
        this._coursorKeyCodes = [33, 34, 37, 38, 39, 40];
        
        //Drag
        this._dropZoneClass = dropZoneClass;
        this._dragOverClasses = dropZoneClass ? ["gb_drop-potential", "gb_drop-notpot"]: null;

        //this._cleanBoardClasses();
        //this._initView();
      }

    get class (){
        return this._gameClass;
    }

    get factory (){
        return this._factory;
    }

    get active (){
        return this._active;
    }

    get repplyPlug (){
        return this._repplyPlug;
    }

    get gameTitle (){
        return this._gameTitle;
    }

    /**
     * @param {GameRepply} repply
     */
    set repplyPlug(repply){
        this._repplyPlug = repply;
    }

    /*
    activate(){
        if (!this._active){
            this._deskE.classList.add("gd-active");
            this._repplyPlug.activate();
            this._active = true;
        }
    }

    deactivate(){
        if (this._active){
            this._deskE.classList.remove("gd-active");
            this._repplyPlug.deactivate();
            this._active = false;
        }
    }
    */

    setStatusM(){
        this._statusM = this._repplyPlug._statusM;
    }

    // Keyboard handlers
    _coursorEvent(keyC){}/*abstract method*/

    keyboardEvent(ev){
        const keyC = ev.keyCode;
        if (this._coursorKeyCodes.contains(keyC)) this._coursorEvent(keyC);
    }

    // Click handlers
    _boardClick(ev){}/*abstract method*/

   /*
    _deskClick(){
        if (!this._active) this._factory.gameClick(this._id);
    }
    */

    // Drag handlers of the dragable pieces
    _dragStart(ev){
        const elem = ev.target;
        if (elem.getAttribute("draggable")){
            const id = Number.parseInt(elem.getAttribute("data-pii"));
            ev.dataTransfer.setData("pieceId", id);
        }
        else {
            ev.preventDefault();
            //console.log("DragStart on an not draggable", ev);
        }
    }

    _drag(ev){
        const elem = ev.target;
        //console.log("Dragging", ev);
        //elem.style.transform = "translate(150px,100px) scale(1.3)";
    }

    // Drag handlers of the drop zones
    _dragEnter(ev){
        //ev.preventDefault();
        ev.stopPropagation();

        const elem = ev.target;
        if (elem.classList.contains(this._dropZoneClass)){
            //console.log("ZoneEnter", ev, elem);    
            elem.classList.add(this._dragOverClasses[1]);
        }
    }

    _dragLeave(ev){
        const elem = ev.target;
        ev.stopPropagation();
        if (elem.classList.contains(this._dropZoneClass)){
            //console.log("ZoneLeave", ev, elem);
            this._dragOverClasses.forEach(cl => elem.classList.remove(cl));
        }
    }

    _drop(ev){
        ev.preventDefault();
        let data = ev.dataTransfer.getData("pieceId");
        console.log("Drop", ev, data);
    }

    //_initBoard(){
    //}

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

    _initDesk(resultModal = null, hasResultCloseBtns = true){
        const divE =document.createElement("div")
            , fragmentF = document.createDocumentFragment();

        this._titleE.innerText = this._gameTitle;
        this._titleE.classList.add("gamedesk_title");
        fragmentF.appendChild(this._titleE);

        fragmentF.appendChild(divE);
        this._boardE.classList.add("gamedesk_board", this._gameClass);
        divE.appendChild(this._boardE);

        if (this._hasMessageBoard){
            this._messageBoardE = document.createElement("div");
            this._messageBoardE.classList.add("gamedesk_message");
            divE.appendChild(this._messageBoardE);
        }
        else {
            this._messageE = null;
        }

        this._resultModal = resultModal || this._gameTemplates.querySelector(".gameresult")?.cloneNode(true);
        fragmentF.appendChild(this._resultModal);
        if (hasResultCloseBtns) this._resultModal.addEventListener('click', this._resultModalClick.bind(this));

        if (this._active){
            this._boardE.addEventListener('click', this._boardClick.bind(this));
            //Drag events
            if(this._dropZoneClass){
                this._boardE.addEventListener('dragstart', this._dragStart.bind(this));
                this._boardE.addEventListener('drag', this._drag.bind(this));
                //const dropZones = this._boardE.querySelectorAll("." + this._dropZoneClass);
                //dropZones.forEach(zone => 
                //    zone.addEventListener('dragover', this._dragOver.bind(this)));
                this._boardE.addEventListener('dragenter', this._dragEnter.bind(this));
                this._boardE.addEventListener('dragleave', this._dragLeave.bind(this));
                this._boardE.addEventListener('drop', this._drop.bind(this));
            }
        }
        /*
        else {
            this._deskE.addEventListener('click', this._deskClick.bind(this));
        }*/

        this._deskE.appendChild(fragmentF);
    }

    dispo(){
        this._deskE.innerHTML = "";
        //this._board.removeEventListener('click', this._boardClick.bind(this));
        this._repplyPlug?.dispo();
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
