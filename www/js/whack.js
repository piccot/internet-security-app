var app = {

  
    initialize: function() {
        this.bindEvents();
			
		//loadJSONData()
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
                     addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

		addEventListener("touchstart",touchStart);
		addEventListener("touchend",touchEnd);
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
        moleImage.src = 'assets/img/mole.png';
        this.img = moleImage;
	this.password = password;
	this.targetType = type;
	this.delay = baseDelay;

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

var wheel = null;
function colorWheel(x,y,mole){
        this.width = window.innerWidth/2;
        this.height = window.innerHeight/4;
	this.x=x - this.width/2;
	this.y=y - this.height/2;
        var wheelImage = new Image();
        wheelImage.src = 'assets/img/wheel.png'
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
	if(timer <= 0 || lives <=0){
		window.location.href = 'whack_final.html?score=' + score
		timer = 120000;
		lives = 3;
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
				}
			}
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
            if(e.changedTouches[i].pageX >= wheel.x && e.changedTouches[i].pageX < wheel.x + wheel.width/3 && e.changedTouches[i].pageY >= wheel.y + wheel.height/3 && e.changedTouches[i].pageY <= wheel.y + wheel.height){
              colorSelect = 3; // red
              console.log("red")
            }
            if(e.changedTouches[i].pageX >= wheel.x + wheel.width/3 && e.changedTouches[i].pageX < wheel.x + wheel.width - wheel.width/3  && e.changedTouches[i].pageY >= wheel.y && e.changedTouches[i].pageY <= wheel.y + wheel.height/3){
              colorSelect = 2; //  yellow
              console.log("yellow")
            }
            if(e.changedTouches[i].pageX >= wheel.x + wheel.width - wheel.width/3 && e.changedTouches[i].pageX < wheel.x + wheel.width&& e.changedTouches[i].pageY >= wheel.y + wheel.height/3 && e.changedTouches[i].pageY <= wheel.y + wheel.height){
              colorSelect = 1; // green
              console.log("green")
            }
		        if(moleArr[wheel.attachedTo].mole.targetType == colorSelect){
				score = score + Math.floor(moleArr[wheel.attachedTo].mole.delay/10)
                                hitSound.play()
                                moleArr[wheel.attachedTo].mole = new hit();
                        }else{
			        lives--;
                                missSound.play()
                                moleArr[wheel.attachedTo].mole = new miss();
                        }
        }
       wheel = null; 
}
function render(){	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "11pt Ariel";
        ctx.textAlign="center";
        ctx.drawImage(bgImage,0,0,window.innerWidth,window.innerHeight)
        ctx.strokeText("Score: " + score,40,40);
        ctx.fillText("Score: " + score,40,40);
	for(i=0; i < 6; i++){
                ctx.drawImage(moleArr[i].img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
                if (moleArr[i].mole){
                    ctx.drawImage(moleArr[i].mole.img,moleArr[i].x,moleArr[i].y,moleArr[i].width, moleArr[i].height)
                    ctx.strokeText(moleArr[i].mole.password,moleArr[i].x + moleArr[i].width/2,moleArr[i].y + moleArr[i].height/3)
                    ctx.fillText(moleArr[i].mole.password,moleArr[i].x + moleArr[i].width/2,moleArr[i].y + moleArr[i].height/3)
                    if (wheel) {
                            ctx.drawImage(wheel.img,wheel.x,wheel.y,wheel.width,wheel.height);
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
			moleArr[i].mole = new mole(jsonObject[random].Password,jsonObject[random].Type)
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
