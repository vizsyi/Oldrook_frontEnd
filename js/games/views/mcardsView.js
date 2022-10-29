import GameView from "./gameView.js";
import MCardsSM from "../models/mcardsSM.js";

class CardItem {
    constructor(index, elem, game) {
        this._index = index;
        this._elem = elem;
        this._game = game;
        this._status = "solved";
    }

    setStatus(status) {
        if (status !== this._status) {
            this._elem.classList.remove("mcard-" + this._status);
            this._elem.classList.add("mcard-" + status);
            this._status = status;
        }
    }

    turnUp(status, cName) {
        let labelE; /*imgE,*/
        //imgE = this.element.querySelector(".mcard_img img");
        labelE = this._elem.querySelector(".mcard_label span");
        //if(imgE) imgE.setAttribute("src", this._game.celebImg + "/" + pUi);
        if(labelE && labelE.innerHTML !== cName) labelE.innerHTML = cName;
        this.setStatus(status);
    }
}

export default class MCardsView extends GameView {
    constructor(board)
    {
        super(board);

        this._pieces = 30;
        this._cards = [];

        /*Status*/
        this._statusM = new MCardsSM(this._pieces);
        //this._selectedCards = [];
        //this._unsolvedPairs = Math.floor(this._pieces / 2);
        //this._isFinished = false;
        
        /* View status */
        this._upCards = [];
        this._upCardsStatus = "";
        this._upCardsTO;
        this._clickedCards = [];
  
        this._initGame(this._pieces);
    }

    get pieces (){
        return this._pieces;
    }

    _upCardsBack (nextCards = null){
        //console.log("this", this._upCards);
        this._upCards.forEach(card => {
            if(!nextCards?.includes(card)) card.setStatus(this._upCardsStatus);
        });
        this._upCards.length = 0;
        this._upCardsTO = null;
    }
    
    move (cards, isPair = false){
        let status;
        //const indexes = cards.map(card => card.index);
        const cItems = cards.map(card => this._cards[card.index]);

        // Setting back the previous selection
        if (this._upCardsTO) {
            clearTimeout(this._upCardsTO);
            this._upCardsBack (cItems);
        }

        // Setting down the unselected clicked card
        /*if (this._clickedCard && !cItems.includes(this._clickedCard))
            this._clickedCard.setStatus("down");
        this._clickedCard = null;*/

        // Removing the clicked class
        this._clickedCards.forEach(card => card._elem.classList.remove("clicked"));
        this._clickedCards.length = 0;

        //Showing the cards
        this._upCards = cItems;
        if (isPair){
            status =  "pair";
            this._upCardsStatus = "solved";
        }
        else {
            status =  "up";
            this._upCardsStatus = "down";
        }
        cards.forEach(card =>
            this._cards[card.index].turnUp(status, card.name));

        if (cards.length > 1)
            this._upCardsTO = setTimeout(this._upCardsBack.bind(this), 2000);
    }

    _boardClick(ev){
        const elem = ev.target.closest(".mcard");
        if (elem){
            const id = Number.parseInt(elem.getAttribute("data-id"));
            // Adding clicked class
            const card = this._cards[id];
            this._clickedCards.push(card);
            card._elem.classList.add("clicked");

            // Intend
            this._repplyPlug.intend(id);

            //Test to remove
            //console.log("Card: ", ev, elem, id, card);

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
            card.classList.add("mcard-solved");
            this._cards.push(new CardItem(i, card, this));
            frag.appendChild(card);
        }
        for (let i = 0; i < 2; i++) {
            let card = document.createElement("div");
            card.classList.add("pause");
            frag.appendChild(card);
        }

        this._board.appendChild(frag);
    }

    newGame(){
        this._cards.forEach((card, i) => {
            if(this._statusM.unsolvedCards[i]) card.setStatus("down");
        });
    }

}
