(function (window, undefined) {

    function Tween() {
        this.initialize();
    }
    //Tween.prototype = new ParentClassName();
    //Tween.prototype.parent_initialize = Tween.prototype.initialize;    
    Tween.prototype.initialize = function (object, to, bezier, duration, callback) {
        // this.parent_initialize();

        this.object = object;
        this.to = to;
        this.bezier = bezier;
        this.duration = duration;
        this.callback = callback || function () {};
        
        this.time_passed = 0;
        this.ticks = 0;
        this.is_finished = false;
    };
    
    Tween.prototype.start = function () {
        this.run();
    };

    Tween.prototype.run = function () {
        Actions.add(this);
        this.is_finished = false;
    };

    Tween.prototype.stop = function () {
        Actions.remove(this);
        this.time_passed = 0;
        this.ticks = 0;
        this.is_finished = true;
    };

    Tween.prototype.pause = function () {
        this.is_paused = true;
    };

    Tween.prototype.resume = function () {
        this.is_paused = false;
    };

    window.Tween = Tween;

}(window));