import GameView from "./gameView.js";

export default class MorrisView extends GameView {
    constructor(factory, deskE, id)
    {
        super(factory, deskE, id, "Morris", "morris_board");

        /*Status*/
        //this._statusM = new C4SM();
        
        /* View status */
        this._nodes = [];
  
        this._initGame();
    }

 
    move (col, matte, isMach){
    }

    _boardClick(ev){
        const elem = ev.target.closest(".morris_board_node");
        if (elem){
            const ind = Number.parseInt(
                elem.getAttribute("data-ind"));

            // Intend
            this._repplyPlug.intend(ind);

        }
    }

    _initGame() {
        const //frag = this._fragmentF,
            board = this._boardE;
        let i, elem; 

        // The web elements
        for (i = 0; i < 6; i++) {
            elem = document.createElement("div");
            elem.classList.add("morris_board_web");
            board.appendChild(elem);
        }
        
        // The nodes
        for (i = 0; i < 24; i++){
            elem = document.createElement("div");
            elem.classList.add("morris_board_node");
            elem.setAttribute("data-ind", i);
            board.appendChild(elem);
        }

        //this._appendResultModal();
        //this._applyDesk();
        this._initDesk();

    }

    newGame(){
        this._clearResult();
        
    }

}
