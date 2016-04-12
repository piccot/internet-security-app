function begin(){
    document.getElementsByClassName('back')[0].addEventListener("touchend",back)
    document.getElementsByClassName('play')[0].addEventListener("touchend",play)
    
}

begin()

function play(){
    window.location.href = 'virus.html'
    
}

function back(){
    window.location.href = 'main.html' + location.search
    
    
}
