var questions_file
var mail_questions_file
window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
var app = {

  
    initialize: function() {
        this.bindEvents();
		
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
			dir.getFile("whack_questions.json", {create:true}, function(file) {
				questions_file = file;
				dir.getFile("mail_questions.json", {create:true}, function(file) {
					mail_questions_file = file;
					writeWhackQuestionsToFile();
					writeMailQuestionsToFile();
					createCard('whack_splash.png','whack_initial.html',0);
					createCard('virus_splash.png','virus_initial.html',1);
					createCard('mail_splash.png','mail_initial.html',2);
                    console.log(location.search.replace("?duration=",""))
                    playAudio("assets/audio/menu.wav");
				});
			});
			
	});
    }

};
function createCard(splash,home,i){
	var container = document.getElementsByClassName("scroll-holder")[0]
	var width = Math.floor(container.offsetWidth * .75)
	var height = Math.floor(width * (4/3)) * 1.15
	var div = document.createElement("div");

	var upperImg = document.createElement("img");		
	upperImg.src = 'splashscreens/'+splash
	upperImg.onclick = function(){
        mediaRes.getCurrentPosition(
                                    // success callback
                                    function (position) {
                                        if (position > -1) {
                                            mediaRes.release();
                                            window.location.href = home + '?duration=' + position
                                        }
                                    },
                                    // error callback
                                    function (e) {
                                        console.log("Error getting pos=" + e);
                                    });

    };
	div.appendChild(upperImg)
	
	
	var lowerImg = document.createElement("img");
	lowerImg.src = 'assets/img/playbutton.png'
	lowerImg.onclick = function(){
        mediaRes.getCurrentPosition(
                                    // success callback
                                    function (position) {
                                    if (position > -1) {
                                    mediaRes.release();
                                    window.location.href = home + '?duration=' + position
                                    }
                                    },
                                    // error callback
                                    function (e) {
                                    console.log("Error getting pos=" + e);
                                    });
    };
	div.appendChild(lowerImg);
	
	div.style.width= width + 'px';
	div.style.height= height +'px';
	div.className = 'gameCard'
	div.style.top = (container.offsetHeight - height)/2 + 'px'
	div.style.left = width * .075 *(i+1) + 'px'
	container.appendChild(div)
	
	
	
}
function fail(){
	return true;
}

var mediaRes;
function playAudio(src) {
    
        // Android needs the search path explicitly specified
        if (navigator.userAgent.match(/Android/i) == "Android") {
            src = '/android_asset/www/' + src;
        }
        
        mediaRes = new Media(src,
                             function onSuccess() {
                             // What happens when succesfully finished playing
                             },
                             function onError(e){
                             console.log("error playing sound: " + JSON.stringify(e));
                             },
                             function onStatusChange (status) {
                                //console.log("STATUS: " + status)
                                if (status === Media.MEDIA_RUNNING) {
                                    if (location.search) {
                                        mediaRes.seekTo(location.search.replace("?duration=","") * 1000);
                                    }
                                }

                                if (status === Media.MEDIA_STOPPED) {
                                    location.search = ""
                                 }
                             }
                                 );
    mediaRes.play();

    
}
function writeWhackQuestionsToFile(){
	var filedata
	alert('Starting Data Load');
    questions_file.file(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
			filedata=this.result;
			questions_file.createWriter(function(fileWriter) {
				fileWriter.truncate(0);
				if (fileWriter.length <= 0){
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						fileWriter.write(xhttp.responseText);
						alert('Finshed Data Load');
					}
					};
					xhttp.open("GET", "http://cybersafegames.unc.edu/whack_data.php", true);
					xhttp.send();
					
				}
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
				fileWriter.seek(fileWriter.length);
				if (fileWriter.length <= 0){
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						fileWriter.write(xhttp.responseText);
						alert('Whack Loaded')
					}
					};
					xhttp.open("GET", "http://cybersafegames.unc.edu/mail_data.php", true);
					xhttp.send();
					
				}
			}, fail);
        };
        reader.readAsText(file);
    }, fail);

}

function loadWhackData() {
	
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
		
      return xhttp.responseText;
    }
  };
  xhttp.open("GET", "http://cybersafegames.unc.edu/whack_data.php", true);
  xhttp.send();
}


app.initialize();
