var app = {

  
    initialize: function() {
        this.bindEvents();
        },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
        document.addEventListener('touchmove', touchMove);
        document.addEventListener("touchstart",touchStart);
        document.addEventListener("touchend",touchEnd);
        
        
                    
        // Load passwords from file
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
       
		
           
            dir.getFile("info.json", {create:true}, function(file) {
                        update_file = file;
                        dir.getFile("whack_questions.json", {create:true}, function(file) {
                                    questions_file = file;
                                    questions_file.file(function(file) {
                                    var reader = new FileReader();
                                    reader.onload = function(e) {
                                    filedata=this.result;
                                                        
                                    jsonObject = JSON.parse(filedata)
                                    update_file.file(function(file) {
                                        var reader = new FileReader();
                                        reader.onload = function(e) {
                                            
                                            filedata=this.result;
                                                     console.log(filedata);
                                                     filedata = JSON.parse(filedata);
                                                     console.log(filedata);
                                            pid = filedata.PID;
                                                     document.getElementsByClassName('back')[0].onclick = back;
                                                     document.getElementsByClassName('play')[0].onclick = play;
                                                     };
                                    reader.readAsText(file);
                                    }, fail);
                                    

				};
				reader.readAsText(file);
			}, fail);
					
			});
                        })
        
	});
    },

};
var lastTime;
var results_file
var finger_x;
var finger_y;
var questions_file
var results_arr = []
var game_id = 1;
var baseDelay = 5000
var hitMissDelay = 2000
var score = 0;
var stopGame = false;
var startTimer = 30000;
var timer = startTimer;
var pid;
var update_file;
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
var results_arr2 = [];
var miss_sound_list = [];
var miss_sound_index = 0;
var hit_sound2;
var miss_sound2;
var disableClick = false;

// Preload all audio assets, allows them to be played in a round-robin fashion
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

// Remove Instruction Screen popup, continue to game
function play(){
    document.body.removeChild(document.getElementById("introContainer"));
	loadAudio();
	lastTime = Date.now()
	main();
    
}
// Change window location back to main
function back(){
    window.location.href = 'main.html' + location.search
    
// Each moleHole has a mole associated with it
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

// Moles, and all their attributes
function mole(password,type,password_id,reason){
    this.img = moleImage;
	this.password = password;
	this.targetType = type;
	this.delay = baseDelay;
	this.password_id = password_id
	this.reason = reason

}

// Keep track of which mole the user touches
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

// Intiate mole array, populate it with moleHoles
var moleArr = []
for (i = 0; i < 2; i++)
	for(j=0;j <3;j++)
                moleArr.push(new moleHole(i*(window.innerWidth/2),(j*3+1)*(window.innerHeight/10)))


// The series of popups following the game, displaying all passwords the player got wrong
// Creates a new new HTML element and appends it to the document body
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

// The end game popup that appears after the results popup
// If MainMenu is pressed, then the results are pushed to the database
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
							
							if (!disableClick){
							disableClick=true;
								var xhttp = new XMLHttpRequest();
								
								xhttp.onreadystatechange = function() {

								if (xhttp.readyState == 4 && xhttp.status == 200) {
									window.location.href = 'main.html'
									
								}
								};
							
								xhttp.open("GET", "http://cybersafegames.unc.edu/whack_results_add.php?pid=" + pid + "&json_data=" + encodeURIComponent(JSON.stringify(results_arr2)), true);
								
								xhttp.send();

							}
							});
	popup.appendChild(missedContainer)
	popup.appendChild(next)
	popup.appendChild(mainMenu);
	document.body.appendChild(popup)
}

// Resets all of the variables in the game in preparation for a new start
// Removes any popups
function restartGame(){
	var oldPopup = document.getElementsByClassName("finalPopup")[0]
	var oldDimmer = document.getElementsByClassName("dimmer")[0]
	if(oldPopup){
		document.body.removeChild(oldPopup);
		document.body.removeChild(oldDimmer);
		}
	game_id = game_id +1;
	timer = 30000;
	score = 0;
	for(j=0;j<6;j++)
		moleArr[j].mole = null
	results_arr = [];
	
	stopGame = false;
	lastTime = Date.now()
	main();
}

// Stores the location of the touch to keep track of what mole is currently being worked
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

