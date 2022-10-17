import GameView from "./gameView.js";

class CardItem {
    constructor(game, elem) {
        this._game = game;
        this._elem = elem;
        //this._status = "solved";
        this.status = "down";
    }

    setStatus(status) {
        if (status !== this.status) {
            this._elem.classList.remove("mcard-" + this.status);
            this._elem.classList.add("mcard-" + status);
            this.status = status;
        }
    }

    turnUp(cName) {
        let labelE; /*imgE,*/
        this.setStatus("up");
        //imgE = this.element.querySelector(".mcard_img img");
        labelE = this._elem.querySelector(".mcard_label span");
        //if(imgE) imgE.setAttribute("src", this._game.celebImg + "/" + pUi);
        if(labelE) labelE.innerHTML = cName;
    }
}

export default class mcardsView extends GameView {
    constructor(board)
    {
        super(board);

        this._pieces = 30;
        this._cards = [];

        /*Status*/
        this._selectedCards = [];
        this._unsolvedPairs = Math.floor(this._pieces / 2);
        this._isFinished = false;
        this._clickedCard = null;

        this._initGame(this._pieces);
    }

    _boardClick(ev){
        const elem = ev.target.closest(".mcard");
        if (elem){
            const id = Number.parseInt(elem.getAttribute("data-id"));
            const card = this._cards[id];
            //Test
            console.log("Card: ", ev, elem, id, card);
            if(card.status === "up"){
                card.setStatus("down");
            }
            else {
                card.turnUp("Robert Lewandowski");
            }
            
        }
    }

    _initGame(pieces) {
        const frag = document.createDocumentFragment(),
            tempcard = document.querySelector("#jsTemplates .mcard");

        this._board.classList.add("mcards" + pieces + "_board");

        //Creating the cards
        for (let i = 0; i < pieces; i++) {
            let card = tempcard.cloneNode(true);
            card.setAttribute("data-id", i);
            card.classList.add("mcard-down");
            this._cards.push(new CardItem(this, card));
            frag.appendChild(card);
        }
        for (let i = 0; i < 2; i++) {
            let card = document.createElement("div");
            card.classList.add("pause");
            frag.appendChild(card);
        }

        this._board.appendChild(frag);
    }
}