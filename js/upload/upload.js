let app = app || {};

(function(o){
    "use strict";

    // Private methods
    let ajax, getFormData, setProgress;

    ajax = function(data){
        const xmlhttp = new XMLHttpRequest();
        let uploaded;

        xmlhttp.addEventListener('readystatechange', function(){
            if(this.readyState === 4){
                if(this.status === 200){
                    //console.log('AJAX ok.');
                    uploaded = JSON.parse(this.response);
                    if(typeof o.options.finished === 'function'){
                        o.options.finished(uploaded);
                    }
                }
                else {
                    if(typeof o.options.error === 'function'){
                        o.options.error();
                    }
                }
            }
        });

        xmlhttp.open('post', o.options.processor);
        xmlhttp.send(data);
    };

    getFormData = function(source){
        const data = new FormData();
        
        for (let i = 0; i < source.length; i++){
            data.append('files[]', source[i]);
        }

        return data;
    };

    setProgress = function(){

    };


    o.uploader = function(options){
        o.options = options;

        if(o.options.files !== undefined){
            ajax(getFormData(o.options.files));
        }
    };
}(app))