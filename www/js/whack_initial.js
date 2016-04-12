function begin(){
    document.getElementsByClassName('back')[0].addEventListener("touchstart",back)
    document.getElementsByClassName('play')[0].addEventListener("touchstart",play)
    
}

begin()

function play(){
    window.location.href = 'whack.html'
    
}

function back(){
    window.location.href = 'main.html' + location.search
    
    
}
