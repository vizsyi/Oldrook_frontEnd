(function(){
    "use strict";

    let dropZone = document.getElementById("upload_dropzone");

    let startUpload = function(files){
        console.log(files);
    }

    //Drop functionality
    dropZone.ondrop = function(e){
        e.preventDefault();
        this.classList.remove("drop");

        startUpload(e.dataTransfer.files)
    };

    dropZone.ondragover = function(){
        this.classList.add("drop");
        return false;
    };

    dropZone.ondragleave = function(){
        this.classList.remove("drop");
        return false;
    };
}());