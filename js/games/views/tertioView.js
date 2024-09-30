import GameView from "./gameView.js";

export default class TertioView extends GameView {
    constructor(factory, deskE, active, id)
    {
        super(factory, deskE, active, id, "Tertio", "tertio_board", 0, true
            ,"tertio_board_spot");

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
        for (let i = 0; i < 8; i++){
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
        for (i = 0; i < 9; i++){
            elem = document.createElement("div");
            elem.classList.add("tertio_board_spot");
            elem.setAttribute("data-spi", i);
            div.appendChild(elem);

            this._spots.push(elem);
        }

        // Sides
        sideContainers[0].classList.add("tertio_board_side");
        sideContainers[1].classList.add("tertio_board_side", "tertio_board_side-right");

        for (i = 0; i < 8; i++){
            // Side spots
            elem = document.createElement("div");
            sideContainers[i&1].appendChild(elem);
            this._sideSpots.push(elem);

            // Pieces
            piece = document.createElement("div");
            piece.classList.add("tertio_piece");
            if (i&1) piece.classList.add("piece-drill");
            if (i&2) piece.classList.add("piece-dark");
            if (i&4^4) piece.classList.add("piece-round");
            this._pieces.push(piece);
        }

        this._piecesRearrange();

        ring.classList.add("tertio_board_ring");
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
