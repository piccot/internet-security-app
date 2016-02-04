function createCard(splash,home,i){
	var container = document.getElementsByClassName("scroll-holder")[0]
	var width = Math.floor(container.offsetWidth * .75)
	var height = Math.floor(width * (4/3)) * 1.15
	var div = document.createElement("div");

	var upperImg = document.createElement("img");		
	upperImg.src = 'splashscreens/'+splash
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

createCard('whack.png','whack.html',0);
createCard('whack.png','whack.html',1);
createCard('whack.png','whack.html',2);
createCard('whack.png','whack.html',3);