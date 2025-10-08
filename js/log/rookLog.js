export default class RLOG {
    static _brCode;
    static _sessionNr;

    static _breakCodes = "_.:";

    constructor() {
    }

    static get brData() {
        return {
            brCode: this._brCode,
            sessionNr: this._sessionNr
        };
    }

    static _creatRCode(length, breaks = []) {
        const blen = this._breakCodes.length;
        let ci, code = "";
        for (let i = 0; i < length; i++) {
            if (breaks.includes(i)) {
                code += this._breakCodes.charAt(Math.floor(Math.random() * blen));
            }
            else {
                ci = Math.floor(Math.random() * 36);
                code += String.fromCharCode(ci > 9 ? ci + 87 : ci | 48);
            }
        }
        return code;
    }

    static getBrowserInfo(data, extraInfo) {
        const userAgent = navigator.userAgent;

        data.resolution = [screen.width, screen.height];

        if (extraInfo) {
            // Languages
            const language = navigator.language || navigator.userLanguage;
            if (language) data.language = language;
            if (navigator.languages) data.languages = navigator.languages;

            // Device, memory information
            if (navigator.hardwareConcurrency) {
                data.threadCount = navigator.hardwareConcurrency;
            }
            if (navigator.deviceMemory) {
                data.dMemoryGB = navigator.deviceMemory;
            }
            if (performance?.memory?.jsHeapSizeLimit) {
                data.heapLimitMB = Math.round(performance.memory.jsHeapSizeLimit / 1000000);
            }
            data.hasKeybAPI = "keyboard" in navigator;

            // From UserAgent
            data.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

            if (userAgent.includes("Chrome") && !userAgent.includes("Edg") && !userAgent.includes("OPR")) {
                data.browserName = "Chrome";
            } else if (userAgent.includes("Firefox")) {
                data.browserName = "Firefox";
            } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
                data.browserName = "Safari";
            } else if (userAgent.includes("Edg")) {
                data.browserName = "Edge";
            } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
                data.browserName = "Opera";
            } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
                data.browserName = "I. Explorer";
            } else {
                data.browserName = "Unknown";
            }
        }

        // From Brand
        /*
        const uadBrands = navigator.userAgentData?.brands;
        let brand = uadBrands ? uadBrands[0] : null;
        if (brand?.brand === "Chromium" && uadBrands[2]) brand = uadBrands[2];
        if (brand && brand.brand && brand.version) {
            this.brand = brand.brand.slice(0, 16);
            this.version = brand.version;
        }
        else {
            this.brand = "_NK_";
            this.version = 0;
        } */

        return data
    }

    static webStart() {
        let oldCode;
        this._brCode = localStorage.getItem("brcode");
        this._sessionNr = parseInt(localStorage.getItem("sessionNr"));

        if (!this._brCode || this._brCode.length !== 16 || isNaN(this._sessionNr)) {
            // Old code
            if (this._brCode && this._brCode.length !== 16) {
                oldCode = this._brCode;
            }
            this._brCode = this._creatRCode(16, [9]);
            this._sessionNr = 0;
            localStorage.setItem("brcode", this._brCode);
            localStorage.setItem("sessionNr", this._sessionNr);
            localStorage.setItem("lastInfoDate", new Date().toISOString().split("T")[0]);
        } else {
            localStorage.setItem("sessionNr", ++this._sessionNr);
        }

        const data = this.brData;
        if (oldCode) data.oldCode = oldCode;
        this.getBrowserInfo(data, this._sessionNr === 0);
    }

}
