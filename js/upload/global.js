(function(){
    "use strict";

    let dropZone = document.getElementById("upload_dropzone"),
        barFill = document.getElementById("upload_bar_fill"),
        barFillText = document.getElementById("upload_bar_fill_text");

    let startUpload = function(files){
        app.uploader({
            files: files,
            progressBar: barFill,
            progressText: barFillText,
            processor: 'upload.php',

            finished: function(data){
                console.log(data);
            },

            error: function(){
                console.log("There was an error at upload");
            }
        });
        //console.log(files);
    };

    //Standard form upload
    document.getElementById("upload_files").addEventListener("click", function(e){
        let uploadFiles = document.getElementById("upload_files").files;
        e.preventDefault();
        startUpload(uploadFiles);
    });
    
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