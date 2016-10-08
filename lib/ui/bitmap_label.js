(function (window, undefined) {

    function BitmapLabel(config) {
        this.initialize(config);
    }

    BitmapLabel.prototype = Object.create(PIXI.extras.BitmapText.prototype);
    BitmapLabel.prototype.constructor = BitmapLabel;
    BitmapLabel.TYPE = UID.numbering();
    
    BitmapLabel.prototype.initialize = function (config) {

        config = config || {};

        PIXI.extras.BitmapText.call(this, '', {font: config.font_size+"px "+config.font_name});
        
        this.extending([Drawable]);
        this.TYPE = BitmapLabel.TYPE;
        
        this.txt = '';

    };
    
    Object.defineProperty(BitmapLabel.prototype, "font_size", {
        get: function () {
            return this._font_size;
        },
        set: function (value) {
            this._font_size = value;
            this.font.size = value + "px";
            this.updateText();
        }
    });
    
    Object.defineProperty(BitmapLabel.prototype, "font_color", {
        get: function () {
            return this._font_color;
        },
        set: function (value) {
            this._font_color = value;
            this.font.tint = value;
            this.updateText();
        }
    });
    
    Object.defineProperty(BitmapLabel.prototype, "txt", {
        get: function () {
            return this._txt;
        },
        set: function (value) {
            this._txt = value;
            this.text = value;
        }
    });



    window.BitmapLabel = BitmapLabel;

}(window));
