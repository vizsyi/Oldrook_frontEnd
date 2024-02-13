import GameView from "./gameView.js";

class MorrisPiece {

    constructor(elem, spot = 26) {
        this._elem = elem;
        this._spot = spot;
    }

}

export default class MorrisView extends GameView {
    constructor(factory, deskE, active, id)
    {
        super(factory, deskE, active, id, "Morris", "morris_board", 0, true
            ,"morris_board_spot");

        /*Status*/
        //this._statusM = new C4SM();
        
        /* View status */
        this._spots = [];
        this._pieces = [];
  
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
            board = this._boardE,
            ring = document.createElement("div");
        let h, i, j, elem, pieceE, pclassL = ["morris_piece"], signE; 

        // The web elements
        for (i = 0; i < 6; i++) {
            elem = document.createElement("div");
            elem.classList.add("morris_board_web");
            ring.appendChild(elem);
        }
        
        // The spots
        for (i = 0; i < 24; i++){
            elem = document.createElement("div");
            elem.classList.add("morris_board_spot");
            elem.setAttribute("data-spi", i);
            signE = document.createElement("div");
            signE.classList.add("board_spot_sign");
            elem.appendChild(signE);
            ring.appendChild(elem);

            this._spots.push(elem);
        }

        // The pieces
        for (h = 0; h < 24; h += 12){
            elem = document.createElement("div");
            elem.classList.add("morris_board_spot");
            elem.setAttribute("data-spi", 28);
            for (i = 0; i < 9; i++){
                j = h + i;
                pieceE = document.createElement("div");
                pieceE.classList.add(...pclassL);
                pieceE.setAttribute("data-pii", j);
                pieceE.draggable = true;
                elem.appendChild(pieceE);

                this._pieces[j] = new MorrisPiece(pieceE);
            }
            board.appendChild(elem);

            if (h === 0){
                ring.classList.add("morris_board_ring");
                board.appendChild(ring);
                pclassL.push("piece-dark");
            }
        }

        //this._appendResultModal();
        //this._applyDesk();
        this._initDesk();

    }

    newGame(){
        this._clearResult();
        
    }

}
