(function (window) {

    function SpriteAnimation(sprite_sheet) {
        if (sprite_sheet) {
            this.initialize(sprite_sheet);
        }
    }

    SpriteAnimation.prototype = new Sprite();
    SpriteAnimation.TYPE = UID.numbering();
    SpriteAnimation.prototype.sprite_initialize = SpriteAnimation.prototype.initialize;

    SpriteAnimation.prototype.initialize = function (conf) {

        this.sprite_initialize();
        this.TYPE = SpriteAnimation.TYPE;
        this.animation_index = 0;
        this.is_animation_stopped = false;
        this.callback = null;

        if (conf) {

            this.position = new Vector();
            this.current_frame = 0;
            this.time_elapsed = 0;
            this.current_animation = null;
            this.current_animation_name = "";
            this.ticked = 0;
            this.backround_offset_x = 0;
            this.backround_offset_y = 0;
            this.is_removable = true;
            this.is_loop = false;
            this.is_flipped = false;

            this.frames = conf.frames;
            this.animations = conf.animations;
            this.reg = conf.reg;

            var width = Math.floor(conf.texture.width / this.frames.x);
            var height = Math.floor(conf.texture.height / this.frames.y);

            this.textures = [];
            var texture = conf.texture;
            for (var j = 0; j < this.frames.y; j++) {
                for (var i = 0; i < this.frames.x; i++) {
                    var x = i * width;
                    var y = j * height;
                    var rec = new PIXI.Rectangle(x, y, width, height);
                    var t = new PIXI.Texture(texture, rec);
                    this.textures.push(t);
                }
            }
            this.has_ended = false;
            this.set_size(width, height);
        }
    };

    SpriteAnimation.prototype.on_frame = function (frame_index, animation_name) {
    };

    SpriteAnimation.prototype.play = function (anime_name, is_flipped, is_loop, callback, start_at_begining) {

        this.is_animation_stopped = false;

        this.current_animation_name = anime_name;
        this.is_loop = (typeof is_loop === 'undefined') ? true : is_loop;
        this.callback = callback || function () {
        };

        this.current_animation = this.animations[anime_name];
        this.animation_index = 0;
        this.is_flipped = is_flipped;

        if (this.is_flipped) {
            this.scale.x = -1 * Math.abs(this.scale.x);
            this.set_anchor(this.reg.x, this.reg.y);
        } else {
            this.scale.x = Math.abs(this.scale.x);
            this.set_anchor(this.reg.x, this.reg.y);
        }

        this.time_elapsed = start_at_begining ? 0 : this.time_elapsed;
        this.set_frame(this.get_current_frame());
        this.ticked = 0;
        this.has_ended = false;

        if (typeof this.current_animation.rx !== "undefined") {
            //  this.set_anchor(this.current_animation.rx, this.current_animation.ry);
        }

    };

    SpriteAnimation.prototype.stop = function () {
        this.is_animation_stopped = true;
    };

    SpriteAnimation.prototype.get_current_frame = function () {

        if (this.current_animation) {
            var p = this.time_elapsed / this.current_animation.duration;
            p = (p < 1.0) ? p : 0.99;
            return this.current_animation.start + Math.floor((this.current_animation.end - this.current_animation.start + 1) * p);

        } else {
            return 0;
        }

    };

    SpriteAnimation.prototype.set_frame = function (frame) {

        if (frame !== this.current_frame) {
            this.current_frame = frame;
            this.on_frame(this.current_frame, this.current_animation_name);
        }

    };

    SpriteAnimation.prototype.advance = function (dt) {

        this.time_elapsed += dt;

        var x = this.frames.x;
        var c = this.current_frame;

        if (this.is_flipped) {
            this.backround_offset_x = x - 1 - c % x | 0;
            this.backround_offset_y = c / x | 0;
        } else {
            this.backround_offset_x = c % x | 0;
            this.backround_offset_y = c / x | 0;
        }

        if (this.time_elapsed >= this.current_animation.duration) {
            if (this.is_loop) {
                this.time_elapsed -= this.current_animation.duration;
            } else {

                this.set_frame(this.current_animation.end);

                if (!this.has_ended) {
                    this.has_ended = true;
                    this.time_elapsed = 0;
                    //  this.current_frame = 0;
                }
            }
        } else {

            this.set_frame(this.get_current_frame());

        }

    };


    SpriteAnimation.prototype.update = function (dt) {

        Sprite.prototype.update.call(this, dt);

        if (!this.is_animation_stopped && this.current_animation && !this.has_ended) {
            this.advance(dt);
            this.texture = this.textures[this.current_frame];

            if (this.has_ended && this.callback) {
                this.callback();
                this.callback = null;
            }
        }
    };


    window.SpriteAnimation = SpriteAnimation;

}(window));