import GameView from "./gameView.js";
//import MCardsSM from "../models/mcardsSM.js";

class CardItem {
    constructor(index, elem, view) {
        this._index = index;
        this._elem = elem;
        this._view = view;
        this._status = "solved";
    }

    setStatus(status) {
        if (status !== this._status) {
            this._elem.classList.remove("mcard-" + this._status);
            this._elem.classList.add("mcard-" + status);
            this._status = status;
        }
    }

    turnUp(status, card) {
        let imgE, labelE;
        imgE = this._elem.querySelector(".mcard_img img");
        labelE = this._elem.querySelector(".mcard_label span");
        if(imgE) imgE.setAttribute("src", this._view.celebImgPath + card.img);
        if(labelE && labelE.innerHTML !== card.name) labelE.innerHTML = card.name;
        this.setStatus(status);
    }
}

export default class MCardsView extends GameView {
    constructor(factory, deskE, id)
    {
        super(factory, deskE, id, "Memory cards", "mcards30_board");

        this._pieces = 30;
        this._cards = [];

        this._resultOutputs;

        /*Status*/
        //this._statusM = new MCardsSM(this._pieces);
        //this._selectedCards = [];
        //this._unsolvedPairs = Math.floor(this._pieces / 2);
        //this._isFinished = false;

        /* Settings */
        this.celebImgPath = "./img/celebs/";
        
        /* View status */
        this._upCards = [];
        this._upCardsStatus = "";
        this._upCardsTO;
        this._clickedCards = [];
  
        this._initView(this._pieces);
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
            this._cards[card.index].turnUp(status, card));

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

    _initView(pieces) {
        const //frag = this._fragmentF,
            board = this._boardE,
            resultModal = this._jsTemplates.querySelector(".mcardresult").cloneNode(true),
            tempcard = this._jsTemplates.querySelector(".mcard");

        //Creating the cards
        for (let i = 0; i < pieces; i++) {
            let card = tempcard.cloneNode(true);
            card.setAttribute("data-id", i);
            card.classList.add("mcard-solved");
            this._cards.push(new CardItem(i, card, this));
            board.appendChild(card);
        }
        for (let i = 0; i < 2; i++) {
            let card = document.createElement("div");
            card.classList.add("pause");
            board.appendChild(card);
        }

        //frag.appendChild(board);
        //this._fragmentF.appendChild(resultModal);
        //this._desk.appendChild(frag);

        this._resultOutputs = resultModal.querySelectorAll("output");
        //this._setResultModal(resultModal, false);

        this._initDesk(resultModal, false);
    }

    newGame(){
        this._clearResult();

        this._cards.forEach((card, i) => {
            if(this._statusM.unsolvedCards[i]) card.setStatus("down");
        });
    }

    showResult(){
        if (this._resultOutputs.length > 2){
            this._setResult("result");
            this._resultOutputs[0].value = this._statusM.period;
            this._resultOutputs[1].value = this._statusM.stepCount;
            this._resultOutputs[2].value = this._statusM.points;
        }
    }

}
