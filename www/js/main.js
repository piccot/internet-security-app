var questions_file
window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
var app = {

  
    initialize: function() {
        this.bindEvents();
			
		
	},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },

    onDeviceReady: function() {
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
			dir.getFile("whack_questions.json", {create:true}, function(file) {
				questions_file = file;	
				writeWhackQuestionsToFile();
				createCard('whack_splash.png','whack_initial.html',0);
				createCard('virus_splash.png','virus_initial.html',1);
				createCard('mail_splash.png','mail_initial.html',2);
			});
		
	});
    }

};
function createCard(splash,home,i){
	var container = document.getElementsByClassName("scroll-holder")[0]
	var width = Math.floor(container.offsetWidth * .75)
	var height = Math.floor(width * (4/3)) * 1.15
	var div = document.createElement("div");

	var upperImg = document.createElement("img");		
	upperImg.src = 'splashscreens/'+splash
	upperImg.onclick = function(){window.location.href = home};
	div.appendChild(upperImg)
	
	
	var lowerImg = document.createElement("img");
	lowerImg.src = 'assets/img/playbutton.png'
	lowerImg.onclick = function(){window.location.href = home};
	div.appendChild(lowerImg);
	
	div.style.width= width + 'px';
	div.style.height= height +'px';		
	div.className = 'gameCard'		
	div.style.top = (container.offsetHeight - height)/2 + 'px'
	div.style.left = width * .075 *(i+1) + 'px'
	container.appendChild(div)
	
	
	
}
function fail(){
	return true;
}
function writeWhackQuestionsToFile(){
	var filedata
    questions_file.file(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {			
			filedata=this.result;
			questions_file.createWriter(function(fileWriter) {
				fileWriter.seek(fileWriter.length);
				if (fileWriter.length <= 0){
					fileWriter.write('[{"Password":"password123","Type": 3, "id": 1},{"Password":"I<3Horses","Type": 3, "id": 2},{"Password":"JknsD3@anmAiLfknsma!","Type": 3, "id": 3},{ "Password":"HappyDays","Type": 3, "id": 4},{"Password":"TheBestPassword","Type": 3, "id": 5},{"Password":"TheBestPassword","Type": 3, "id": 6},{"Password":"TheWorstPassword","Type": 3, "id": 7},{"Password":"2@Atak","Type": 2, "id": 8},{"Password":"24pples2D4y","Type": 2, "id": 9},{"Password":"IWasBornIn1919191995","Type": 2, "id": 10},{"Password":"IWasBornIn1919191995","Type": 2, "id": 11},{"Password":"2BorNot2B_ThatIsThe?","Type": 1, "id": 12},{"Password":"4Score&7yrsAgo","Type": 1, "id": 13}]');
				}
			}, fail);
        };
        reader.readAsText(file);
    }, fail);

}



app.initialize();
