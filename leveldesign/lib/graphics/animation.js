//(function(window) {

function Animation(sprite_sheet) {
    if (sprite_sheet) {
        this.initialize(sprite_sheet);
    }
}

Animation.prototype = new Drawable();
Animation.prototype.drawable_initialize = Animation.prototype.initialize;

Animation.prototype.initialize = function(sprite_sheet) {

    this.drawable_initialize();

    this.animation_index = 0;
    this.is_animation_stopped = false;

    if (sprite_sheet) {


        this.position = new Vector();
        this.current_frame = 0;
        this.time_elapsed = 0;
        this.current_animation = null;
        this.current_animation_name = "";
        this.ticked = 0;
        this.backround_offset_x = 0;
        this.backround_offset_y = 0;
        this.is_removable = true;
        this.is_visible = true;


        this.image = sprite_sheet._images[0];
        this.frames = sprite_sheet._frames[0];

        this.width = this.frame_width = Math.floor(this.image.width / this.frames.x);
        this.height = this.frame_height = Math.floor(this.image.height / this.frames.y);


        if (sprite_sheet._regs[0]) {
            var reg = sprite_sheet._regs[0];

        } else {
            var reg = {x: 0, y: 0, width: 1, height: 1};
        }

        this.set_size(this.width * reg.width, this.height * reg.height);
        this.set_anchor(reg.x, reg.y);




        this.sprite_sheet = sprite_sheet;

        this.has_ended = false;
        this.lock_callback = false;


    }



};

Animation.prototype.on_frame = function(frame_index, animation_name) {
};

Animation.prototype.play = function(anime_name, start_at_begining) {
    this.is_animation_stopped = false;
    var animations = this.sprite_sheet._animations;
    var count = animations.length;
    this.current_animation_name = anime_name;

    for (var i = 0; i < count; i++) {

        var animation = animations[i];
        this.animation_index = 0;
        if (animation[anime_name]) {
            // lets set 
            this.current_animation = animation[anime_name];
            this.image = this.sprite_sheet._images[i];
            this.frames = this.sprite_sheet._frames[i];

            this.frame_width = Math.floor(this.image.width / this.frames.x);
            this.frame_height = Math.floor(this.image.height / this.frames.y);

            // this.reg = this.sprite_sheet._regs[i];

            break;
        }

        // this.image = config.image.image;
        //  this.image_name = config.image.image_name;

        //  this.frame_width = Math.floor(this.image.width / config.frames.x);
        //  this.frame_height = Math.floor(this.image.height / config.frames.y);

        //  this.frames = config.frames;
        //  this.animations = config.animations;

        //  this.reg = config.reg;

    }


    this.time_elapsed = (start_at_begining || this.time_elapsed > this.current_animation.duration) ? 0 : this.time_elapsed;
    this.set_frame(this.get_current_frame());
    this.ticked = 0;
    this.has_ended = false;
    this.lock_callback = false;


};

Animation.prototype.stop = function(){
    this.is_animation_stopped = true;
};

Animation.prototype.get_current_frame = function() {
    var p = this.time_elapsed / this.current_animation.duration;
    p = (p < 1.0) ? p : 0.99;
    return this.current_animation.start + Math.floor((this.current_animation.end - this.current_animation.start + 1) * p);

};

Animation.prototype.set_frame = function(frame) {
    if (frame !== this.current_frame) {
        this.current_frame = frame;
        this.on_frame(this.current_frame, this.current_animation_name);
    }

};


Animation.prototype.advance = function(dt) {

    this.time_elapsed += dt;

    var x = this.frames.x;
    var c = this.current_frame;
    this.backround_offset_x = c % x | 0;
    this.backround_offset_y = c / x | 0;


    if (this.time_elapsed >= this.current_animation.duration) {
        if (this.current_animation.loop) {
            this.time_elapsed -= this.current_animation.duration;
        } else {

            this.set_frame(this.current_animation.end);

            if (!this.has_ended) {
                this.has_ended = true;
            }
        }
    } else {

        this.set_frame(this.get_current_frame());

    }



};

Animation.prototype.on_draw = function(context) {
};

Animation.prototype.draw = function(context) {

    var w = this.frame_width;
    var h = this.frame_height;
    var anchor = this.bounds.pos;
    var ach = this.get_anchor();
    var pos = SAT.pool.get();
    pos.x = this.bounds.pos.x + (-w * ach.x);
    pos.y = this.bounds.pos.y + (-h * ach.y);

    if (this.is_visible) {

        this._alpha = context.globalAlpha;

        if (this.angle !== 0) {
            context.save();
            context.translate(anchor.x, anchor.y);
            context.rotate(this.angle);
            pos.x = -w * ach.x;
            pos.y = -h * ach.y;
        }


        if (this.alpha !== 1) {
            context.globalAlpha = context.globalAlpha * this.alpha;
        }

        var new_width = w * this.scale_x;
        var new_height = h * this.scale_y;

        context.drawImage(this.image,
                Math.round_decimal((this.backround_offset_x * w), 2),
                Math.round_decimal(this.backround_offset_y * h, 2),
                w,
                h,
                Math.round_decimal(pos.x - ach.x * (new_width - w), 2),
                Math.round_decimal(pos.y - ach.y * (new_height - h), 2),
                new_width,
                new_height
                );


        this.on_draw(context);

        if (this.angle !== 0) {
            context.restore();
        }

    }

    if (Config.debug) {
        this.debug_bounds(context);
    }


    if (!this.lock_callback && this.has_ended) {
        if (this.current_animation.callback) {
            this.current_animation.callback();
        }
        this.lock_callback = true;
    }

};

Animation.prototype.on_draw_finished = function(context) {
    context.globalAlpha = this._alpha;
};

Animation.prototype.clear = function(context) {

};

Animation.prototype.update = function(dt) {
    if (!this.is_animation_stopped) {
        this.advance(dt);
    }
};


//    window.Animation = Animation;
//
//}(window));