// Ends the touch if user touches too close to right edge
// Reason for this is that there is a strange occurence where the touch event freezes on the right edge of the canvas
function touchMove(e){
		finger_x = e.touches[0].pageX;
		finger_y = e.touches[0].pageY;
		if ( e.touches[0].pageX / canvas.width >.98)
			touchEnd(e);
	
}

function touchEnd(e){
        if(start === null){return}
    
        //  If the mole disappears while user is still holding, reset the touch events
        if(moleArr[start.attachedTo].mole === null){
          start = null;
          return;
        }
    // Record user's selection
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
                   results_arr2.push({"id":moleArr[start.attachedTo].mole.password_id,"selected":colorSelect,"password":moleArr[start.attachedTo].mole.password,"reason":moleArr[start.attachedTo].mole.reason,"game_id":game_id,"score":score})
					hit_sound_list[hit_sound_index%5].play();
				hit_sound_index++;
					moleArr[start.attachedTo].mole.img = hitImage;
                    moleArr[start.attachedTo].mole.password = '';
                    moleArr[start.attachedTo].mole.delay = hitMissDelay;
				}else{
					// Record incorrect selections for final screen
                    results_arr.push({"id":moleArr[start.attachedTo].mole.password_id,"selected":colorSelect,"password":moleArr[start.attachedTo].mole.password,"reason":moleArr[start.attachedTo].mole.reason,"game_id":game_id,"score":score})
                    results_arr2.push({"id":moleArr[start.attachedTo].mole.password_id,"selected":colorSelect,"password":moleArr[start.attachedTo].mole.password,"reason":moleArr[start.attachedTo].mole.reason,"game_id":game_id,"score":score})
                    // Lose time for incorrect moles
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

// Main game loop
function main (){
	if(!stopGame)
		requestAnimationFrame(main)
    update()
	lastTime = Date.now()
	render()
	
}

function update(){
    timer = timer - (Date.now() - lastTime)
    timePercentage = timer/startTimer
    if(timer <= 0){
        
        stopGame = true;
        if (results_arr.length > 0){
            resultsPopup(0)
        } else {
            
            endingPopup();
            
        }
        
    }
    editObjects(Date.now() - lastTime)
}

function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24pt Ariel"
    ctx.textAlign="center";
    
    // Draw background first
    ctx.drawImage(bgImage,0,0,window.innerWidth,window.innerHeight)
    
    // Draw score
    ctx.strokeText(score,canvas.width*.09,canvas.height*.055);
    ctx.fillText(score,canvas.width*.09,canvas.height*.055);
    
    // Draw time bar
    ctx.drawImage(timeImage, canvas.width *.25, canvas.height*.01, (canvas.width - canvas.width *.3) * timePercentage, canvas.height*.05)
    ctx.drawImage(timeBarImage, canvas.width*.25, canvas.height*.01, canvas.width - canvas.width *.3, canvas.height*.05)
    
    
    ctx.font = "5vw sans-serif";
    
    // Only register a selection if user move's finger a certain distance
    // Then, draw the appropriate mole selection image
    if (start && moleArr[start.attachedTo].mole) {
        var xDistance = finger_x - start.x
        if(xDistance > 15){
            moleArr[start.attachedTo].mole.img = moleHitImage;
        }else if (xDistance < -15){
            moleArr[start.attachedTo].mole.img = moleMissImage;
        }
    }
    
    // Draw moles
    for(i=0; i < 6; i++){
        ctx.drawImage(moleArr[i].img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
        if (moleArr[i].mole){
            ctx.drawImage(moleArr[i].mole.img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
            ctx.strokeText(moleArr[i].mole.password.substr(0,12),moleArr[i].x + moleArr[i].width/2,moleArr[i].y + moleArr[i].height/2.5)
            ctx.fillText(moleArr[i].mole.password.substr(0,12),moleArr[i].x + moleArr[i].width/2,moleArr[i].y + moleArr[i].height/2.5)
            
        }
    }
    
}
var millisecondsPerMole = 4500;
function editObjects(dt){
	for (i=0;i<6;i++){
        // Randomly generates new moles in holes which have none
		if (Math.random() < (1/millisecondsPerMole)*dt && moleArr[i].mole == null){
			var random = getRandomInt(0,jsonObject.length -1)
			moleArr[i].mole = new mole(jsonObject[random].password,jsonObject[random].password_type,jsonObject[random].id,jsonObject[random].wrong_message)
		}
        
        // Update the timer until moles disappear
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


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

        
function fail(err){
	alert(err)
}


app.initialize();
