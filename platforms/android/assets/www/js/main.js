function createCards(){
	var container = document.getElementsByClassName("scroll-holder")[0]
	var width = Math.floor(container.offsetWidth * .75)
	var height = Math.floor(width * (4/3)) * 1.2
	for (i=0;i<6;i++){
		var div = document.createElement("div");
		var innerDiv = document.createElement("div");
		innerDiv.style.width = '100%'
		innerDiv.style.height = '15%'
		innerDiv.style.position = 'relative';
		innerDiv.style.bottom = '-85%';
		innerDiv.style.backgroundColor = 'green'
		div.appendChild(innerDiv);
		
		div.style.width= width + 'px';
		div.style.height= height +'px';
		div.style.backgroundColor = 'blue';
		div.style.position = 'relative';
		div.style.display = 'inline-block';
		div.style.top = (container.offsetHeight - height)/2 + 'px'
		div.style.left = width * .075 *i + 'px'
		container.appendChild(div)
	
	}
	
}

createCards();