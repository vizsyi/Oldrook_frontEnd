import GameView from "./gameView.js";

export default class QuartoView extends GameView {
    constructor(factory, deskE, active, id)
    {
        super(factory, deskE, active, id, "Quarto", "quarto_board", 0, true
            ,"quarto_board_spot");

        /*Status*/
        //this._statusM = new C4SM();
        
        /* View status */
        this._spots = [];
        //this._pieces = [];
  
        this._initGame();

        //keyboard event status
        //this._keyActivated = 23;
        //this._isKeyActivatedShown = false;
    }
 
    move (col, matte, isMach){
    }

    _showCursor(IdSpot){
        //todo: implement
    }

    _hideCursor(IdSpot){
        //todo: implement
    }

    // Keyboard handlers
    _coursorEvent(keyC){
    }

    _boardClick(ev){
    }

    _initGame() {
        const //frag = this._fragmentF,
            board = this._boardE,
            ring = document.createElement("div"),
            div = document.createElement("div");
        let i, elem; 

        // The spots
        for (i = 0; i < 16; i++){
            elem = document.createElement("div");
            elem.classList.add("quarto_board_spot");
            elem.setAttribute("data-spi", i);
            div.appendChild(elem);

            this._spots.push(elem);
        }

        ring.classList.add("quarto_board_ring");
        ring.appendChild(div);
        board.appendChild(ring);

        this._initDesk();
    }

    newGame(){
        this._clearResult();
        
    }

}
