var app = {

  
    initialize: function() {
        this.bindEvents();
			
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
                //addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

		addEventListener("touchstart",touchStart);
		addEventListener("touchend",touchEnd);
                jsonObject = JSON.parse('[{"Mail":"OBVIOUS GOOD EMAIL - Teach","Type": 0,"Sub": 0},{"Mail":"OBVIOUS GOOD EMAIL - Job","Type": 0,"Sub": 1},{"Mail":"OBVIOUS GOOD EMAIL - Family","Type": 0,"Sub": 2},{"Mail":"OBVIOUS GOOD EMAIL - Account","Type": 0,"Sub": 3},{"Mail":"OBVIOUS BAD EMAIL - Phishing","Type": 1,"Sub": 0},{"Mail":"OBVIOUS BAD EMAIL - Fake Account","Type": 1,"Sub": 1},{"Mail":"OBVIOUS BAD EMAIL - Virus","Type": 1,"Sub": 2},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1}]');
       // jsonObject = JSON.parse('[{"Mail":"Good email example","Type": 0}]');

		lastTime = Date.now()
		main();	
    },

};
var baseDelay = 5000
var hitMissDelay = 2000
var time = 0;
var bgImage = new Image();
bgImage.src = 'assets/img/sky.jpg';
var baseSpeed = 3000;
var delta = window.innerHeight / baseSpeed;
var mailOpen = false;
var score = 0;
var spam = 0;
var mailImage = new Image();
mailImage.src = 'assets/img/mail.png';
var explosionImage = new Image();
explosionImage.src = 'assets/img/explosion.png';
var phishImage = new Image();
phishImage.src = 'assets/img/virus_red.png';

function mail(pos, text, type, sub){
	this.x = pos * window.innerWidth/3;
	this.y = 0;
    this.width = window.innerWidth/3;
    this.height = window.innerHeight/8;
	this.img = mailImage;
    this.text = text;
    this.type = type;
    this.sub = sub;
    this.delay = null;
}


var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.position = "absolute";
document.body.appendChild(canvas)

var mailArr = []

for(i=0;i<3;i++){
        mailArr[i] = [];
}
var lastTime;
function update(){
	time = time + (Date.now() - lastTime)
    
//	if(time >= 15000){
//                window.location.href = 'mail_final.html'
//		time = 0;
//	}
    for(i=0;i<mailArr.length;i++){
        if(mailArr[i].length > 7){
            window.location.href = 'mail_final.html'
        }
    }
	editObjects(Date.now() - lastTime)
}
var hitSound = new Audio("assets/audio/hit.wav")
var missSound = new Audio("assets/audio/miss.wav")

