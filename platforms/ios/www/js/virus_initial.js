function begin(){
    document.getElementsByClassName('back')[0].onclick = back
    document.getElementsByClassName('play')[0].onclick = play
    
}

begin()

function play(){
    window.location.href = 'virus.html'
    
}

function back(){
    window.location.href = 'main.html' + location.search
    
    
}
