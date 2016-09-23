// perform initial checks here

window.addEventListener("load", function () {

    Config.lang = 'en';
    
    PIXI.utils._saidHello = true;
    
    new Game(); // a game object is exposed inside

    if (game.device.is_android) {
        setTimeout(function () {
            window.scrollTo(0, 1);
        }, 10);
    }

}, false);