function closeMail(choice){
    switch (choice){
        case 0: //accept
            if (openMail.type == 0){ //good mail
                openMail.img = explosionImage;
                openMail.delay = 300;
            }
            if (openMail.type == 1){ //bad mail
                if (openMail.sub == 0){ //phish mail
                    score--;
                    spam--;
                    openMail.img = phishImage;
                    openMail.delay = 300;
                }else{
                openMail.img = explosionImage;
                openMail.delay = 300;
                }
            }
            break;
        case 1:  //reject
            if (openMail.type == 1){ //bad mail
                openMail.img = explosionImage;
                openMail.delay = 300;
            }
            break;
        case 2: //spam
            if (openMail.type == 2){ //spam mail
                openMail.img = explosionImage;
                openMail.delay = 300;
            }
            break;
    }
    //destroy mail
    var popup = document.getElementsByClassName("popup")[0];
    popup.parentNode.removeChild(popup);
    mailOpen = false;
}
var openMail = null;
var trackingClick = false;
var targetElement = null;
var touchStartX = 0;
var touchStartY = 0;
function touchStart(e){

        if (mailOpen == false){
		for(i=0;i<e.touches.length;i++){
			for(j=0;j<mailArr.length;j++){
                    for(k=0;k<mailArr[j].length;k++){
				        if(e.touches[i].pageX >= mailArr[j][k].x && e.touches[i].pageX <= mailArr[j][k].x + mailArr[j][k].width && e.touches[i].pageY >= mailArr[j][k].y && e.touches[i].pageY <= mailArr[j][k].y + mailArr[j][k].height){
                            
                            openMail = mailArr[j][k]

                            
                            var popup = document.createElement("div");
                            popup.className = "popup";
                            
                            var scrollingBody = document.createElement("div");
                            scrollingBody.className = "scrollingBody";
                            
                            var to = document.createElement("div");
                            to.className = "to";
                            to.innerHTML = "<b>To:&nbsp;</b>you@email.com";
                            
                            var from = document.createElement("div");
                            from.className = "from";
                            from.innerHTML = "<b>From:&nbsp;</b>me@email.com";
                            
                            var subject = document.createElement("div");
                            subject.className = "subject";
                            subject.innerHTML = "<b>Subject:&nbsp;</b>I love you";
                            
                            var body = document.createElement("div");
                            body.className = "mailBody";
                            body.innerHTML = mailArr[j][k].text;
                            
                            popup.appendChild(scrollingBody);
                            scrollingBody.appendChild(to);
                            scrollingBody.appendChild(from);
                            scrollingBody.appendChild(subject);
                            scrollingBody.appendChild(body);
                      
                            var buttonRow = document.createElement("div");
                            buttonRow.className = "buttonRow";
                            
                            var button1 = document.createElement("div");

                            var button2 = document.createElement("div");

                            var button3 = document.createElement("div");
                            
                            popup.appendChild(buttonRow);
                            buttonRow.appendChild(button1);
                            buttonRow.appendChild(button2);
                            buttonRow.appendChild(button3);

                                                var accept = document.createElement("img");
                                                accept.src = "assets/img/accept_button.png";
                            
                            
                                                accept.addEventListener('touchstart', function(event){
                                                                        event.preventDefault();
                                                                        event.stopPropagation();

                                                                        trackingClick = true;
                                                                        targetElement = event.target;
                                                                        touchStartX = event.targetTouches[0].pageX;
                                                                        touchStartY = event.targetTouches[0].pageY;
                                                                        closeMail(0);
                                                                        return true;

                                                                        });
                                                button1.appendChild(accept)
                            
                                                var reject = document.createElement("img");
                                                reject.src = "assets/img/reject_button.png";
                                                reject.addEventListener('touchstart', function(event){
                                                                        event.preventDefault();
                                                                        event.stopPropagation();
                                                                        trackingClick = true;
                                                                        targetElement = event.target;
                                                                        touchStartX = event.targetTouches[0].pageX;
                                                                        touchStartY = event.targetTouches[0].pageY;
                                                                        closeMail(1);
                                                                        return true;

                                                    });
                                                button2.appendChild(reject)
                            
                                                var spam = document.createElement("img");
                                                spam.src = "assets/img/spam_button.png";
                                                spam.addEventListener('touchstart', function(event){
                                                                      event.preventDefault();
                                                                      event.stopPropagation();

                                                                      trackingClick = true;
                                                                      targetElement = event.target;
                                                                      touchStartX = event.targetTouches[0].pageX;
                                                                      touchStartY = event.targetTouches[0].pageY;
                                                                      closeMail(2);
                                                                      return true;

                                                    });
                                                button3.appendChild(spam)
                            
                                                document.body.appendChild(popup)
                                                mailOpen = true;

                        }
                    }
			}
		}
        }
}
function touchEnd(e){
  return
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
		if (Math.random() < (1/millisecondsPerMail)*dt && (mailArr[i].length == 0 || mailArr[i].last().y >= window.innerHeight/8)){
			var random = getRandomInt(0,jsonObject.length -1)
			mailArr[i].push(new mail(i, jsonObject[random].Mail,jsonObject[random].Type,jsonObject[random].Sub))
		}
        for (j=0;j<mailArr[i].length;j++){
            if (mailArr[i][j].delay != null){
                mailArr[i][j].delay = mailArr[i][j].delay - dt
                
                if(mailArr[i][j].delay <= 0){
                    mailArr[i][j].delay = null;
                    mailArr[i].splice(j,1)
                    return;
                }
            }
                if(mailArr[i][j].y <= window.innerHeight - (j+1)*window.innerHeight/8){
                        mailArr[i][j].y = Math.min(mailArr[i][j].y + delta*dt,window.innerHeight - (j+1)*window.innerHeight/8);
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
