export default class RLOG{ 
    static _breakCodes = "-_.:";
    static _brCode;
    static _sessCode;

    static Navigat = class{
        constructor(){
            this.brand;
            this.version;
            this.lang;
            this.deviceMemory;

            this._init();
        }

        _init(){
            let brand, navi = window.navigator, uadBrands;

            // User agent //
            uadBrands = navi?.userAgentData?.brands;
            brand = uadBrands ? uadBrands[0] : null;
            if (brand?.brand === "Chromium" && uadBrands[2]) brand = uadBrands[2];
            if (brand && brand.brand && brand.version){
                this.brand = brand.brand.slice(0, 16);
                this.version = brand.version;
            }
            else {
                this.brand = "_NK_";
                this.version = 0;
            }

            // Other navigator property //
            this.lang = navi.language ?? "_NK_";
            this.deviceMemory = navi.deviceMemory ?? 0;

        }
    }

    constructor(){
    }

    
    static _creatRCode (length, breaks = []){
        let ci, code = "", blen = this._breakCodes.length;
        for (let i = 0; i < length; i++){
            if (breaks.includes(i)){
                code += this._breakCodes.charAt(Math.floor(Math.random() * blen));
            }
            else {
                ci = Math.floor(Math.random() * 36);
                code += String.fromCharCode(ci > 9 ? ci + 87 : ci | 48);
            }
        }
        return code;
    }

    static webStart(){
        let isNew = 0, navig = new this.Navigat();
        this._brCode = localStorage.getItem("brcode");
        this._sessCode = this._creatRCode(6, [3]);

        if (!this._brCode){
            this._brCode = this._creatRCode(8, [4]);
            localStorage.setItem("brcode", this._brCode);
            isNew = 1;
        }

        console.log("AJAX", "Visitor", isNew, this._brCode, this._sessCode, navig.lang, navig.brand, navig.version, navig.deviceMemory);
    }

}
