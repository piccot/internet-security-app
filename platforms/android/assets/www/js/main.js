function createCards(){
	var container = document.getElementsByClassName("scroll-holder")[0]
	var width = Math.floor(container.offsetWidth * .75)
	var height = Math.floor(width * (4/3)) * 1.15
	for (i=0;i<6;i++){
		var div = document.createElement("div");
	
		var upperImg = document.createElement("img");
		upperImg.style.width= '100%'
		upperImg.style.height = '85%'
		upperImg.src = 'splashscreens/whack.png'
		div.appendChild(upperImg)
		var lowerDiv = document.createElement("div");
		lowerDiv.style.width = '100%'
		lowerDiv.style.height = '15%'
		lowerDiv.style.position = 'relative';		
		lowerDiv.style.backgroundColor = 'green'
		div.appendChild(lowerDiv);
		
		div.style.width= width + 'px';
		div.style.height= height +'px';
		div.style.backgroundColor = 'black';
		div.style.position = 'relative';
		div.style.display = 'inline-block';
		div.style.top = (container.offsetHeight - height)/2 + 'px'
		div.style.left = width * .075 *(i+1) + 'px'
		container.appendChild(div)
	
	}
	
}

createCards();