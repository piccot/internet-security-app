window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
var canvas;
var ctx;
var bucket;
var app = {

  
    initialize: function() {
        this.bindEvents();
			
		//loadJSONData()
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {	
		canvas = document.createElement("canvas");
		ctx = canvas.getContext("2d");
		window.screen.lockOrientation('landscape')
		canvas.height = window.innerWidth;
		canvas.width = window.innerHeight;
		document.body.appendChild(canvas)
        addEventListener('touchmove', touchMove);
		addEventListener("touchstart",touchStart);
		addEventListener("touchend",touchEnd);
        jsonObject = JSON.parse('[{"Password":"password123","Type": 3},{"Password":"I<3Horses","Type": 3},{"Password":"JknsD3@anmAiLfknsma!","Type": 3},{ "Password":"HappyDays","Type": 3},{"Password":"TheBestPassword","Type": 3},{"Password":"TheBestPassword","Type": 3},{"Password":"TheWorstPassword","Type": 3},{"Password":"2@Atak","Type": 2},{"Password":"24pples2D4y","Type": 2},{"Password":"IWasBornIn1919191995","Type": 2},{"Password":"IWasBornIn1919191995","Type": 2},{"Password":"2BorNot2B_ThatIsThe?","Type": 1},{"Password":"4Score&7yrsAgo","Type": 1}]');
		lastTime = Date.now()
		main();
		bucket = new bucket();
    },

};
app.initialize();
var virus_red_image = new Image();
virus_red_image.src = 'assets/img/virus_red.png';
var virus_green_image = new Image();
virus_green_image.src = 'assets/img/virus_green.png';
var data_bucket_image = new Image();
data_bucket_image.src = 'assets/img/data_bucket.png';
var hitSound = new Audio("assets/audio/hit.wav")
var missSound = new Audio("assets/audio/miss.wav")
var virus_arr = [];
function virus(x,y,dx,dy,id,type){
	this.x = x;
	this.y=y;
	this.id = id;
	this.type = type
    this.width = window.innerWidth/20;
    this.height = this.width;
	if (type == 1 )
		this.img = virus_green_image
	else 
		this.img = virus_red_image
	this.dx = dx
	this.dy = dy
}
function bucket(){
	this.x = canvas.width - canvas.height * .2;
	this.y = 0;
	this.size = canvas.height * .2;

}
var lastTime = Date.now();
function main (){
	if (score == 5){
		alert('win');
		score = 0;
	}
    update()
	lastTime = Date.now()
	render()
	requestAnimationFrame(main)
}

function update(){
	editObjects(Date.now() - lastTime);
}

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < virus_arr.length; i++){
		var current = virus_arr[i];
		ctx.drawImage(current.img,current.x,current.y,current.width,current.height)
    
	}
	 if (held)
		ctx.drawImage(held.img,held.x,held.y,held.width,held.height)
	ctx.drawImage(data_bucket_image,bucket.x,bucket.y,bucket.size,bucket.size)
}
var currentID = 0;
var millisecondsPerVirus = 1000;
var baseSpeed = 4000;
function editObjects(dt){
	for(var i = 0; i < virus_arr.length; i++){
		var current = virus_arr[i];
		current.x = current.x + current.dx * dt;
		current.y = current.y + current.dy * dt;
		if (current.x > window.innerWidth || current.x < 0 || current.y > window.innerHeight || current.y < 0){
			virus_arr.splice(i,1);
			hitSound.play()
		}
		
	}
	if (Math.random() < (1/millisecondsPerVirus)*dt){
		var rnd = getRandomInt(0,3);
		
		var xcoord ;
		var ycoord ;
		var deltaX;
		var deltaY
		if (rnd == 0){
			xcoord = 0;
			deltaX = (window.innerWidth/baseSpeed)/1.5 + (window.innerWidth/baseSpeed) * Math.random();
			ycoord = Math.random() * window.innerHeight;
			if (ycoord > window.innerHeight/2)
				deltaY = -window.innerHeight/baseSpeed;
			else
				deltaY = window.innerWidth/baseSpeed
		} else if (rnd == 1){
			ycoord = 0;
			deltaY =(window.innerHeight/baseSpeed)/1.5 + (window.innerHeight/baseSpeed) * Math.random();
			xcoord = Math.random() * window.innerWidth;
			if (xcoord > window.innerWidth/2)
				deltaX = -window.innerWidth/baseSpeed;
			else
				deltaX = window.innerWidth/baseSpeed;
			
		} else if (rnd == 2){
			xcoord = window.innerWidth;
			deltaX = (-window.innerWidth/baseSpeed)/1.5 + (-window.innerWidth/baseSpeed) * Math.random();
			ycoord = Math.random() * window.innerHeight;
			if (ycoord > window.innerHeight/2)
				deltaY = -window.innerHeight/baseSpeed;
			else
				deltaY = window.innerWidth/baseSpeed
		
		} else if (rnd == 3) {
			ycoord = window.innerHeight;
			deltaY = (-window.innerHeight/baseSpeed)/1.5 + (-window.innerHeight/baseSpeed) * Math.random();
			xcoord = Math.random() * window.innerWidth;
			if (xcoord > window.innerWidth/2)
				deltaX = -window.innerWidth/baseSpeed;
			else
				deltaX = window.innerWidth/baseSpeed;
		
		}
		var rnd2 = getRandomInt(0,10)
		var virus_type = 1
		if(rnd2 == 10)
			virus_type = 2
		
		console.log(xcoord + ' ' + ycoord + ' ' + deltaX + ' ' + deltaY)
		virus_arr.push(new virus(xcoord,ycoord,deltaX,deltaY,currentID,virus_type))
		currentID++;
	
	}
	
}
var held;
var score = 0;
function touchStart(e){
	for(i=0;i<e.touches.length;i++){
			for(j=0;j<virus_arr.length;j++){
				if(e.touches[i].pageX >= virus_arr[j].x && e.touches[i].pageX <= virus_arr[j].x +virus_arr[j].width && e.touches[i].pageY >= virus_arr[j].y && e.touches[i].pageY <= virus_arr[j].y + virus_arr[j].height){
					if (virus_arr[j].type == 1)
						held = virus_arr[j];
					virus_arr.splice(j,1);
					return true;
				}
			}
		}
}
function touchEnd(e){
	if(held){
		
		if (held.x + held.width/2 >= bucket.x && held.x + held.width/2 <= bucket.x + bucket.size && held.y >= bucket.y && held.y <= bucket.y + bucket.size){
			score ++;
		
		}
		else
			virus_arr.push(held);
		held = null;
	}
}
function touchMove(e){
	if (held){
		held.x = e.touches[0].pageX - held.width/2;
		held.y = e.touches[0].pageY - held.height/2;
	}
}
function virusIndex(id){
	for(var i = 0; i < virus_arr.length; i++){
		if (virus_arr[i].id == id)
			return i;
	}
	return -1;

}
	
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
