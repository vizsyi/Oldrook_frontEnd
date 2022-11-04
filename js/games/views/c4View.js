import GameView from "./gameView.js";
import C4SM from "../models/c4SM.js";

class C4Brick {
    static colors = ["yellow", "red", "empty"];

    constructor(elem, colorId = 1) {
        this._elem = elem.lastChild;
        //this._chip = elem.lastChild;
        this._colorId = colorId;
    }

    setColor(colorId) {
        if (colorId !== this._colorId) {
            this._elem.classList.remove("c4-" + colors[this._colorId]);
            this._elem.classList.add("c4-" + colors[colorId]);
            this._colorId = colorId;
        }
    }

}

export default class C4View extends GameView {
    constructor(board)
    {
        super(board);

        this._bricks = [];

        /*Status*/
        this._statusM = new C4SM();
        
        /* View status */
  
        this._initGame();
    }

 
    move (col){
    }

    _boardClick(ev){
        const elem = ev.target.closest(".c4_brick.c4-empty c4_touch");
        if (elem){
            const col = Number.parseInt(
                elem.parentElement.getAttribute("data-col"));

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
            brick.setColor(this._statusM.brickColors[i]));
    }

}
