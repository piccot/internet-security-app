function getScore(){
	document.getElementsByClassName('mainMenu')[0].onclick = mainMenu
	document.getElementsByClassName('playAgain')[0].onclick = playAgain

}

getScore()

function playAgain(){
	window.location.href = 'mail.html'

}

function mainMenu(){
	window.location.href = 'main.html'


}
