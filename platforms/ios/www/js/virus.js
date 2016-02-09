window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
var canvas;
var ctx;
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
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		document.body.appendChild(canvas)
        addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
		addEventListener("touchstart",touchStart);
		addEventListener("touchend",touchEnd);
		window.screen.lockOrientation('landscape')
        jsonObject = JSON.parse('[{"Password":"password123","Type": 3},{"Password":"I<3Horses","Type": 3},{"Password":"JknsD3@anmAiLfknsma!","Type": 3},{ "Password":"HappyDays","Type": 3},{"Password":"TheBestPassword","Type": 3},{"Password":"TheBestPassword","Type": 3},{"Password":"TheWorstPassword","Type": 3},{"Password":"2@Atak","Type": 2},{"Password":"24pples2D4y","Type": 2},{"Password":"IWasBornIn1919191995","Type": 2},{"Password":"IWasBornIn1919191995","Type": 2},{"Password":"2BorNot2B_ThatIsThe?","Type": 1},{"Password":"4Score&7yrsAgo","Type": 1}]');
		lastTime = Date.now()
		virus_arr.push(new virus(0,0,1))
		main();
    },

};
app.initialize();
var virus_red_image = new Image();
virus_red_image.src = 'assets/img/virus_red.png';
var virus_arr = [];
function virus(x,y,id){
	this.x = x;
	this.y=y;
	this.id = id;
    this.width = window.innerWidth/20;
    this.height = this.width;	
	this.img = virus_red_image;
	this.dx = window.innerWidth/2000;
	this.dy = window.innerHeight/2000;
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
}

function editObjects(dt){
	for(var i = 0; i < virus_arr.length; i++){
		var current = virus_arr[i];
		current.x = current.x + current.dx * dt;
		current.y = current.y + current.dy * dt;
	}

}

function touchStart(e){

}
function touchEnd(e){
        console.log(e.changedTouches[0].pageX, e.changedTouches[0].pageY)        
}

function virusIndex(id){
	for(var i = 0; i < virus_arr.length; i++){
		if (virus_arr[i].id == id)
			return i;
	}
	return -1;

}