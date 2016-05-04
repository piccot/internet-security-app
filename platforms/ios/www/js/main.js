var questions_file
var mail_questions_file
// window.onerror = function(msg, url, linenumber) {
    // alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    // return true;
// }
var app = {

  
    initialize: function() {
        this.bindEvents();
		
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
	
	//first parameter is the 4x3 splash screen, next is the page the card should link to, next is the order in which it should appear
					createCard('whack_splash.png','whack.html',0);
					createCard('virus_splash.png','virus.html',1);
					createCard('mail_splash.png','mail.html',2);
                    playAudio("assets/audio/menu.wav");
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



app.initialize();
