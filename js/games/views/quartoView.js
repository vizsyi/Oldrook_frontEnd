import GameView from "./gameView.js";

export default class QuartoView extends GameView {
    constructor(factory, deskE, active) {
        super(factory, deskE, active, "Quarto", "quarto_board", 0, true
            , "quarto_board_spot");

        /*Status*/
        //this._statusM = new C4SM();

        /* View status */
        this._spots = [];
        this._sideSpots = [];
        this._pieces = [];

        this._selectedPcE;
        this._lastSpotE;

        this._clickState = null;

        this._initGame();

        //keyboard event status
        //this._keyActivated = 23;
        //this._isKeyActivatedShown = false;
    }

    _noSelected() {
        if (this._selectedPcE) {
            this._selectedPcE.classList.remove("selected");
            this._selectedPcE = null;
        }
    }

    _noClick() {
        if (this._clickState) {
            this._boardE.classList.remove("click-" + this._clickState);
            this._clickState = null;
        }
    }

    addClick(isSelect) {
        const cl = isSelect ? "piece" : "spot";
        if (cl !== this._clickState) {
            this._noClick();
            this._clickState = cl;
            this._boardE.classList.add("click-" + cl);
        }
    }

    move(pci, spi, finish, result, matte = null) {
        const pieceE = this._pieces[pci],
            spotE = this._spots[spi];

        // Clearing click and selected classes
        this._noSelected();
        this._noClick();

        // Clearing spot emptiness
        spotE.classList.remove("gspot-empty");

        // Moving the piece
        spotE.appendChild(pieceE);

        // Moving lastSpot class to the recent
        this._lastSpotE?.classList.remove("gspot-last");
        this._lastSpotE = spotE;
        spotE.classList.add("gspot-last");

        if (finish) {
            if (result && matte) {
                for (let i = 0; i < 16; i++) {
                    if (matte & (1 << i)) {
                        this._spots[i].classList.add("gspot-win");
                    }
                }
            }

            this.showResult(result);
        }
    }

    select(pci) {
        const piece = this._pieces[pci];

        this._noSelected();
        this._noClick();

        this._selectedPcE = piece;
        piece.classList.add("selected");
    }

    /*
    _showCursor(IdSpot) {
        //todo: implement
    }

    _hideCursor(IdSpot) {
        //todo: implement
    }

    // Keyboard handlers
    _coursorEvent(keyC) {
    }
    */

    _boardClick(ev) {
        let elem, id;
        if (this._clickState) {
            // Spot click
            if ((this._clickState === "spot")) {
                elem = ev.target.closest(".tertio_board_spot");
                if (elem?.classList.contains("gspot-empty")) {
                    id = Number.parseInt(elem.getAttribute("data-spi"));
                    // Intend
                    this._repplyPlug?.moveIntend(id);
                }
            }

            // Piece click
            if ((this._clickState === "piece")) {
                elem = ev.target.closest(".quarto_piece");
                if (elem?.closest(".tertio_board_side")) {
                    id = Number.parseInt(elem.getAttribute("data-pci"));
                    // Intend
                    this._repplyPlug?.selectIntend(id);
                }
            }
        }
    }

    _pieceSpotRearrange() {
        for (let i = 0; i < 16; i++) {
            // Moving the pieces to their original side spot
            this._sideSpots[i].appendChild(this._pieces[i]);

            // Making the spots empty for cursor and removing winning
            this._spots[i].classList.add("gspot-empty");
            this._spots[i].classList.remove("gspot-win");
        }
    }

    _initGame() {
        const board = this._boardE,
            ring = document.createElement("div"),
            sideContainers = [document.createElement("div"), document.createElement("div")],
            div = document.createElement("div");
        let i, elem, piece;

        // The spots
        for (i = 0; i < 16; i++) {
            elem = document.createElement("div");
            elem.classList.add("quarto_board_spot");
            elem.setAttribute("data-spi", i);
            div.appendChild(elem);

            this._spots.push(elem);
        }

        // Sides
        sideContainers[0].classList.add("quarto_board_side");
        sideContainers[1].classList.add("quarto_board_side", "quarto_board_side-right");

        for (i = 0; i < 16; i++) {
            // Side spots
            elem = document.createElement("div");
            sideContainers[i & 1].appendChild(elem);
            this._sideSpots.push(elem);

            // Pieces
            piece = document.createElement("div");
            piece.setAttribute("data-pci", i);
            piece.classList.add("quarto_piece");
            if (i & 1) piece.classList.add("piece-drill");
            if (i & 2) piece.classList.add("piece-dark");
            if (i & 4 ^ 4) piece.classList.add("piece-round");
            if (i & 8 ^ 8) piece.classList.add("piece-small");
            this._pieces.push(piece);
        }

        this._pieceSpotRearrange();

        ring.classList.add("quarto_board_ring");
        ring.appendChild(div);
        board.appendChild(sideContainers[0]);
        board.appendChild(ring);
        board.appendChild(sideContainers[1]);

        this._initDesk();
    }

    newGame() {
        this._clearResult();
        this._pieceSpotRearrange();
    }

}
