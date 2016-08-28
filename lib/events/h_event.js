(function (window, undefined) {

    function HEvent(x, y, type, idx) {
        this.initialize(x, y, type, idx);
    }

    HEvent.UP = 0;
    HEvent.DOWN = 1;
    HEvent.MOVE = 2;
    HEvent.CANCEL = 4;
    HEvent.UNKNOWN = -1;

    //HEvent.prototype = new ParentClassName();
    //HEvent.prototype.parent_initialize = HEvent.prototype.initialize;    
    HEvent.prototype.initialize = function (x, y, type, idx) {
        // this.parent_initialize();
        this.propagate = true;
        this.point = new V(x || 0, y || 0);
        this.type = type;
        this.idx = idx;
    };

    HEvent.prototype.stop_propagation = function () {
        this.propagate = false;
    };

    window.HEvent = HEvent;

}(window));