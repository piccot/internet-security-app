function getScore(){
	document.getElementById('score').innerHTML = location.search.replace("?score=","")
	document.getElementsByClassName('mainMenu')[0].addEventListener("touchstart",mainMenu)
	document.getElementsByClassName('playAgain')[0].addEventListener("touchend",playAgain) 

}

getScore()

function playAgain(){
	console.log('test')
	window.location.href = 'whack.html'

}

function mainMenu(){
	window.location.href = 'main.html'


}