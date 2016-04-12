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
var timeRemaining = 60000;
var score_arr = [];
var score_arr2 = [];

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
        canvas.addEventListener('touchmove', touchMove);
		canvas.addEventListener("touchstart",touchStart);
		canvas.addEventListener("touchend",touchEnd);
		lastTime = Date.now()
        test();
		requestAnimationFrame(main)
		bucket = new bucket();
		av_button = new av_button();
		ctx.font = "24pt Ariel"
        ctx.textAlign="left";
    },

};
app.initialize();
var currentImage = 0;
var previousImage = 0;
var totalImages = 1;
var score_image_arr = [];
var key_image_arr = [];
for (i=0;i<4;i++){
	for(j=0;j<4;j++){
		var tempImage = new Image();
		tempImage.src = 'assets/img/key_image/key Image-' + j +'-'+i+'.png';
		key_image_arr.push(tempImage);
	}

}
score_image_arr.push(key_image_arr);
var virus_red_image = new Image();
virus_red_image.src = 'assets/img/virus_red.png';
var virus_red_splat_image = new Image();
virus_red_splat_image.src = 'assets/img/virus_splat.png';
var virus_green_image = new Image();
virus_green_image.src = 'assets/img/virus_green.png';
var data_bucket_image = new Image();
data_bucket_image.src = 'assets/img/data_bucket.png';
var background_image = new Image();
background_image.src = 'assets/img/virusBG.png';
var av_arr  = [];
var hit_sound_list = [];
var hit_sound_index = 0;
var hit_sound;
var miss_sound;
var miss_sound_list = [];
var miss_sound_index = 0;
var notification_sound;
var hit_sound2;
var miss_sound2;
var notification_sound2;
for(i = 0; i < 6; i ++){
	var av_count_image = new Image();
	av_count_image.src = 'assets/img/av_count_' + i + '.png';
	av_arr.push(av_count_image);
}


function test() {
	hit_sound = new Audio('assets/audio/hit.wav');
    hit_sound.load();
	document.body.appendChild(hit_sound);
	hit_sound_list.push(hit_sound);
	
	for (var i=0;i<4;i++){
		hit_sound2 = hit_sound.cloneNode();
        hit_sound2.load();
		document.body.appendChild(hit_sound2);
		hit_sound_list.push(hit_sound2);
	
	}
	miss_sound = new Audio('assets/audio/miss.wav');
    miss_sound.load();
	document.body.appendChild(miss_sound);
	miss_sound_list.push(miss_sound);
	for (var i=0;i<4;i++){
		miss_sound2 = miss_sound.cloneNode();
        miss_sound2.load();
		document.body.appendChild(miss_sound2);
		miss_sound_list.push(miss_sound2);
	
	}
	notification_sound = new Audio('assets/audio/notification.wav');
	
	
	
	document.body.appendChild(notification_sound);
	
	
	
	
	hit_sound2 = hit_sound.cloneNode();
	
	notification_sound2 = hit_sound.cloneNode();
	
	
	document.body.appendChild(hit_sound2);
	document.body.appendChild(notification_sound2);
}




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
	this.baseY = 0;
	this.width = canvas.height * .2 / 4;
	this.height = this.width;
	this.img = key_image_arr[score-1]
	this.dx;
	this.dy;
	this.currX;
	this.currY;


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
	requestAnimationFrame(main);
    update()
	lastTime = Date.now()
	render()
	
}

