window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
var canvas;
var ctx;
var bucket;
var av_button;
var av_counter = 0;
var base_penalty = 5000;
var av_speed_mod = .1;
var av_size_mod = -.1;
var win_score = 64;
var timeRemaining = 30000;
var score_arr = [];
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
		// window.screen.lockOrientation('portrait')
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		document.body.appendChild(canvas)
        addEventListener('touchmove', touchMove);
		addEventListener("touchstart",touchStart);
		addEventListener("touchend",touchEnd);
		lastTime = Date.now()
		main();
		bucket = new bucket();
		av_button = new av_button();
		ctx.font = "24pt Ariel"
        ctx.textAlign="left";
    },

};
app.initialize();
var virus_red_image = new Image();
virus_red_image.src = 'assets/img/virus_red.png';
var virus_red_splat_image = new Image();
virus_red_splat_image.src = 'assets/img/virus_splat.png';
var virus_green_image = new Image();
virus_green_image.src = 'assets/img/virus_green.png';
var data_bucket_image = new Image();
data_bucket_image.src = 'assets/img/data_bucket.png';
var av_arr  = [];
for(i = 0; i < 6; i ++){
	var av_count_image = new Image();
	av_count_image.src = 'assets/img/av_count_' + i + '.png';
	av_arr.push(av_count_image);
}
var hitSound = new Audio("assets/audio/hit.wav")
var missSound = new Audio("assets/audio/miss.wav")
var notificationSound = new Audio("assets/audio/notification.wav")
var virus_arr = [];
function virus(x,y,dx,dy,id,type,mod){
	this.x = x;
	this.y=y;
	this.id = id;
	this.type = type
    this.width = (window.innerWidth/10) * (Math.pow(1+av_size_mod,mod));
    this.height = this.width;
	if (type == 1 )
		this.img = virus_green_image
	else 
		this.img = virus_red_image
	this.dx = dx * (Math.pow(1+av_speed_mod,mod))
	this.dy = dy * (Math.pow(1+av_speed_mod,mod))
}
function score_blob() {	
	this.baseX = canvas.width - canvas.height * .2;
	this.baseY = canvas.height * .99;
	this.width = canvas.height * .2 / 4;
	this.height = this.width;
	this.img = virus_green_image


}
function bucket(){
	this.x = canvas.width - canvas.height * .2;
	this.y = 0;
	this.size = canvas.height * .2;

}
function av_button(){
	this.x = canvas.height*.01;
	this.y = canvas.height*.89;
	this.size = canvas.height * .1;

}
var lastTime = Date.now();
function main (){
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
	for(var i = 0; i < score_arr.length; i++){
		var current = score_arr[i];
		ctx.drawImage(current.img,current.baseX  + current.width * (i%4),current.baseY - current.height - current.height * Math.floor(i/4),current.width,current.height)
    
	}
	
	ctx.drawImage(data_bucket_image,bucket.x,bucket.y,bucket.size,bucket.size)
	ctx.drawImage(av_arr[av_counter],av_button.x,av_button.y,av_button.size,av_button.size)
	ctx.strokeText((Math.floor(timeRemaining/10)/100).toFixed(2),10,45);
    ctx.fillText((Math.floor(timeRemaining/10)/100).toFixed(2),10,45);
	if (held)
		ctx.drawImage(held.img,held.x,held.y,held.width,held.height)
}
var currentID = 0;
var millisecondsPerVirus = 1000;
var baseSpeed = 4000;
var millisecondsPerUpdate = 10000;
var av_open = false;
var av_update = false;
var av_update_counter = 0;
function editObjects(dt){
	timeRemaining = timeRemaining - dt;
    if (timeRemaining <= 0){
        //		score = 0;
        //		timeRemaining = 30000
        //		score_arr = [];
        window.location.href = 'virus_final.html'
    }
	for(var i = 0; i < virus_arr.length; i++){
		var current = virus_arr[i];
		current.x = current.x + current.dx * dt;
		current.y = current.y + current.dy * dt;
		if (current.x > window.innerWidth || current.x + current.width < 0 || current.y > window.innerHeight || current.y + current.height < 0){
			if (current.type == 2){
				missSound.play()
				score_arr = score_arr.slice(0,score_arr.length -av_counter -1);
			}
			virus_arr.splice(i,1);
		}
		
	}
	if (Math.random() < (1/millisecondsPerUpdate) * dt && av_counter < 5 && !av_update){
		av_counter++;
		notificationSound.play();
	}
	if (av_update){
		av_update_counter = av_update_counter - dt;
		if (av_update_counter <= 0){		
			av_counter--;
			if (av_counter > 0){
				av_update_counter = 1000
			}
			else{
				av_update = false;
				closeAntiVirusPopup();			
			}			
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
		var rnd2 = getRandomInt(0,20)
		var virus_type = 1
		console.log(rnd2 + ' ' + (19-av_counter))
		if(rnd2 >= (19 - av_counter)){
			virus_type = 2
			virus_arr.push(new virus(xcoord,ycoord,deltaX,deltaY,currentID,virus_type,av_counter))
		} else 
		{
			virus_arr.push(new virus(xcoord,ycoord,deltaX,deltaY,currentID,virus_type,0))
		}
		currentID++;
	
	}
	
}
var held;
var score = 0;
function touchStart(e){
	for(i=0;i<e.touches.length;i++){
			for(j=0;j<virus_arr.length;j++){
				if(e.touches[i].pageX >= virus_arr[j].x - virus_arr[j].width /2 && e.touches[i].pageX <= virus_arr[j].x + virus_arr[j].width *1.5 && e.touches[i].pageY >= virus_arr[j].y - virus_arr[j].height /2 && e.touches[i].pageY <= virus_arr[j].y + virus_arr[j].height *1.5){
					if (virus_arr[j].type == 1){
						held = virus_arr[j];
						virus_arr.splice(j,1);
						}
					else{
						virus_arr[j].img = virus_red_splat_image;
						virus_arr[j].dx = 0;
						virus_arr[j].dy = Math.abs(virus_arr[j].dy)
						virus_arr[j].type = 3;
					}
						
					
					return true;
				}
			}
			if (e.touches[i].pageX >= av_button.x && e.touches[i].pageX <= av_button.x +av_button.size && e.touches[i].pageY >= av_button.y && e.touches[i].pageY <= av_button.y + av_button.size){
				if (!av_open && av_counter > 0)
					antiVirusPopup();
			}
		}
}
function touchEnd(e){
	if(held){
		
		if (held.x + held.width/2 >= bucket.x && held.x + held.width/2 <= bucket.x + bucket.size && held.y >= bucket.y && held.y <= bucket.y + bucket.size){
			score ++;
			score_arr.push(new score_blob());
			hitSound.play();
		}
		else
			virus_arr.push(held);
		held = null;
	}
}
function touchMove(e){
        e.preventDefault();
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
function antiVirusPopup() {
	var popup = document.createElement("div");
	popup.className = "popup";
	popup.style.top = getRandomInt(0,70) + '%';
	var button = document.createElement("div");
	button.className = "update";
	button.innerText = "Update";
	button.onclick=antiVirusUpdate;
	popup.appendChild(button);
	document.body.appendChild(popup);
	av_open = true;

}
function closeAntiVirusPopup(){
	var popup = document.getElementsByClassName("popup")[0];
	popup.remove();
	av_open = false;

}
function antiVirusUpdate(){
	av_update_counter = 1000;
	av_update = true;
	var button = document.getElementsByClassName("update")[0];
	button.innerText = "Updating...";
	button.onclick = null;

}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
