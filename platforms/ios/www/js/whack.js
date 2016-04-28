//window.onerror = function(msg, url, linenumber) {
//    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
//    return true;
//}
var app = {

  
    initialize: function() {
        this.bindEvents();
			
		//loadJSONData()
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
        					jsonObject = JSON.parse('[{"id":1,"Password":"password123","Type": 2},{"id":2,"Password":"I<3Horses","Type": 2},{"id":3,"Password":"JknsD3@anmAiLfknsma!","Type": 2},{"id":4,"Password":"HappyDays","Type": 2},{"id":5,"Password":"TheBestPassword","Type": 2},{"id":6,"Password":"TheWorstPassword","Type": 2},{"id":7,"Password":"2@Atak","Type": 2},{"id":8,"Password":"24pples2D4y","Type": 2},{"id":9,"Password":"IWasBornIn1919191995","Type": 2},{"id":10,"Password":"2BorNot2B_ThatIsThe?","Type":1},{"id":10,"Password":"4Score&7yrsAgo","Type":1}]');
        document.addEventListener('touchmove', touchMove);
        document.addEventListener("touchstart",touchStart);
        document.addEventListener("touchend",touchEnd);
        
        //requestAnimationFrame(main)
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        
        dir.getFile("whack_results.json", {create:true}, function(file) {
            results_file = file;
			dir.getFile("whack_questions.json", {create:true}, function(file) {
				questions_file = file;
				questions_file.file(function(file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					filedata=this.result;
                                    console.log(filedata);
					jsonObject = JSON.parse(filedata)
                                    
                                     document.getElementsByClassName('back')[0].onclick = back;
									document.getElementsByClassName('play')[0].onclick = play;

				};
				reader.readAsText(file);
			}, fail);
					
			});
        });
	});
    },

};
var results_file
var finger_x;
var finger_y;
var questions_file
var results_arr = []
var baseDelay = 5000
var hitMissDelay = 2000
var score = 0;
var stopGame = false;
var startTimer = 30000;
var timer = startTimer;
var bgImage = new Image();
bgImage.src = 'assets/img/passBG.png';
var timeBarImage = new Image();
timeBarImage.src = 'assets/img/time_bar.png'
var timeImage = new Image();
timeImage.src = 'assets/img/time.png'
var timePercentage = 1;
var moleImage = new Image();
moleImage.src = 'assets/img/mole.png';
var hitImage = new Image();
hitImage.src = 'assets/img/hit.png';
var missImage = new Image();
missImage.src = 'assets/img/miss.png';
var moleHitImage = new Image();
moleHitImage.src = 'assets/img/mole_hit.png';
var moleMissImage = new Image();
moleMissImage.src = 'assets/img/mole_miss.png';
var hit_sound_list = [];
var hit_sound_index = 0;
var hit_sound;
var miss_sound;
var miss_sound_list = [];
var miss_sound_index = 0;
var hit_sound2;
var miss_sound2;
function loadAudio() {
	hit_sound = new Audio('assets/audio/hit.mp3');
	hit_sound.load();
	hit_sound_list.push(hit_sound);
	
	for (var i=0;i<4;i++){
		hit_sound2 = hit_sound;
		hit_sound2.load();
		hit_sound_list.push(hit_sound2);
	
	}
	miss_sound = new Audio('assets/audio/miss.mp3');
	miss_sound.load();
	miss_sound_list.push(miss_sound);
	for (var i=0;i<4;i++){
		miss_sound2 = miss_sound;
		miss_sound2.load();
		miss_sound_list.push(miss_sound2);
	
	}
  
}
function play(){
    document.body.removeChild(document.getElementById("introContainer"));
	loadAudio();
	lastTime = Date.now()
	main();
    
}

function back(){
    window.location.href = 'main.html' + location.search
    
    
}
function moleHole(x,y){
	this.x = x;
	this.y=y;
        this.width = window.innerWidth/2;
        this.height = window.innerHeight/4;
	var holeImage = new Image();
	holeImage.src = 'assets/img/mole_hole.png';
	this.img = holeImage;
	this.mole = null;
}

function mole(password,type,password_id,reason){
    this.img = moleImage;
	this.password = password;
	this.targetType = type;
	this.delay = baseDelay;
	this.password_id = password_id
	this.reason = reason

}


var start = null;
function startPoint(x,y,mole){
	this.x = x;
    this.y = y;
    this.attachedTo = mole;
}
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas)

var moleArr = []

for (i = 0; i < 2; i++)
	for(j=0;j <3;j++)
                moleArr.push(new moleHole(i*(window.innerWidth/2),(j*3+1)*(window.innerHeight/10)))