function update(){
	editObjects(Date.now() - lastTime);
}
function playAudio(src) {
    
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

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(background_image,0,0,canvas.width,canvas.height)
	for(var i = 0; i < virus_arr.length; i++){
		var current = virus_arr[i];
		ctx.drawImage(current.img,current.x,current.y,current.width,current.height)
    
	}
		ctx.drawImage(data_bucket_image,bucket.x,bucket.y,bucket.size,bucket.size)
	for(var i = 0; i < score_arr.length; i++){
		var current = score_arr[i];
		ctx.drawImage(score_image_arr[currentImage%totalImages][i],current.baseX  + current.width * (i%4),current.baseY + current.height * Math.floor(i/4),current.width,current.height)
    
	}
	for(var i = 0; i < score_arr2.length; i++){
		var current = score_arr2[i];
		ctx.drawImage(score_image_arr[previousImage%totalImages][i],current.currX,current.currY,current.width,current.height);
    
	
	}
	

	ctx.drawImage(av_arr[av_counter],av_button.x,av_button.y,av_button.size,av_button.size)
    ctx.fillStyle = "#FFFFFF"
    ctx.strokeStyle = "#000000";
	ctx.strokeText((Math.floor(timeRemaining/10)/100).toFixed(2),10,45);
    ctx.fillText((Math.floor(timeRemaining/10)/100).toFixed(2),10,45);
	if (held)
		ctx.drawImage(held.img,held.x,held.y,held.width,held.height)
}
var currentID = 0;
var millisecondsPerVirus = 200;
var baseSpeed = 4000;
var millisecondsPerUpdate = 15000;
var av_open = false;
var av_update = false;
var av_update_counter = 0;
function editObjects(dt){
	timeRemaining = timeRemaining - dt;
    if (timeRemaining <= 0){
		
        window.location.href = 'virus_final.html?score=' + (16 * imagesCollected + score);
    }
	for(var i = 0; i < virus_arr.length; i++){
		var current = virus_arr[i];
		current.x = current.x + current.dx * dt;
		current.y = current.y + current.dy * dt;
		if (current.x > window.innerWidth || current.x + current.width < 0 || current.y > window.innerHeight || current.y + current.height < 0){
			if (current.type == 2){
				
				miss_sound_list[miss_sound_index%5].play();
				miss_sound_index++;
                //playAudio("assets/audio/miss.wav");
				score_arr = score_arr.slice(0,score_arr.length -av_counter -1);
				score = Math.max(0,score - (av_counter+1));
			}
			virus_arr.splice(i,1);
		}
		
	}
	for(var i = 0; i < score_arr2.length; i++){
		score_arr2[i].currX = score_arr2[i].currX + score_arr2[i].dx * dt;
		score_arr2[i].currY = score_arr2[i].currY + score_arr2[i].dy * dt;
		if (score_arr2[i].currX < canvas.width*.45 && score_arr2[i].currY > canvas.height /2)
			score_arr2.splice(i,1);
	}
	if (Math.random() < (1/millisecondsPerUpdate) * dt && av_counter < 5 && !av_update){
		av_counter++;
		if (notification_sound.paused)
				notification_sound.play();
			else
				notification_sound2.play();
		
        //playAudio("assets/audio/notification.wav");
		
		millisecondsPerUpdate = 15000;
		
	}
	else if (av_counter < 5 && !av_update)
	{
		millisecondsPerUpdate = millisecondsPerUpdate - dt;
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
	if (Math.random() * (virus_arr.length/4 + 1) < (1/millisecondsPerVirus)*dt){
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
var imagesCollected = 0;
function touchStart(e){
			for(j=0;j<virus_arr.length;j++){
				if(e.touches[0].pageX >= virus_arr[j].x - virus_arr[j].width /2 && e.touches[0].pageX <= virus_arr[j].x + virus_arr[j].width *1.5 && e.touches[0].pageY >= virus_arr[j].y - virus_arr[j].height /2 && e.touches[0].pageY <= virus_arr[j].y + virus_arr[j].height *1.5){
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
			if (e.touches[0].pageX >= av_button.x && e.touches[0].pageX <= av_button.x +av_button.size && e.touches[0].pageY >= av_button.y && e.touches[0].pageY <= av_button.y + av_button.size){
				if (!av_open && av_counter > 0)
					antiVirusPopup();
			}
		
}
function touchEnd(e,kill){
	if(held){
		
		if (held.x + held.width/2 >= bucket.x && held.x + held.width/2 <= bucket.x + bucket.size && held.y >= bucket.y && held.y <= bucket.y + bucket.size){
			score ++;
			score_arr.push(new score_blob());
			if(score == 16){
				score=0;
				
				imagesCollected++;
				for(var i = 0; i < score_arr.length; i++){
					score_arr[i].currX = score_arr[i].baseX  + score_arr[i].width * (i%4);
					score_arr[i].currY = score_arr[i].baseY + score_arr[i].height * Math.floor(i/4);
					score_arr[i].dx = (canvas.width*.45 - (score_arr[i].baseX  + score_arr[i].width * (i%4)))/1000;
					score_arr[i].dy = (canvas.height/2 - (score_arr[i].baseY + score_arr[i].height * Math.floor(i/4)))/1000
				}
				
				score_arr2 = score_arr;
				previousImage = currentImage;
				currentImage++;
				
				score_arr = [];
			}
				hit_sound_list[hit_sound_index%5].play();
				hit_sound_index++;
		}
		else
			if (!kill)
				virus_arr.push(held);
		held = null;
	}
}
function touchMove(e){
        e.preventDefault();
	if (held){
		held.x = e.touches[0].pageX - held.width/2;
		held.y = e.touches[0].pageY - held.height/2;
		
		if ( e.touches[0].pageX / canvas.width >.98)
			touchEnd(e,true);
	} else {
		for(j=0;j<virus_arr.length;j++){
				if(e.touches[0].pageX >= virus_arr[j].x - virus_arr[j].width /2 && e.touches[0].pageX <= virus_arr[j].x + virus_arr[j].width *1.5 && e.touches[0].pageY >= virus_arr[j].y - virus_arr[j].height /2 && e.touches[0].pageY <= virus_arr[j].y + virus_arr[j].height *1.5){
					if (virus_arr[j].type == 1){
						held = virus_arr[j];
						virus_arr.splice(j,1);
						}
					return true;
				}
			}
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
	var img = document.createElement("img");
	img.src = 'assets/img/virus_popup.png'
	img.className = "update";
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.style.width = "100%";
	div.style.top = "50%";
	div.style.height = "50%";
	div.style.zIndex = "5";
	div.addEventListener("touchstart",antiVirusUpdate);
	popup.appendChild(div);
	popup.appendChild(img);
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
	button.src = "assets/img/virus_popup2.gif?" + Date.now();
	button.onclick = null;

}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
