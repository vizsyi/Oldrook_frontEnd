import GameView from "./gameView.js";
//import C4SM from "../models/c4SM.js";

class C4Brick {
    static sideColors = ["yellow", "red", "empty"];

    constructor(elem, side = 1) {
        this._elem = elem;
        //this._chip = elem.lastChild;
        this._side = side;
        this._matte = false;
    }

    setColor(side){
        if (side !== this._side) {
            this._elem.classList.remove("c4-" + C4Brick.sideColors[this._side]);
            this._elem.classList.add("c4-" + C4Brick.sideColors[side]);
            this._side = side;
        }

        if (this._matte){
            this._elem.classList.remove("matte");
            this._matte = false;
        }
    }

    matte(){
        this._matte = true;
        this._elem.classList.add("matte");
    }

}

export default class C4View extends GameView {
    constructor(factory, deskE, active, id)
    {
        super(factory, deskE, active, id, "Connect 4", "c4_board", 0, false);

        /*Status*/
        //this._statusM = new C4SM();
        
        /* View status */
        this._bricks = [];
        this._nextColBricks = [];
        this._nextColBricks.length = 7;
  
        this._initView();
    }

 
    move (col, matte, isMach){
        this._nextColBricks[col].setColor(this._statusM.side);

        this._nextColBricks[col] = this._bricks[this._statusM.nextColPos(col)];

        if (this._statusM.finished) {
            if (matte){
                //horDown | horUp | leftDown | rightDown | verDown;
                const winArr = this._statusM.matte(false)
                .map(bit => this.bitToArray(bit)),
                winSteps = [1, 1, 9, 7, 8];
                let i, mb, step;

                for (let w = 0; w < 5; w++){
                    if (winArr[w].length > 0){
                        step = winSteps[w];
                        winArr[w].forEach(br => {
                            mb = (w === 1) ? br + 32 : br;
                            this._bricks[mb].matte();
                        });
                        for (i = 0; i < 3; i++){
                            mb += step;
                            this._bricks[mb].matte();
                        }

                    }
                }

                this.showResult(isMach ? -1 : 1);
            }
            else {
                this.showResult(0);
            }

        }
    }

    _boardClick(ev){
        const elem = ev.target.closest(".c4_touch")?.closest(".c4_brick.c4-empty");
        if (elem){
            const col = Number.parseInt(elem.getAttribute("data-col"));

            // Intend
            this._repplyPlug.intend(col);

        }
    }

    _initView() {
        const //frag = this._fragmentF,
            board = this._boardE,
            tempbrick = this._gameTemplates.querySelector(".c4_brick");
        let col, rowCl; 

        // The border
        for (col = 0; col < 4; col++) {
            let brick = document.createElement("div");
            brick.classList.add("c4_border");
            board.appendChild(brick);
        }
        
        // The upper row
        for (col = 0; col < 9; col++) {
            let pause = document.createElement("div");
            pause.classList.add("pause");
            board.appendChild(pause);
        }

        // Creating the cards
        for (let row = 6; row > 0; row--){
            rowCl = "c4_row-" + row;
            this._bricks.unshift(null);
            for (col = 6; col >= 0; col--) {
                let brick = tempbrick.cloneNode(true);
                brick.setAttribute("data-col", col);
                brick.classList.add(rowCl, "c4-red");
                this._bricks.unshift(new C4Brick(brick));
                board.appendChild(brick);
            }
        }

        //board.classList.add("c4_board");
        //frag.appendChild(board);
        //this._appendResultModal(this._fragmentF);
        //this._deskE.appendChild(frag);

        this._initDesk();

    }

    newGame(){
        this._clearResult();
        
        this._bricks.forEach((brick, i) => 
            brick?.setColor(this._statusM.brickSides[i]));

        for (let col = 0; col < 7; col++) {
            this._nextColBricks[col]
                = this._bricks[this._statusM.nextColPos(col)];
        }
    }

}
