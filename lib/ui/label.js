(function (window, undefined) {

    function Label(config) {
        this.initialize(config);
    }

    Label.prototype = Object.create(PIXI.Text.prototype);
    Label.prototype.constructor = Label;

    Label.TEXT_H_ALIGN_CENTER = 'center';
    Label.TEXT_H_ALIGN_LEFT = 'left';
    Label.TEXT_H_ALIGN_RIGHT = 'right';

    Label.TEXT_V_ALIGN_TOP = 'top';
    Label.TEXT_V_ALIGN_MIDDLE = 'middle';
    Label.TEXT_V_ALIGN_BOTTOM = 'bottom';
    Label.TEXT_V_ALIGN_ALPHABETIC = 'alphabetic';

    Label.prototype.initialize = function (config) {

        config = config || {};

        PIXI.Text.call(this, config.text || 'Default Label Text');
        this.extending([Drawable]);

        this.text_align = config.text_align || Label.TEXT_H_ALIGN_LEFT;
        this.text_vertical_align = config.text_vertical_align || Label.TEXT_V_ALIGN_TOP;

        this.font_color = config.font_color || "#333333";
        this.font_size = config.font_size || 14;
        this.font_name = config.font_name || 'Arial';

        this.background_color = config.background_color || null;
        this.background_alpha = config.background_alpha || 1;

        this.shadow_color = config.shadow_color || "#000000";
        this.shadow_distance = config.shadow_distance || 0;
        this.shadow_angle = config.shadow_angle || Math.PI / 4;

        this.stroke_color = config.stroke_color || '#000000';
        this.stroke_thickness = config.stroke_thickness || 0;

        this.label_width = config.label_width || 100;

        this.padding = config.padding || 0;

        this.is_multiline = config.is_multiline || false;

    };

    Label.prototype.update = function (dt) {

        Drawable.prototype.update.call(this,dt);

      //  this.updateText();
      //  this.set_size(this.width, this.height);
    };

    Label.prototype.recalculate = function () {
        this.updateText();
        this.set_size(this.width, this.height);
    };

// GETTERS AND SETTERS

    Object.defineProperty(Label.prototype, "stroke_thickness", {
        get: function () {
            return this._stroke_thickness;
        },
        set: function (value) {
            this._stroke_thickness = value;
            this.style.strokeThickness = value;
            this.recalculate();
        }
    });

    Object.defineProperty(Label.prototype, "stroke_color", {
        get: function () {
            return this._stroke_color;
        },
        set: function (value) {
            this._stroke_color = value;
            this.style.stroke = value;
            this.recalculate();
        }
    });

    Object.defineProperty(Label.prototype, "label_width", {
        get: function () {
            return this._label_width;
        },
        set: function (value) {
            this._label_width = value;
            this.style.wordWrapWidth = value;
            this.recalculate();
        }
    });

    Object.defineProperty(Label.prototype, "is_multiline", {
        get: function () {
            return this._is_multiline;
        },
        set: function (value) {
            this._is_multiline = value;
            this.style.wordWrap = value;
            this.recalculate();
        }
    });

    Object.defineProperty(Label.prototype, "shadow_angle", {
        get: function () {
            return this._shadow_angle;
        },
        set: function (value) {
            this._shadow_angle = value;
            this.style.dropShadowAngle = value;
        }
    });

    Object.defineProperty(Label.prototype, "shadow_color", {
        get: function () {
            return this._shadow_color;
        },
        set: function (value) {
            this._shadow_color = value;
            this.style.dropShadowColor = value;
        }
    });

    Object.defineProperty(Label.prototype, "shadow_distance", {
        get: function () {
            return this._shadow_distance;
        },
        set: function (value) {
            this._shadow_distance = value;
            this.style.dropShadow = value ? true : false;
            this.style.dropShadowDistance = value;
        }
    });

    Object.defineProperty(Label.prototype, "font_color", {
        get: function () {
            return this._font_color;
        },
        set: function (value) {
            this._font_color = value;
            this.style.stroke = value;
            this.style.fill = value;
            this.updateText();
        }
    });

    Object.defineProperty(Label.prototype, "font_size", {
        get: function () {
            return this._font_size;
        },
        set: function (value) {
            this._font_size = value;
            this.style.fontSize = value + "px";
            this.recalculate();
        }
    });

    Object.defineProperty(Label.prototype, "font_name", {
        get: function () {
            return this._font_name;
        },
        set: function (value) {
            this._font_name = value;
            this.style.fontFamily = value;
            this.recalculate();
        }
    });

    Object.defineProperty(Label.prototype, "text_vertical_align", {
        get: function () {
            return this._text_vertical_align;
        },
        set: function (value) {
            this._text_vertical_align = value;
            this.style.textBaseLine = value;
        }
    });

    Object.defineProperty(Label.prototype, "text_align", {
        get: function () {
            return this._text_align;
        },
        set: function (value) {
            this._text_align = value;
            this.style.align = value;
        }
    });

    Object.defineProperty(Label.prototype, "padding", {
        get: function () {
            return this._padding;
        },
        set: function (value) {
            this._padding = value;
            this.style.padding = value;
        }
    });

    Object.defineProperty(Label.prototype, "txt", {
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


    window.Label = Label;

}(window));
