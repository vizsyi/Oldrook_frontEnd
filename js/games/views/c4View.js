import GameView from "./gameView.js";
import C4SM from "../models/c4SM.js";

class C4Brick {
    static sideColors = ["yellow", "red", "empty"];

    constructor(elem, side = 1) {
        this._elem = elem;
        //this._chip = elem.lastChild;
        this._side = side;
    }

    setColor(side) {
        if (side !== this._side) {
            this._elem.classList.remove("c4-" + C4Brick.sideColors[this._side]);
            this._elem.classList.add("c4-" + C4Brick.sideColors[side]);
            this._side = side;
        }
    }

}

export default class C4View extends GameView {
    constructor(board)
    {
        super(board);

        /*Status*/
        this._statusM = new C4SM();
        
        /* View status */
        this._bricks = [];
        this._nextColBricks = [];
        this._nextColBricks.length = 7;
  
        this._initGame();
    }

 
    move (col){
        this._nextColBricks[col].setColor(this._statusM.side);

        this._nextColBricks[col] = this._bricks[this._statusM.nextColPos(col)];

        if (this._statusM.finished) {
            const winArr = this._statusM.matte(undefined, undefined, false)
               .map(bit => this.bitToArray(bit));
            console.log(winArr);
        }
    }

    _boardClick(ev){
        const elem = ev.target.closest(".c4_touch")?.closest(".c4_brick.c4-empty");
        if (elem){
            const col = Number.parseInt(
                elem.getAttribute("data-col"));

            // Intend
            this._repplyPlug.intend(col);

        }
    }

    _initGame() {
        const frag = document.createDocumentFragment(),
            tempcard = document.querySelector("#jsTemplates .c4_brick");
        let col, rowCl; 

        // The border
        for (col = 0; col < 4; col++) {
            let card = document.createElement("div");
            card.classList.add("c4_border");
            frag.appendChild(card);
        }
        
        // The upper row
        for (col = 0; col < 9; col++) {
            let card = document.createElement("div");
            card.classList.add("pause");
            frag.appendChild(card);
        }

        // Creating the cards
        for (let row = 6; row > 0; row--){
            rowCl = "c4_row-" + row;
            this._bricks.unshift(null);
            for (col = 6; col >= 0; col--) {
                let brick = tempcard.cloneNode(true);
                brick.setAttribute("data-col", col);
                brick.classList.add(rowCl, "c4-red");
                this._bricks.unshift(new C4Brick(brick));
                frag.appendChild(brick);
            }
        }

        this._board.classList.add("c4_board");
        this._board.appendChild(frag);
    }

    newGame(){
        this._bricks.forEach((brick, i) => 
            brick?.setColor(this._statusM.brickSides[i]));

        for (let col = 0; col < 7; col++) {
            this._nextColBricks[col]
                = this._bricks[this._statusM.nextColPos(col)];
        }
    }

}
