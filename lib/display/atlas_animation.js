//(function(window) {

function AtlasAnimation(confs) {
    if (confs) {
        this.initialize(confs);
    }
}

AtlasAnimation.prototype = new Sprite();
AtlasAnimation.prototype.sprite_initialize = AtlasAnimation.prototype.initialize;

AtlasAnimation.prototype.initialize = function (confs) {

    this.sprite_initialize();

    //   var  conf = [{
//            atlas_name: 'spider_atlas',
//            animations: {
//                spider_idle: {frames: 10, duration: 4000, ax: 0.5, ay: 1,w:1,h:1}
//            }
//        },
//    ]

    this.animation_index = 0;
    this.is_paused = false;
    this.callback = null;
    this.confs = confs;
    this.current_frame = 0;
    this.time_elapsed = 0;
    this.current_animation = null;
    this.current_animation_name = "";
    this.is_loop = false;
    this.is_flipped = false;
    this.has_ended = false;


};

AtlasAnimation.prototype.on_frame = function (frame_index, animation_name, is_flipped) {
    //to be overwritten
};

AtlasAnimation.prototype.play = function (anime_name, is_flipped, is_loop, callback) {


    this.is_flipped = is_flipped = (is_flipped === undefined) ? false : is_flipped;
    this.is_loop = (is_loop === undefined) ? true : is_loop;

    this.current_animation_name = anime_name;
    this.has_ended = false;
    this.time_elapsed = 0;

    this.callback = callback;

    if (this.is_flipped) {
        this.scale.x = -1 * Math.abs(this.scale.x);
    } else {
        this.scale.x = Math.abs(this.scale.x);
    }

    for (var j = 0; j < this.confs.length; j++) {
        var conf = this.confs[j];

        this.current_animation = conf.animations[anime_name];

        if (!this.current_animation) {
            throw "there is no such animation: " + anime_name;
            return;
        }
    }

};

AtlasAnimation.prototype.pause = function () {
    this.is_paused = true;
};

AtlasAnimation.prototype.get_current_frame = function () {

    var p = this.time_elapsed / this.current_animation.duration;
    p = (p < 1.0) ? p : 0.99;
    var frame = Math.floor(this.current_animation.frames * p);
    this.set_frame(frame);
    return frame;

};

AtlasAnimation.prototype.set_frame = function (frame) {

    if (frame !== this.current_frame) {
        this.current_frame = frame;
        this.on_frame(this.current_frame, this.current_animation_name, this.is_flipped);
    }

};

AtlasAnimation.prototype.on_draw = function (context) {
};

AtlasAnimation.prototype.update = function (dt) {
    
    Sprite.prototype.update.call(this,dt);

    if (!this.is_paused && this.current_animation && !this.has_ended) {

        this.time_elapsed += dt;

        this.texture = PIXI.Texture.fromFrame(this.current_animation_name + "" + this.get_current_frame());

        if (this.time_elapsed >= this.current_animation.duration) {
            if (this.is_loop) {
                this.time_elapsed = 0;
            } else {
                this.has_ended = true;
            }
        }

        if (this.has_ended && this.callback) {
            this.callback();
            this.callback = null;
        }
    }

    // set the right texture

};


//    window.AtlasAnimation = AtlasAnimation;
//
//}(window));