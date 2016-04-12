function getScore(){
	document.getElementsByClassName('mainMenu')[0].addEventListener("touchstart",mainMenu)
	document.getElementsByClassName('playAgain')[0].addEventListener("touchstart",playAgain) 

}

getScore()

function playAgain(){
	window.location.href = 'mail.html'

}

function mainMenu(){
	window.location.href = 'main.html'


}
