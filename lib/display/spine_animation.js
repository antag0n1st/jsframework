//(function(window, undefined) {

function SpineAnimation(skeleton_name) {
    if (skeleton_name) {
        this.initialize(skeleton_name);
    }
}

SpineAnimation.prototype = Object.create(PIXI.spine.Spine.prototype);
SpineAnimation.prototype.constructor = SpineAnimation;
SpineAnimation.prototype.initialize = function (skeleton_name) {

    PIXI.spine.Spine.call(this, ContentManager.spine[skeleton_name].spineData);

    this.current_animation = '';
    this.current_loop = true;
    this.current_flipped = false;
    this.callback =  function () {
    };
    
};



SpineAnimation.prototype.play = function (animation_name, loop, flipped, callback) {
//    var that = this;
//
//    this.set_scale(this.scale_x);
//
    loop = (typeof loop == "undefined") ? true : loop;
    flipped = flipped || false;

    this.current_animation = animation_name;
    this.current_loop = loop;
    this.current_flipped = flipped;
    this.callback = callback || function () {
    };

 //  this.skeleton.setBonesToSetupPose();
    this.state.setAnimationByName(0, animation_name, loop);
    this.skeleton.flipX = flipped;
    
    var that = this;

    if (callback) {

        this.state.onComplete = function (i, count) {
            that.callback();
            that.state.onComplete = null;

        };
    }

 //   this.state.apply(this.skeleton);
 //   this.skeleton.updateWorldTransform();

};

SpineAnimation.prototype.set_animation_scale = function (scale) {
    this.animation_scale = scale;
    
    this.scale.x = scale;
    this.scale.y = scale;

//    var json = new PIXI.spine.SpineRuntime.SkeletonJsonParser(new PIXI.spine.SpineRuntime.AtlasAttachmentParser(this.ddata.spineAtlas));
//    json.scale = scale;
//    this.skeletonData = json.readSkeletonData(this.ddata.spineData);
//
//    this.skeleton = new PIXI.spine.Skeleton(this.skeletonData);
//    this.skeleton.x = this.get_position().x;
//    this.skeleton.y = this.get_position().y;
//    this.skeleton.updateWorldTransform();
//
//    if (this.skeleton.data.skins.length > 0) {
//        this.skeleton.setSkin(this.skeleton.data.skins[0]);
//    }
//
//    this.stateData = new PIXI.spine.AnimationStateData(this.skeletonData);
//    this.state = new PIXI.spine.AnimationState(this.stateData);
//
//    this.state.onEvent = this.on_event.bind(this);
};

SpineAnimation.prototype.set_position = function (x, y) {
    this.position.x = x;
    this.position.y = y;
};

SpineAnimation.prototype.set_anchor = function (x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
};

SpineAnimation.prototype.rotate_to = function (angle) {
    this.rotation = angle;
};

SpineAnimation.prototype.rotate = function (angle) {
    this.rotation = angle;
};

SpineAnimation.prototype.set_alpha = function (alpha) {
    this.alpha = alpha;
};

SpineAnimation.prototype.set_scale = function (scale) {
    this.scale.x = scale;
    this.scale.y = scale;
};

SpineAnimation.prototype.set_scale_x = function (x) {
    this.scale.x = x;
};

SpineAnimation.prototype.set_scale_y = function (y) {
    this.scale.y = y;
};

window.SpineAnimation = SpineAnimation;

//}(window));