var lastTime;
function update(){
	timer = timer - (Date.now() - lastTime)
        timePercentage = timer/startTimer
	if(timer <= 0){
		
		stopGame = true;
        if (results_arr.length > 0){
			writeResultsToFile()	
			resultsPopup(0)
        } else {
            
                endingPopup();	
        
        }

	}
	editObjects(Date.now() - lastTime)
}
function resultsPopup(number){
	var oldPopup = document.getElementsByClassName("finalPopup")[0]
	var oldDimmer = document.getElementsByClassName("dimmer")[0]
	if(oldPopup){
		document.body.removeChild(oldPopup);
		document.body.removeChild(oldDimmer);
		}
	var dimmer = document.createElement("div");
	dimmer.className = "dimmer";
	document.body.appendChild(dimmer);
	var popup = document.createElement("div");
	popup.className = "finalPopup";
	var gameOver = document.createElement("div");
	gameOver.className = "gameOver";
	gameOver.innerHTML = "GAME OVER";
	popup.appendChild(gameOver);
	var missed = document.createElement("div");
	missed.className = "missed";
	missed.innerHTML = "You Missed: " + results_arr[number].password;   
	var reason = document.createElement("div");
	reason.className = "reason";			 
	reason.innerHTML = results_arr[number].reason; 
	var next = document.createElement("button");
	next.className = "nextButton";
	next.innerHTML = "NEXT"
	next.addEventListener('touchend', function(event){
							event.preventDefault();
							event.stopPropagation();
							if (number < results_arr.length - 1){
								resultsPopup(number +1)
							} else{
								endingPopup();							
							}
							return true;

							});
	popup.appendChild(missed)
	popup.appendChild(reason)
	popup.appendChild(next)
	document.body.appendChild(popup)
}
function endingPopup(number){
	var oldPopup = document.getElementsByClassName("finalPopup")[0]
	var oldDimmer = document.getElementsByClassName("dimmer")[0]
	if(oldPopup){
		document.body.removeChild(oldPopup);
		document.body.removeChild(oldDimmer);
		}
	var dimmer = document.createElement("div");
	dimmer.className = "dimmer";
	document.body.appendChild(dimmer);
	var popup = document.createElement("div");
	popup.className = "finalPopup";
	var gameOver = document.createElement("div");
	gameOver.className = "gameOver";
	gameOver.innerHTML = "GAME OVER";
	popup.appendChild(gameOver);
	var missedContainer = document.createElement("div");
	missedContainer.className = "finalScoreContainer";
	
	var missed = document.createElement("span");
	missed.className = "finalScore";
	missed.innerHTML = "Final Score: " + score; 
		missedContainer.appendChild(missed)
	var next = document.createElement("button");
	next.innerHTML = "Play Again"
	next.className = "restart";
	next.addEventListener('touchend', function(event){
							event.preventDefault();
							event.stopPropagation();
							restartGame();
							return true;

							});
	var mainMenu = document.createElement("button");
	mainMenu.innerHTML = "Main Menu"
	mainMenu.className = "mainMenu";
	mainMenu.addEventListener('touchend', function(event){
							event.preventDefault();
							event.stopPropagation();
							window.location.href = 'main.html'
							return true;
							});
	popup.appendChild(missedContainer)
	popup.appendChild(next)
	popup.appendChild(mainMenu);
	document.body.appendChild(popup)
}
function restartGame(){
	var oldPopup = document.getElementsByClassName("finalPopup")[0]
	var oldDimmer = document.getElementsByClassName("dimmer")[0]
	if(oldPopup){
		document.body.removeChild(oldPopup);
		document.body.removeChild(oldDimmer);
		}
	timer = 30000;
	score = 0;
	for(j=0;j<6;j++)
		moleArr[j].mole = null
	results_arr = [];
	
	stopGame = false;
	lastTime = Date.now()
	main();
}

function playMedia(src) {
    
    // Android needs the search path explicitly specified
    if (navigator.userAgent.match(/Android/i) == "Android") {
        src = '/android_asset/www/' + src;
    }
    
    var mediaRes = new Media(src,
                             function onSuccess() {
                             // release the media resource once finished playing
                             mediaRes.release();
                             },
                             function onError(e){
                             console.log("error playing sound: " + JSON.stringify(e));
                             });
    mediaRes.play();
    
}


