var app = {

  
    initialize: function() {
        this.bindEvents();
			
		//loadJSONData()
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        
        dir.getFile("whack_results.json", {create:true}, function(file) {
            results_file = file;
			dir.getFile("whack_questions.json", {create:true}, function(file) {
				questions_file = file;
				results_file.file(function(file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					filedata=this.result;
					addEventListener('touchmove', touchMove);
					addEventListener("touchstart",touchStart);
					addEventListener("touchend",touchEnd);
					jsonObject = JSON.parse('[{"Password":"password123","Type": 3, "id": 1},{"Password":"I<3Horses","Type": 3, "id": 2},{"Password":"JknsD3@anmAiLfknsma!","Type": 3, "id": 3},{ "Password":"HappyDays","Type": 3, "id": 4},{"Password":"TheBestPassword","Type": 3, "id": 5},{"Password":"TheBestPassword","Type": 3, "id": 6},{"Password":"TheWorstPassword","Type": 3, "id": 7},{"Password":"2@Atak","Type": 2, "id": 8},{"Password":"24pples2D4y","Type": 2, "id": 9},{"Password":"IWasBornIn1919191995","Type": 2, "id": 10},{"Password":"IWasBornIn1919191995","Type": 2, "id": 11},{"Password":"2BorNot2B_ThatIsThe?","Type": 1, "id": 12},{"Password":"4Score&7yrsAgo","Type": 1, "id": 13}]');
					lastTime = Date.now()
					main();
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
var startTimer = 30000;
var timer = startTimer;
var bgImage = new Image();
bgImage.src = 'assets/img/grass.jpg';
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
var wheelImage = new Image();
wheelImage.src = 'assets/img/wheel.png'
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

function mole(password,type,password_id){
    this.img = moleImage;
	this.password = password;
	this.targetType = type;
	this.delay = baseDelay;
	this.password_id = password_id

}

function hit(){

        this.img = hitImage; 
        this.password = '';
        this.delay = hitMissDelay;
        this.currentType = -1;
}
function miss(){
       
        this.img = missImage; 
        this.password = '';
        this.delay = hitMissDelay;
        this.currentType = -1;
}

var wheel = null;
function colorWheel(x,y,mole){
        this.width = window.innerWidth/2;
        this.height = window.innerHeight/4;
	this.x=x - this.width/2;
	this.y=y - this.height/2;

        this.img = wheelImage;
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
		writeResultsToFile()
                
		timer = 30000;
		score = 0;
		for(j=0;j<6;j++)
			moleArr[j].mole = null
	}
	editObjects(Date.now() - lastTime)
}
var hitSound = new Audio("assets/audio/hit.wav")
var missSound = new Audio("assets/audio/miss.wav")

function touchStart(e){
	
	
	
		for(i=0;i<e.touches.length;i++){
			for(j=0;j<6;j++){
				if(e.touches[i].pageX >= moleArr[j].x && e.touches[i].pageX <= moleArr[j].x +moleArr[j].width && e.touches[i].pageY >= moleArr[j].y && e.touches[i].pageY <= moleArr[j].y + moleArr[j].height && moleArr[j].mole){
                                  wheel = new colorWheel(e.touches[i].pageX,e.touches[i].pageY, j);
								  finger_x = e.touches[i].pageX
								  finger_y = e.touches[i].pageY
				}
			}
		}
	

}
function touchMove(e){
	for(i=0;i<e.touches.length;i++){
		finger_x = e.touches[i].pageX;
		finger_y = e.touches[i].pageY;
	}
}
function touchEnd(e){
        console.log(e.changedTouches[0].pageX, e.changedTouches[0].pageY)
        if(wheel === null){return}
        if(moleArr[wheel.attachedTo].mole === null){
          wheel = null;
          return;
        }
        console.log(wheel.x)
        console.log(wheel.width)
        var colorSelect;
	for(i=0;i<e.changedTouches.length;i++){
			var xDistance = e.changedTouches[i].pageX - (wheel.x + wheel.width/2)
			var yDistance = e.changedTouches[i].pageY - (wheel.y + wheel.height/2)
            if(Math.abs(xDistance) < Math.abs(yDistance)){
              colorSelect = 2; // yellow
            }else if(xDistance > 0){
              colorSelect = 1; //  green
            }else {
              colorSelect = 3; // red
            }
			results_arr.push({"id":moleArr[wheel.attachedTo].mole.password_id,"selected":colorSelect})
			if(moleArr[wheel.attachedTo].mole.targetType == colorSelect){
				score = score + Math.floor(moleArr[wheel.attachedTo].mole.delay/1000 + 1)*5
				hitSound.play()
				moleArr[wheel.attachedTo].mole = new hit();
			}else{
					timer = timer - 2000
					missSound.play()
					moleArr[wheel.attachedTo].mole = new miss();
			}
			
        }
       wheel = null; 
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


        ctx.font = "11pt Ariel";
	for(i=0; i < 6; i++){
                ctx.drawImage(moleArr[i].img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
                if (moleArr[i].mole){
                    ctx.drawImage(moleArr[i].mole.img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
                    ctx.strokeText(moleArr[i].mole.password,moleArr[i].x + moleArr[i].width/2,moleArr[i].y + moleArr[i].height/3)
                    ctx.fillText(moleArr[i].mole.password,moleArr[i].x + moleArr[i].width/2,moleArr[i].y + moleArr[i].height/3)
                    if (wheel) {
                            //ctx.drawImage(wheel.img,wheel.x,wheel.y,wheel.width,wheel.height);
							ctx.beginPath();
							var xDistance = finger_x - (wheel.x + wheel.width/2)
							var yDistance = finger_y - (wheel.y + wheel.height/2)
							if(Math.abs(xDistance) < Math.abs(yDistance)){
							  ctx.strokeStyle = "#ffff00" // yellow
							}else if(xDistance > 0){
							  ctx.strokeStyle = "#00ff00" //  green
							}else {
							  ctx.strokeStyle = "#ff0000" // red
							}
							
							ctx.moveTo((wheel.x + wheel.width/2),(wheel.y + wheel.height/2));
							ctx.lineTo(finger_x,finger_y);
							ctx.lineWidth=10;
							ctx.stroke();
							ctx.strokeStyle = "#000000"
							ctx.lineWidth=1;
                    }
                }
	}
	
}

function main (){
    update()
	lastTime = Date.now()
	render()
	requestAnimationFrame(main)
}
var millisecondsPerMole = 4500;
function editObjects(dt){
	for (i=0;i<6;i++){
		if (Math.random() < (1/millisecondsPerMole)*dt && moleArr[i].mole == null){
			var random = getRandomInt(0,jsonObject.length -1)
			moleArr[i].mole = new mole(jsonObject[random].Password,jsonObject[random].Type,jsonObject[random].id)
		}
		if(moleArr[i].mole != null){
			moleArr[i].mole.delay = moleArr[i].mole.delay - dt
			
			if(moleArr[i].mole.delay <= 0){
				moleArr[i].mole = null;
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
				window.location.href = 'whack_final.html?score=' + score

			}, fail);
        };

        reader.readAsText(file);
    }, fail);

}
function fail(err){
	alert(err)
}


app.initialize();
