var app = {

  
    initialize: function() {
        this.bindEvents();
			
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
                //addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

		document.addEventListener("touchstart",touchStart);
                jsonObject = JSON.parse('[{"Mail":"OBVIOUS BAD EMAIL - Virus","Type": 1,"Sub": 2},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1}]');
//                jsonObject = JSON.parse('[{"Mail":"OBVIOUS GOOD EMAIL - Teach","Type": 0,"Sub": 0},{"Mail":"OBVIOUS GOOD EMAIL - Job","Type": 0,"Sub": 1},{"Mail":"OBVIOUS GOOD EMAIL - Family","Type": 0,"Sub": 2},{"Mail":"OBVIOUS GOOD EMAIL - Account","Type": 0,"Sub": 3},{"Mail":"OBVIOUS BAD EMAIL - Phishing","Type": 1,"Sub": 0},{"Mail":"OBVIOUS BAD EMAIL - Fake Account","Type": 1,"Sub": 1},{"Mail":"OBVIOUS BAD EMAIL - Virus","Type": 1,"Sub": 2},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1},{"Mail":"OBVIOUS SPAM EMAIL","Type":2,"Sub":-1}]');
       // jsonObject = JSON.parse('[{"Mail":"Good email example","Type": 0}]');

		lastTime = Date.now()
		main();	
    },

};
var baseDelay = 5000
var time = 0;
var bgImage = new Image();
bgImage.src = 'assets/img/emailBG.png';
var baseSpeed = 3000;
var delta = window.innerHeight / baseSpeed;
var mailOpen = false;
var score = 0;
var spamBase = 0;
var spamFilter = 0;
var mailImage = new Image();
mailImage.src = 'assets/img/mail.png';
var explosionImage = new Image();
explosionImage.src = 'assets/img/explosion.png';
var acceptPhishImage = new Image();
acceptPhishImage.src = 'assets/img/accept_phish.png';
var acceptAccountImage = new Image();
acceptAccountImage.src = 'assets/img/accept_account.png';
var acceptVirusImage = new Image();
acceptVirusImage.src = 'assets/img/accept_virus.png';
var rejectTeachImage = new Image();
rejectTeachImage.src = 'assets/img/reject_teach.png';
var rejectJobImage = new Image();
rejectJobImage.src = 'assets/img/reject_job.png';
var rejectFamilyImage = new Image();
rejectFamilyImage.src = 'assets/img/reject_family.png';
var rejectAccountImage = new Image();
rejectAccountImage.src = 'assets/img/reject_account.png';
var spamUpImage = new Image();
spamUpImage.src = 'assets/img/spam_up.png';


var spriteArr = [];

function sprite(options){
    
    var self = this;
    
    this.context = options.context;
    this.imgWidth = options.image.width;
    this.imgHeight = options.image.height;
    this.img = options.image;
    this.frameIndex = 0,
    this.tickCount = 0,
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.numberOfFrames = options.numberOfFrames || 1;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width;
    this.height = options.height;

    
    this.render = function () {

        // Draw the animation
        self.context.drawImage(
            self.img,
            self.frameIndex * self.imgWidth / self.numberOfFrames,
            0,
            self.imgWidth / self.numberOfFrames,
            self.imgHeight,
            self.x,
            self.y,
            self.width,
            self.height);
    };
    
    this.update = function () {
        self.tickCount += 1;
        
        if (self.tickCount > self.ticksPerFrame) {
            
            self.tickCount = 0;
            // If the current frame index is in range
            if (self.frameIndex < self.numberOfFrames - 1) {
                // Go to the next frame
                self.frameIndex += 1;
            }else{
                spriteArr.splice(spriteArr.indexOf(self),1)
            }
        }
    };
}


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
    this.spamCheck = false;
}

function changeSpam(diff){
    if (spamBase + diff <= 0){
        spamBase = 0;
    }else{
        spamBase = spamBase + diff;
    }
    spamFilter = parseFloat((0.8*(spamBase/(spamBase+3))).toFixed(2))
    
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

    for(i=0;i<mailArr.length;i++){
        if(mailArr[i].length > 7){
            window.location.href = 'mail_final.html'
        }
    }
	editObjects(Date.now() - lastTime)
    for(var i = 0;i < spriteArr.length;i++){
        spriteArr[i].update();
    }
}
var hitSound = new Audio("assets/audio/hit.wav")
var missSound = new Audio("assets/audio/miss.wav")