function touchStart(e){

	
	
		for(i=0;i<e.touches.length;i++){
			for(j=0;j<6;j++){
				if(e.touches[i].pageX >= moleArr[j].x && e.touches[i].pageX <= moleArr[j].x +moleArr[j].width && e.touches[i].pageY >= moleArr[j].y && e.touches[i].pageY <= moleArr[j].y + moleArr[j].height && moleArr[j].mole && moleArr[j].mole.img == moleImage){
                    start = new startPoint(e.touches[i].pageX,e.touches[i].pageY, j);
                    finger_x = e.touches[i].pageX
                    finger_y = e.touches[i].pageY
				}
			}
		}
	

}
function touchMove(e){
	
		finger_x = e.touches[0].pageX;
		finger_y = e.touches[0].pageY;
		if ( e.touches[0].pageX / canvas.width >.98)
			touchEnd(e);
	
}
function touchEnd(e){
//        console.log(e.changedTouches[0].pageX, e.changedTouches[0].pageY)
        if(start === null){return}
        if(moleArr[start.attachedTo].mole === null){
          start = null;
          return;
        }

        var colorSelect;
	for(i=0;i<e.changedTouches.length;i++){
			var xDistance = e.changedTouches[i].pageX - start.x
			var yDistance = e.changedTouches[i].pageY - start.y
			if (xDistance * xDistance + yDistance * yDistance >= 225){
				 if(xDistance > 0){
				  colorSelect = 1; //  green
				}else {
				  colorSelect = 2; // red
				}
				if(moleArr[start.attachedTo].mole.targetType == colorSelect){
					score = score + Math.floor(moleArr[start.attachedTo].mole.delay/1000 + 1)*5
                   
					hit_sound_list[hit_sound_index%5].play();
				hit_sound_index++;
					moleArr[start.attachedTo].mole.img = hitImage;
                    moleArr[start.attachedTo].mole.password = '';
                    moleArr[start.attachedTo].mole.delay = hitMissDelay;
				}else{
					results_arr.push({"id":moleArr[start.attachedTo].mole.password_id,"selected":colorSelect,"password":moleArr[start.attachedTo].mole.password,"reason":moleArr[start.attachedTo].mole.reason})
				
						timer = timer - 2000
                     
						miss_sound_list[miss_sound_index%5].play();
				miss_sound_index++;
						moleArr[start.attachedTo].mole.img = missImage;
                        moleArr[start.attachedTo].mole.password = '';
                        moleArr[start.attachedTo].mole.delay = hitMissDelay;
				}
			}
        }
       start = null;
}
function render(){	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "24pt Ariel"
        ctx.textAlign="center";
        ctx.drawImage(bgImage,0,0,window.innerWidth,window.innerHeight)
        ctx.strokeText(score,40,45);
        ctx.fillText(score,40,45);

        ctx.drawImage(timeImage, 100, 20, (window.innerWidth - 110) * timePercentage, 25)
        ctx.drawImage(timeBarImage, 100, 20, window.innerWidth - 110, 25)


        ctx.font = "5vw sans-serif";
    
    if (start && moleArr[start.attachedTo].mole) {
        var xDistance = finger_x - start.x
        if(xDistance > 15){
            moleArr[start.attachedTo].mole.img = moleHitImage;
        }else if (xDistance < -15){
            moleArr[start.attachedTo].mole.img = moleMissImage;
        }
    }
    
	for(i=0; i < 6; i++){
                ctx.drawImage(moleArr[i].img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
                if (moleArr[i].mole){
                    ctx.drawImage(moleArr[i].mole.img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
                    ctx.strokeText(moleArr[i].mole.password.substr(0,12),moleArr[i].x + moleArr[i].width/2,moleArr[i].y + moleArr[i].height/2.5)
                    ctx.fillText(moleArr[i].mole.password.substr(0,12),moleArr[i].x + moleArr[i].width/2,moleArr[i].y + moleArr[i].height/2.5)

                }
	}
	
}

function main (){
	if(!stopGame)
		requestAnimationFrame(main)
    update()
	lastTime = Date.now()
	render()
	
}
var millisecondsPerMole = 4500;
function editObjects(dt){
	for (i=0;i<6;i++){
		if (Math.random() < (1/millisecondsPerMole)*dt && moleArr[i].mole == null){
			var random = getRandomInt(0,jsonObject.length -1)
			moleArr[i].mole = new mole(jsonObject[random].password,jsonObject[random].password_type,jsonObject[random].id,jsonObject[random].wrong_message)
		}
		if(moleArr[i].mole != null){
			moleArr[i].mole.delay = moleArr[i].mole.delay - dt
			
			if(moleArr[i].mole.delay <= 0){
				moleArr[i].mole = null;
                if (i == start.attachedTo) {
                    start = null;
                }
			}
		}
		}
				
			
	}

//}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function writeResultsToFile(){
	var filedata
    results_file.file(function(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
			
			filedata=this.result;

			var datalog = JSON.stringify(results_arr);
			if (filedata.length > 0){
				datalog = "," + datalog;
			}
			results_file.createWriter(function(fileWriter) {
				fileWriter.seek(fileWriter.length);
				
				fileWriter.write(datalog);
				// window.location.href = 'whack_final.html?score=' + score

			}, fail);
        };

        reader.readAsText(file);
    }, fail);

}
function fail(err){
	alert(err)
}


app.initialize();
