function begin(){
    document.getElementById("background").onclick = play;
    var tap = document.getElementsByClassName("tapAnywhere")[0]
	tap.style.display = "block";
}
var popup;
var body;
var app = {

  
    initialize: function() {
        this.bindEvents();
		
	},

    bindEvents: function() {
        document.addEventListener('filePluginIsReady', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
	
		window.onerror = function(msg, url, linenumber) {
			alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
			return true;
		}
		popup = document.createElement("div");
		popup.className = "popup";
		var headerContainer= document.createElement("div");
		headerContainer.className = "popupHeader";
		var header = document.createElement("span");
		header.innerHTML = "Checking For Updates";
		
		headerContainer.appendChild(header);
		popup.appendChild(headerContainer);
		
		bodyContainer = document.createElement("div");
		bodyContainer.className = "popupBody";
		body = document.createElement("span")
		body.innerHTML = "Checking...";
		bodyContainer.appendChild(body);
		popup.appendChild(bodyContainer);
		document.body.appendChild(popup);
		//load all the files we are going to need
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
		dir.getFile("info.json", {create:true}, function(file) {
				update_file = file;
				dir.getFile("whack_questions.json", {create:true}, function(file) {
				questions_file = file;
				dir.getFile("mail_questions.json", {create:true}, function(file) {
					mail_questions_file = file;
					checkForUpdates();
					
				});
			});
		});
	});
    }

};
var questions_file;
var mail_questions_file;
var update_file;

function play(){
    window.location.href = 'main.html'
    
}

function checkForUpdates(){
   
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
      
	if (xhttp.readyState == 4 && xhttp.status == 200) {
        //connected to the update page and seeing if we need to run a download
		var updateData = JSON.parse(xhttp.responseText);
        
		var mail_date
		var whack_date
		if (updateData[0].type == "MAIL"){
            
			mail_date = new Date(updateData[0].date)
			whack_date = new Date(updateData[1].date)
		} else {
			whack_date = new Date(updateData[0].date)
			mail_date = new Date(updateData[1].date)
		}
        
		update_file.file(function(file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				filedata=this.result;
				update_file.createWriter(function(fileWriter) {
					//if the PID has been written before
					if (filedata.length > 0){
						var jsonObject = JSON.parse(filedata);
						var last_update = new Date(jsonObject.updated);
                                         
                                         
						if (mail_date < last_update || true){
							body.innerHTML= "Downloading..."
							writeMailQuestionsToFile()
							}
                                         else{
							mail_done = true;
                                         checkDone();
                                         }
						if (whack_date < last_update){
							body.innerHTML= "Downloading..."
							writeWhackQuestionsToFile()
							}
                                         else{
							whack_done = true
                                         checkDone();
                                         }
						
					} else { //If we need a new PID
						
						var PID = ""
						while (PID.length < 5){
							PID = prompt("Please enter your PID");
						}
						fileWriter.write('{"PID":"'+PID+'","updated":"'+Date.now()+'"}');
						body.innerHTML= "Downloading..."
						writeMailQuestionsToFile()
						writeWhackQuestionsToFile()
						
					}	
				})
			};
			reader.readAsText(file);
    }, fail);
		
	}
	};
	xhttp.open("GET", "http://cybersafegames.unc.edu/update_data.php", true);
	xhttp.send();

}
var whack_done = false
var mail_done = false


function writeWhackQuestionsToFile(){
	var filedata
    
    questions_file.file(function(file) {
                        
        var reader = new FileReader();
        reader.onload = function(e) {
                       
			filedata=this.result;
			questions_file.createWriter(function(fileWriter) {
                                       
				fileWriter.truncate(0);
				
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						fileWriter.write(xhttp.responseText);
						whack_done = true;
						checkDone();
                     }
					};
					xhttp.open("GET", "http://cybersafegames.unc.edu/whack_data.php", true);
					xhttp.send();
					
				
			}, fail);
        };
        reader.readAsText(file);
    }, fail);

}

function writeMailQuestionsToFile(){
	var filedata
    mail_questions_file.file(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {			
			filedata=this.result;
			mail_questions_file.createWriter(function(fileWriter) {
				fileWriter.truncate(0);
                
				
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						
						fileWriter.write(xhttp.responseText);
						mail_done = true;
						checkDone();
					}
					};
					xhttp.open("GET", "http://cybersafegames.unc.edu/mail_data.php", true);
					xhttp.send();
					
				
			}, fail);
        };
        reader.readAsText(file);
    }, fail);

}
//see if both write whack and write mail has been run
function checkDone(){
	if (whack_done && mail_done){
		document.body.removeChild(popup);
		begin()
	}

}

function fail(err){
	alert(err)
}
app.initialize();