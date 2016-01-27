var app = {

  
    initialize: function() {
        this.bindEvents();
			
		//loadJSONData()
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
		addEventListener("touchstart",clickHandler);
        jsonObject = JSON.parse('[{"Password":"password123","Type": 3},{"Password":"I<3Horses","Type": 3},{"Password":"JknsD3@anmAiLfknsma!","Type": 3},{ "Password":"HappyDays","Type": 3},{"Password":"TheBestPassword","Type": 3},{"Password":"TheBestPassword","Type": 3},{"Password":"TheWorstPassword","Type": 3},{"Password":"2@Atak","Type": 2},{"Password":"24pples2D4y","Type": 2},{"Password":"IWasBornIn1919191995","Type": 2},{"Password":"IWasBornIn1919191995","Type": 2},{"Password":"2BorNot2B_ThatIsThe?","Type": 1},{"Password":"4Score&7yrsAgo","Type": 1}]');
		lastTime = Date.now()
		main();	
    },

};
var baseDelay = 5000
var hitMissDelay = 2000
var score = 0;
var lives =3;
var timer = 120000
var bgImage = new Image();
bgImage.src = 'assets/img/grass.jpg';
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

function mole(password,type){
        var moleImage = new Image();
        moleImage.src = 'assets/img/mole_red.png';
        this.img = moleImage;
	this.password = password;
	this.targetType = type;
	this.delay = baseDelay;
	this.currentType = 3

}

function hit(){
        var hitImage = new Image();
        hitImage.src = 'assets/img/hit.png';
        this.img = hitImage; 
        this.password = '';
        this.delay = hitMissDelay;
        this.currentType = -1;
}
function miss(){
        var missImage = new Image();
        missImage.src = 'assets/img/miss.png';
        this.img = missImage; 
        this.password = '';
        this.delay = hitMissDelay;
        this.currentType = -1;
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
	if(timer <= 0 || lives <=0){
		alert('Final Score: ' + score)
		timer = 120000;
		lives = 3;
		score = 0;
		for(j=0;j<6;j++)
			moleArr[j].mole = null
	}
	editObjects(Date.now() - lastTime)
}
var xOffset = 0;
function calculateXOffset(string){
        return string.length * 4;
}
var hitSound = new Audio("assets/audio/hit.wav")
var missSound = new Audio("assets/audio/miss.wav")
function clickHandler(e){
	
	
	
		for(i=0;i<e.touches.length;i++){
			for(j=0;j<6;j++){
				if(e.touches[i].pageX >= moleArr[j].x && e.touches[i].pageX <= moleArr[j].x +moleArr[j].width && e.touches[i].pageY >= moleArr[j].y && e.touches[i].pageY <= moleArr[j].y + moleArr[j].height){
					if(moleArr[j].mole.targetType == moleArr[j].mole.currentType){
						score = score + Math.floor(moleArr[j].mole.delay/10)
						hitSound.play()
						moleArr[j].mole = new hit();
					}else{
						timer = timer - (15000) * Math.abs(moleArr[j].mole.targetType - moleArr[j].mole.currentType)
						missSound.play()
						moleArr[j].mole = new miss();
					}
					//moleArr[j].mole = null
				}
			}
		}
	

}
function render(){	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "16px Helvetica";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.drawImage(bgImage,0,0,window.innerWidth,window.innerHeight)
        ctx.strokeText("Score: " + score,10,40);
        ctx.fillText("Score: " + score,10,40);
	for(i=0; i < 6; i++){
                ctx.drawImage(moleArr[i].img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
                if (moleArr[i].mole){
                    xOffset = calculateXOffset(moleArr[i].mole.password)
                    ctx.drawImage(moleArr[i].mole.img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
                    ctx.strokeText(moleArr[i].mole.password,moleArr[i].x + moleArr[i].width/2 - xOffset,moleArr[i].y + moleArr[i].height/3)
                    ctx.fillText(moleArr[i].mole.password,moleArr[i].x + moleArr[i].width/2 - xOffset,moleArr[i].y + moleArr[i].height/3)
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
			moleArr[i].mole = new mole(jsonObject[random].Password,jsonObject[random].Type)
		}
		if(moleArr[i].mole != null){
			moleArr[i].mole.delay = moleArr[i].mole.delay - dt
			
			if(moleArr[i].mole.delay <= 0){
			if(moleArr[i].mole.currentType == 3){
				var moleImage = new Image();
				moleImage.src = 'assets/img/mole_yellow.png';
				moleArr[i].mole.img  = moleImage;
				moleArr[i].mole.currentType = 2;
				moleArr[i].mole.delay = baseDelay;
			} else if (moleArr[i].mole.currentType == 2){
				var moleImage = new Image();
				moleImage.src = 'assets/img/mole_green.png';
				moleArr[i].mole.img  = moleImage;
				moleArr[i].mole.currentType = 1;
				moleArr[i].mole.delay = baseDelay;
			} else {
				moleArr[i].mole = null;
			
			}
		}
		}
				
			
	}

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadJSONData(){
var xmlhttp;
var jsonObject;

// code for IE7+, Firefox, Chrome, Opera, Safari
if (window.XMLHttpRequest)
{
    xmlhttp=new XMLHttpRequest();
}
// code for IE6, IE5
else
{
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}

xmlhttp.onreadystatechange=function()
{
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        jsonObject = JSON.parse(xmlhttp.responseText);
        alert(jsonObject[0].Password);                     
    }
}

xmlhttp.open("GET","gamedata/whack.json",true);
xmlhttp.send();

}

app.onDeviceReady();
