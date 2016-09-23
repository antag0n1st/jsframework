(function (window, undefined) {

    function LoadingBar(foreground, background) {
        this.initialize(foreground, background);
    }

    LoadingBar.prototype = new Sprite();
    LoadingBar.prototype.sprite_initialize = LoadingBar.prototype.initialize;
    LoadingBar.TYPE = UID.numbering();
    LoadingBar.prototype.initialize = function (foreground, background) {

        this.sprite_initialize(background ? background : 'health_bar_background'); // your image name
        this.TYPE = LoadingBar.TYPE;

        this.percentage = 0;

        this.to_percentage = 1;
        this.is_animating = false;
        this.mid_percent = 0;

        this.foreground = new Sprite(null);
        this.add_child(this.foreground);
        this.forgrounds = [];

        this.left_x = -this.width / 2 - 100;
        this.total_width = 0;
        this.segment_width = 0;

        for (var i = 0; i < 28; i++) {
            var f = new Sprite(foreground);
            f.set_anchor(0.5, 0.5);
            this.total_width += f.width;
            this.foreground.add_child(f);
            f.set_position(this.left_x + f.width * i, 0);
            this.forgrounds.push(f);
            this.segment_width = f.width;
        }



        var mask = new PIXI.Graphics();

        this.mask_padding = 3;
        this.speed = -0.05;
        this.mask_x = 0;
        this.mask_y = 0;
        this.mask_width = this.width - this.mask_padding * 2;
        this.mask_height = this.height;

        this.foreground.mask = mask;


        this.timeout = 0;
        this.duration = 300; // the speed at which the bar is animating changes

        this.x_scale = 1;
        this.y_scale = 1;


        this.set_anchor(0.5, 0.5);


        this.is_auto_hiding = false;
        // this.set_alpha(0);

        this.looper = new Looper([
            {name: 'fade_in', duration: 100},
            {name: 'still', duration: 800},
            {name: 'fade_out', duration: 200},
            {name: 'end', duration: 100}
        ], true);

        this.looper.is_finished = true; // to prevent it from running

    };

    LoadingBar.prototype.set_bar_scale = function (x, y) {
        this.x_scale = x;
        this.y_scale = y;

        this.set_scale_x(this.x_scale);
        this.set_scale_y(this.y_scale);
    };

    LoadingBar.prototype.set_percent = function (percent, animated) {



        this.is_animating = animated ? true : false;

        if (!this.is_animating) {
            this.percentage = percent;
            //  this.foreground.set_scale_x(percent);
        } else {
            this.percentage = this.mid_percent;

            this.to_percentage = percent;

        }

        this.timeout = this.duration;

        if (this.is_auto_hiding) {
            this.looper.restart();
        }

    };

    LoadingBar.prototype.on_added_to_parent = function (parent) {
        Sprite.prototype.on_added_to_parent.call(this, parent);

    };

    LoadingBar.prototype.on_remove_from_parent = function (parent) {
        Sprite.prototype.on_remove_from_parent.call(this, parent);

    };

    LoadingBar.prototype.set_position = function (x, y) {
        Sprite.prototype.set_position.call(this, x, y);

        /////////////////
        //// MASK POSITION
        var ab = this.bounds.pos;
        var clip_pos = new V().copy(ab);
        clip_pos.x -= this.width / 2;
        clip_pos.y -= this.height / 2;

        this.mask_x = clip_pos.x + this.mask_padding;
        this.mask_y = clip_pos.y;

        if (this.foreground && this.foreground.mask) {
            var mask = this.foreground.mask;
            mask.clear();
            mask.beginFill(0xffffff, 1);
            mask.drawRect(this.mask_x, this.mask_y, this.mask_width * this.mid_percent, this.mask_height);
            mask.endFill();
        }

    };

    LoadingBar.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);

        for (var i = 0; i < this.forgrounds.length; i++) {
            var f = this.forgrounds[i];
            var speed = dt * this.speed;
            var p = f.get_position();

            var x = p.x - speed;

            if (x < this.left_x) {
                var dx = this.left_x - x;
                x = this.left_x + this.total_width - dx;
            } else if (x > this.total_width + this.left_x) {
                // var dx = this.left_x - x;
                //  x = this.left_x + this.total_width - dx;
                var dx = (this.total_width + this.left_x) - x;
               
                x = this.left_x - dx;
            }

            f.set_position(x, p.y);

        }


        if (this.is_animating && this.timeout > 0) {
            this.timeout -= dt;

            var p = (this.duration - this.timeout) / this.duration;
            var d = this.to_percentage - this.percentage;

            var mask = this.foreground.mask;

            if (mask) {
                mask.clear();
                mask.beginFill(0xffffff, 1);

                this.mid_percent = (this.percentage + d * p);
                this.mid_percent = (this.mid_percent > 1) ? 1 : this.mid_percent;
                this.mid_percent = (this.mid_percent < 0.08) ? 0.08 : this.mid_percent;
                mask.drawRect(this.mask_x, this.mask_y, this.mask_width * this.mid_percent, this.mask_height);
                mask.endFill();
            }

            if (this.timeout <= 0) {
                this.is_animating = false;
                this.percentage = this.to_percentage;
            }
        }

        if (this.is_auto_hiding) {

            if (!this.looper.is_finished) {

                this.looper.update(dt);

                var event = this.looper.get();

                if (event.name === 'fade_in') {
                    this.set_alpha(event.percent);
                } else if (event.name === 'still') {
                    if (event.is_first_time) {
                        this.set_alpha(1);
                    }
                } else if (event.name === 'fade_out') {
                    this.set_alpha(1 - event.percent);
                }

                if (event.name === 'end') {
                    if (event.is_first_time) {
                        this.set_alpha(0);
                    }
                }
            }

        }
    };

    window.LoadingBar = LoadingBar;

}(window));