import GameView from "./gameView.js";

class MorrisPiece {

    constructor(elem, spot = 26) {
        this._elem = elem;
        this._spot = spot;
    }

}

export default class MorrisView extends GameView {
    constructor(factory, deskE, active) {
        super(factory, deskE, active, "Morris", "morris_board", 0, true
            , "morris_board_spot");

        /*Status*/
        //this._statusM = new C4SM();

        /* View status */
        this._spots = [];
        this._pieces = [];

        this._initGame();

        //keyboard event status
        this._coursorMoveMap = new Map([
            [33, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 20, 21, 22, 23, 16, 17, 18, 19]], //PageUp
            [34, [-1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], //PageDown
            [37, [2, 0, 1, 11, 5, 6, 4, 3, 10, 8, 9, 19, 13, 14, 12, 7, 18, 16, 17, 23, 21, 22, 20, 15]], //ArrLeft
            [38, [6, 5, 4, 2, 3, 13, 7, 0, 14, 1, 12, 10, 11, 21, 15, 8, 22, 9, 20, 18, 19, 17, 23, 16]], //ArrUp
            [39, [1, 2, 0, 7, 6, 4, 5, 15, 9, 10, 8, 3, 14, 12, 13, 23, 17, 18, 16, 11, 22, 20, 21, 19]], //ArrRight
            [40, [7, 9, 3, 4, 2, 1, 0, 6, 15, 17, 11, 12, 10, 5, 8, 14, 23, 21, 19, 20, 18, 13, 16, 22]] //ArrDown
        ]);
        this._keyActivated = 23;
        this._isKeyActivatedShown = false;
    }

    move(col, matte, isMach) {
    }

    _showCursor(IdSpot) {
        //todo: implement
    }

    _hideCursor(IdSpot) {
        //todo: implement
    }

    // Keyboard handlers
    _coursorEvent(keyC) {
        const nextArr = this._coursorMoveMap.get(keyC);
        if (nextArr) {
            if (this._isKeyActivatedShown) {
                const nextAct = nextArr[this._keyActivated];
                if (nextAct >= 0) {
                    this._hideCursor(this._keyActivated);
                    this._keyActivated = nextAct;
                    this._showCursor(nextAct);
                }
            }
            else {
                this._isKeyActivatedShown = true;
                this._showCursor(this._keyActivated);
            }
        }
    }

    _boardClick(ev) {
        const elem = ev.target.closest(".morris_board_node");
        if (elem) {
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
        for (i = 0; i < 24; i++) {
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
        for (h = 0; h < 24; h += 12) {
            elem = document.createElement("div");
            elem.classList.add("morris_board_spot");
            elem.setAttribute("data-spi", 28);
            for (i = 0; i < 9; i++) {
                j = h + i;
                pieceE = document.createElement("div");
                pieceE.classList.add(...pclassL);
                pieceE.setAttribute("data-pii", j);
                pieceE.draggable = true;
                elem.appendChild(pieceE);

                this._pieces[j] = new MorrisPiece(pieceE);
            }
            board.appendChild(elem);

            if (h === 0) {
                ring.classList.add("morris_board_ring");
                board.appendChild(ring);
                pclassL.push("piece-dark");
            }
        }

        //this._appendResultModal();
        //this._applyDesk();
        this._initDesk();

    }

    newGame() {
        this._clearResult();

    }

}
