(function (window, undefined) {

    function SpineAnimation(skeleton_name) {
        if (skeleton_name) {
            this.initialize(skeleton_name);
        }
    }

    SpineAnimation.prototype = Object.create(PIXI.spine.Spine.prototype);
    SpineAnimation.TYPE = UID.numbering();
    SpineAnimation.prototype.constructor = SpineAnimation;
    SpineAnimation.prototype.initialize = function (skeleton_name) {

        PIXI.spine.Spine.call(this, ContentManager.spine[skeleton_name].spineData);
        this.extend([Drawable]);
        this._super.initialize();
        this.TYPE = SpineAnimation.TYPE;
        this.autoUpdate = false;

        this.current_animation = '';
        this.current_loop = true;
        this.current_flipped = false;
        this.callback = function () {
        };

        this.state.onEvent = this.on_event.bind(this);

    };


    SpineAnimation.prototype.on_event = function (i, event) {
    };

    SpineAnimation.prototype.update = function (dt) {
        Drawable.prototype.update.call(this, dt);
        PIXI.spine.Spine.prototype.update.call(this, dt / 1000);
        PIXI.Container.prototype.updateTransform.call(this);
    };

    SpineAnimation.prototype.play = function (animation_name, loop, flipped, callback) {

        loop = (typeof loop == "undefined") ? true : loop;
        flipped = flipped || false;

        this.current_animation = animation_name;
        this.current_loop = loop;
        this.current_flipped = flipped;
        this.callback = callback || function () {
        };

        this.state.setAnimationByName(0, animation_name, loop);
        this.skeleton.flipX = flipped;

        var that = this;

        if (callback) {

            this.state.onComplete = function (i, count) {
                that.callback();
                that.state.onComplete = null;

            };
        }

    };

    SpineAnimation.prototype.set_animation_scale = function (scale) {
        this.animation_scale = scale;

        var b = this.spineData.findBone('root');
        b.scaleX = 0.5;
        b.scaleY = 0.5;

    };

    SpineAnimation.prototype.get_bounding_box_by_name = function (slot_name, box_name, bone_name) {

        var bounding_box = this.skeleton.getAttachmentBySlotName(slot_name, box_name);
        var vertices = [];
        var pos = this.bounds.pos;
        var bone = this.skeleton.findBone(bone_name);

        bounding_box.computeWorldVertices(pos.x, pos.y, bone, vertices);

        var v = [];
        var point0 = new V();

        for (var i = 0; i < vertices.length; i++) {

            if (i % 2 === 1) {
                var point = new V(vertices[i - 1], vertices[i]);

                if (i === 1) {
                    point0.copy(point);
                }

                point.sub(point0);

                v.push(point);
            }
        }

        return new Polygon(new V().copy(point0), v);
    };

    window.SpineAnimation = SpineAnimation;

}(window));