function closeMail(choice){
    switch (choice){
        case 0: //accept
            if (openMail.type == 0){ //good mail
                score = score + 100;
                openMail.img = explosionImage;
            }
            if (openMail.type == 1){ //bad mail
                if (openMail.sub == 0){ //phish mail
                    score = score - 25;
                    changeSpam(-2);
                    openMail.img = acceptPhishImage;
                }
                if (openMail.sub == 1){ //Fake Account
                    score = score - 25;
                    openMail.img = acceptAccountImage;
                }
                if (openMail.sub == 2){ //Virus
                    var virusSprite = new sprite({
                                                 context: canvas.getContext("2d"),
                                                 image: acceptVirusImage,
                                                 ticksPerFrame: 10,
                                                 numberOfFrames: 10,
                                                 width: canvas.width,
                                                 height: canvas.width});
                    spriteArr.push(virusSprite);
                    millisecondsPerMail = 1;
                    spamFilter = 0;
                    openMail.img = explosionImage;
                }
            }
            if (openMail.type == 2){ //spam mail
                changeSpam(-2);
                openMail.img = explosionImage;
            }
            break;
        case 1:  //reject
            if (openMail.type == 0){ //good mail
                score = score - 25;
                if (openMail.sub == 0){ //teacher
                    openMail.img = rejectTeachImage;
                }
                if (openMail.sub == 1){ //job
                    openMail.img = rejectJobImage;
                }
                if (openMail.sub == 2){ //family
                    openMail.img = rejectFamilyImage;
                }
                if (openMail.sub == 3){ //account
                    openMail.img = rejectAccountImage;
                }
                
            }
            if (openMail.type == 1){ //bad mail
                score = score + 100;
                openMail.img = explosionImage;
            }
            if (openMail.type == 2){ //spam mail
                openMail.img = explosionImage;
            }
            break;
        case 2: //spam
            if (openMail.type == 0){ //good mail
                score = score - 25;
                changeSpam(-1);
                if (openMail.sub == 0){ //teacher
                    openMail.img = rejectTeachImage;
                }
                if (openMail.sub == 1){ //job
                    openMail.img = rejectJobImage;
                }
                if (openMail.sub == 2){ //family
                    openMail.img = rejectFamilyImage;
                }
                if (openMail.sub == 3){ //account
                    openMail.img = rejectAccountImage;
                }
            }
            if (openMail.type == 1){ //bad mail
                openMail.img = explosionImage;
            }
            if (openMail.type == 2){ //spam mail
                score = score + 100;
                changeSpam(1);
                var spamUpSprite = new sprite({
                                            context: canvas.getContext("2d"),
                                            image: spamUpImage,
                                            ticksPerFrame: 3,
                                            numberOfFrames: 12,
                                            x: canvas.width*3/5,
                                            y: document.getElementsByClassName("reject")[0].offsetTop,
                                            width: canvas.width/4,
                                            height: canvas.width/4});
                spriteArr.push(spamUpSprite);
                hitSound.play()
                openMail.img = explosionImage;
            }
            
            break;
    }
    openMail.delay = 400;
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
				        if(e.touches[i].pageX >= mailArr[j][k].x && e.touches[i].pageX <= mailArr[j][k].x + mailArr[j][k].width && e.touches[i].pageY >= mailArr[j][k].y && e.touches[i].pageY <= mailArr[j][k].y + mailArr[j][k].height && mailArr[j][k].img == mailImage){
                            
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
                                                reject.className = "reject"
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
function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage,0,0,window.innerWidth,window.innerHeight)

	for(i=0; i < mailArr.length; i++){
                for(j=0; j<mailArr[i].length;j++){
                        ctx.drawImage(mailArr[i][j].img,mailArr[i][j].x,mailArr[i][j].y,mailArr[i][j].width, mailArr[i][j].height)
                }
        }
    ctx.font = "24pt Ariel"
    ctx.textAlign="left";
    ctx.strokeText("Score: " + score,10,45);
    ctx.fillText("Score: " + score,10,45);
    //ctx.strokeText("Spam Filter: " + spamFilter,40,90);
    //ctx.fillText("Spam Filter: " + spamFilter,40,90);
    
    for(var i = 0;i < spriteArr.length;i++){
        spriteArr[i].render();
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
            if (mailArr[i][j].spamCheck == false){
                var check = getRandomInt(1,100)
                if (check/100 <= spamFilter){
                    mailArr[i][j].img = explosionImage;
                    mailArr[i][j].delay = 400;
                }
                mailArr[i][j].spamCheck = true;
            }
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


app.onDeviceReady();
