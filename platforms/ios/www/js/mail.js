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
		lastTime = Date.now()
		main();	
    },

};
var baseDelay = 5000
var hitMissDelay = 2000
var time = 0;
var bgImage = new Image();
bgImage.src = 'assets/img/sky.jpg';
var speed = 5;

function mail(pos){
	this.x = pos * window.innerWidth/3;
	this.y = 0;
        this.width = window.innerWidth/3;
        this.height = window.innerHeight/8;
	var mailImage = new Image();
	mailImage.src = 'assets/img/mail.png';
	this.img = mailImage;
}


var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas)

var mailArr = []

for(i=0;i<3;i++){
        mailArr[i] = [];
}
console.log(mailArr)
var lastTime;
function update(){
  console.log(mailArr)
	time = time + (Date.now() - lastTime)
          /*
	if(time >= 30){
                window.location.href = 'mail_final.html'
		time = 0;
	}*/
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
            }else if(e.changedTouches[i].pageX >= wheel.x + wheel.width/3 && e.changedTouches[i].pageX < wheel.x + wheel.width - wheel.width/3  && e.changedTouches[i].pageY >= wheel.y && e.changedTouches[i].pageY <= wheel.y + wheel.height/3){
              colorSelect = 2; //  yellow
              console.log("yellow")
            }else if(e.changedTouches[i].pageX >= wheel.x + wheel.width - wheel.width/3 && e.changedTouches[i].pageX < wheel.x + wheel.width&& e.changedTouches[i].pageY >= wheel.y + wheel.height/3 && e.changedTouches[i].pageY <= wheel.y + wheel.height){
              colorSelect = 1; // green
              console.log("green")
            }else{
              wheel = null;
              return
            }
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
        ctx.drawImage(bgImage,0,0,window.innerWidth,window.innerHeight)

	for(i=0; i < mailArr.length; i++){
                for(j=0; j<mailArr[i].length;j++){
                        ctx.drawImage(mailArr[i][j].img,mailArr[i][j].x,mailArr[i][j].y,mailArr[i][j].width, mailArr[i][j].height)
                }
        }
	
	
}

function main (){
        update()
	lastTime = Date.now()
	render()
	requestAnimationFrame(main)
}
if (!Array.prototype.last){
      Array.prototype.last = function(){
                return this[this.length - 1];
                    };
};

var millisecondsPerMail = 4500;
function editObjects(dt){
	for (i=0;i<3;i++){
		if (Math.random() < (1/millisecondsPerMail)*dt && (!mailArr[i].last() || mailArr[i].last().y >= window.innerHeight/8)){
			mailArr[i].push(new mail(i)) 
		}
                /////////////////////////////////////////
                for (j=0;j<mailArr[i].length;j++){
                        if(mailArr[i][j].y < window.innerHeight - (j+1)*window.innerHeight/8){
                                mailArr[i][j].y = mailArr[i][j].y + speed;
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
