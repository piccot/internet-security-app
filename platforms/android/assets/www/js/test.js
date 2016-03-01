
var app = {

  
    initialize: function() {
        this.bindEvents();
			
		//loadJSONData()
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {	
		 window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        alert("got main dir",dir);
        dir.getFile("log.txt", {create:true}, function(file) {
            alert("got the file", file);
            logOb = file;
            writeLog("App started"); 
			
        });
		
    });
       
    },

};
 
 var logOb
 
function writeLog(str) {
    if(!logOb) return;
    var log = str + " [" + (new Date()) + "]\n";
    alert("going to log "+log);
    logOb.createWriter(function(fileWriter) {
        fileWriter.seek(fileWriter.length);
		fileWriter.onwrite = function (e) {
			console.log("written");
		
		}
        var blob = new Blob([log], {type:'text/plain'});
        fileWriter.write("Test Text");
		justForTesting()
    }, fail);
}
function fail(error){
	alert(error);
}
function justForTesting() {
	alert("test");
	alert(logOb)
	alert(logOb.file)
    logOb.file(function(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
			alert(reader.readyState);
			alert(reader.result);
            alert(this.result);
        };

        reader.readAsText(file);
    }, fail);

}
app.initialize();