(function (window, undefined) {

    function DrawingLayer() {
        this.initialize();
    }

    DrawingLayer.prototype = Object.create(PIXI.Graphics.prototype);
    DrawingLayer.TYPE = UID.numbering();
    DrawingLayer.prototype.constructor = DrawingLayer;
    DrawingLayer.prototype.initialize = function () {

        PIXI.Graphics.call(this);
        this.extend([Drawable]);
        this.TYPE = DrawingLayer.TYPE;

    };

    window.DrawingLayer = DrawingLayer;

}(window));