import GameRepply from "./gameRepply.js";
import TertioSM from "../models/tertioSM.js";

export default class TertioRepply extends GameRepply {
    constructor(view) {
        super(view,
            null
        );

        this._statusM = new TertioSM();
        view.setStatusM();

        this._newGame();
    }

    _repply() {
        const t_sm = this._statusM;

        return new Promise(function (resolve, reject) {

            if (t_sm.finished || !t_sm.restSpots || t_sm.restSpots.length === 0) {
                reject("There is no more possible move!");
            }
            else {

                let spot = -1, piece = -1;

                // Looking for winning step
                for (const spi of t_sm.restSpots) {
                    const sm = new TertioSM(t_sm);
                    if (sm.placeStep(spi)) {
                        spot = spi;
                        break;
                    }
                }

                // No winning step
                if (spot === -1) {
                    spot = t_sm.restSpots[Math.floor(Math.random() * t_sm.restSpots.length)];

                    // Next piece
                    if (t_sm.restCount > 1) {
                        const i = t_sm.restPcs.indexOf(t_sm.selectedPc);
                        let pi = Math.floor(Math.random() * (t_sm.restCount - 1));
                        if (i !== -1 && pi >= i) pi++;
                        piece = t_sm.restPcs[pi];
                    }
                }

                resolve([spot, piece]);
            }
        });
    }

    _move(spi) {
        let finish, matte, result = 0;
        if ((this._statusM.phase & 1) === 0 && !this._statusM.finished) {

            // Move
            matte = this._statusM.placeStep(spi);
            finish = this._statusM.isFinished();

            if (matte) {
                finish = true;
                matte = this._statusM.whichMatte();
                result = this._statusM.phase === 0 ? -1 : 1;
            }

            this._viewPlug.move(this._statusM.selectedPc, spi, finish, result, matte);

            // Next phase & Click
            if (this._statusM.nextPhase === 3) {
                this._viewPlug.addClick(true);
            }

        }
    }

    _doubleStep(spotPiece) {
        const [spi, pci] = spotPiece;
        this._move(spi);
        if (pci !== -1) {
            setTimeout(this._select.bind(this, pci), 500);
        }
    }

    _select(pci) {
        if (this._statusM.phase & 1 && !this._statusM.finished) {
            this._statusM.select(pci);
            this._viewPlug.select(pci);

            // Start repply method
            if (this._statusM.nextPhase === 0) {
                this._repply()
                    .then(sppc => this._doubleStep(sppc))
                    .catch(err => console.error(err));
            }
            else {
                this._viewPlug.addClick(false);
            }
        }
    }

    _firstSelect() {
        this._select(this._statusM.restPcs[Math.floor(Math.random() * this._statusM.restCount)])
    }

    moveIntend(spi) {
        setTimeout(this._move.bind(this, spi), 200);
    }

    selectIntend(pci) {
        setTimeout(this._select.bind(this, pci), 200);
    }

    _newGame() {
        this._statusM.reset();
        this._viewPlug.newGame();

        this._firstSelect();
    }

}
