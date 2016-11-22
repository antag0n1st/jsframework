(function (window, undefined) {

    function StyledLabel(config) {
        this.initialize(config);
    }

    StyledLabel.prototype = Object.create(PIXI.MultiStyleText.prototype);
    StyledLabel.prototype.constructor = StyledLabel;

    StyledLabel.TEXT_H_ALIGN_CENTER = 'center';
    StyledLabel.TEXT_H_ALIGN_LEFT = 'left';
    StyledLabel.TEXT_H_ALIGN_RIGHT = 'right';

    StyledLabel.TEXT_V_ALIGN_TOP = 'top';
    StyledLabel.TEXT_V_ALIGN_MIDDLE = 'middle';
    StyledLabel.TEXT_V_ALIGN_BOTTOM = 'bottom';
    StyledLabel.TEXT_V_ALIGN_ALPHABETIC = 'alphabetic';

    StyledLabel.prototype.initialize = function (config) {

        config = config || {def: { font: "35px Arial", fill: "gray" }};

        PIXI.Text.call(this, config.text || 'Default StyledLabel Text');
        this.extending([Drawable]);
        
        this.set_tags_style(config);


    };
    
    StyledLabel.prototype.set_tags_style = function(style){
        this.setTextStyles(style);
    };

    StyledLabel.prototype.update = function (dt) {

        Drawable.prototype.update.call(this,dt);
    };

    StyledLabel.prototype.recalculate = function () {
        this.updateText();
        this.set_size(this.width, this.height);
    };

// GETTERS AND SETTERS


    Object.defineProperty(StyledLabel.prototype, "txt", {
        get: function () {
            return this._txt;
        },
        set: function (value) {
            this._txt = value;
            this.text = value;
            if (this.set_size) {
                this.recalculate();
            }
        }
    });


    window.StyledLabel = StyledLabel;

}(window));
