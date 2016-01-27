function createCards(){
	var container = document.getElementsByClassName("scroll-holder")[0]
	var width = Math.floor(container.offsetWidth * .75)
	var height = Math.floor(width * (4/3)) * 1.15
	for (i=0;i<6;i++){
		var div = document.createElement("div");
	
		var upperImg = document.createElement("img");		
		upperImg.src = 'splashscreens/whack.png'
		div.appendChild(upperImg)
		
		
		var lowerDiv = document.createElement("div");		
		div.appendChild(lowerDiv);
		
		div.style.width= width + 'px';
		div.style.height= height +'px';		
		div.className = 'gameCard'		
		div.style.top = (container.offsetHeight - height)/2 + 'px'
		div.style.left = width * .075 *(i+1) + 'px'
		container.appendChild(div)
	
	}
	
}

createCards();