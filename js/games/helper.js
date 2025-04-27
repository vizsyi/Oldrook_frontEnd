export default class Helper {

    static removeArrItem (arr, item){// Helper function
        const i = arr.indexOf(item);

        if (i !== -1){
            arr.splice(i, 1);
        }
    }

}