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
        this._sideSpots = [];
        this._pieces = [];
  
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

    _piecesRearrange(){
        for (let i = 0; i < 16; i++){
            this._sideSpots[i].appendChild(this._pieces[i]);
        }
    }

    _initGame() {
        const
            board = this._boardE,
            ring = document.createElement("div"),
            sideContainers = [document.createElement("div"), document.createElement("div")],
            div = document.createElement("div");
        let i, elem, piece; 

        // The spots
        for (i = 0; i < 16; i++){
            elem = document.createElement("div");
            elem.classList.add("quarto_board_spot");
            elem.setAttribute("data-spi", i);
            div.appendChild(elem);

            this._spots.push(elem);
        }

        // Sides
        sideContainers[0].classList.add("quarto_board_side");
        sideContainers[1].classList.add("quarto_board_side", "quarto_board_side-right");

        for (i = 0; i < 16; i++){
            // Side spots
            elem = document.createElement("div");
            sideContainers[i&1].appendChild(elem);
            this._sideSpots.push(elem);

            // Pieces
            piece = document.createElement("div");
            piece.classList.add("quarto_piece");
            if (i&1) piece.classList.add("piece-drill");
            if (i&2) piece.classList.add("piece-dark");
            if (i&4^4) piece.classList.add("piece-round");
            if (i&8^8) piece.classList.add("piece-small");
            this._pieces.push(piece);
        }

        this._piecesRearrange();

        ring.classList.add("quarto_board_ring");
        ring.appendChild(div);
        board.appendChild(sideContainers[0]);
        board.appendChild(ring);
        board.appendChild(sideContainers[1]);

        this._initDesk();
    }

    newGame(){
        this._clearResult();
        
    }

}
