//(function(window, undefined) {

function SpineAnimation(skeleton_name) {
    if (skeleton_name) {
        this.initialize(skeleton_name);
    }
}

SpineAnimation.prototype = new Drawable();
SpineAnimation.prototype.drawable_initialize = SpineAnimation.prototype.initialize;
SpineAnimation.prototype.initialize = function(skeleton_name) {

    this.drawable_initialize();
    this.skeleton_name = skeleton_name;
    
    if(Images[this.skeleton_name] === undefined){
        throw 'there is no such animation named: '+this.skeleton_name;
    }

    this.image = Images[this.skeleton_name].image;
    this.set_size(this.image.width, this.image.height);

    this.atlas = new spine.Atlas(ContentManager.atlases[this.skeleton_name], {
        load: function(page, path, atlas) {
        },
        unload: function(texture) {
            texture.destroy();
        }
    });

    spine.Bone.yDown = true;

    var json = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(this.atlas));
    if(Config.is_low_resolution){
        json.scale = 0.5;
    }
    this.skeletonData = json.readSkeletonData(ContentManager.skeletons[this.skeleton_name]);
    
    

    this.skeleton = new spine.Skeleton(this.skeletonData);
    this.skeleton.x = 0;
    this.skeleton.y = 0;
    this.skeleton.updateWorldTransform();
        
    if(this.skeleton.data.skins.length > 0){
        this.skeleton.setSkin(this.skeleton.data.skins[0]);
    }

    this.stateData = new spine.AnimationStateData(this.skeletonData);
    this.state = new spine.AnimationState(this.stateData);

    this.state.onEvent = this.on_event.bind(this);
    
    this.current_animation = '';
    this.current_loop = true;
    this.current_flipped = false;
    this.callback = function(){};

};

SpineAnimation.prototype.on_event = function(trackIndex, event){
  
};

SpineAnimation.prototype.set_skin = function(skin_name){
    this.skeleton.skin = null;
    this.skeleton.setSlotsToSetupPose();
    this.skeleton.setSkinByName(skin_name);    
};

SpineAnimation.prototype.update_image = function(slot_name,image_name){    
    this.skeleton.setAttachment(slot_name,image_name);
};

SpineAnimation.prototype.stop = function(){
    this.current_animation = '';
    this.callback();
};

SpineAnimation.prototype.play = function(animation_name, loop, flipped, callback) {
    var that = this;
    
    loop = (loop === undefined) ? true : loop;
    flipped = flipped || false;
    
    this.current_animation = animation_name;
    this.current_loop = loop;
    this.current_flipped = flipped;
    this.callback = callback || function(){};

    this.skeleton.setBonesToSetupPose();
    this.state.setAnimationByName(0, animation_name, loop);
    this.skeleton.flipX = flipped;
    

    if (flipped) {
        this.image = Images[this.skeleton_name + '_fliped'].image;
    } else {
        this.image = Images[this.skeleton_name].image;
    }

    if (callback) {
        this.state.onComplete = function(i, count) {
            that.callback();
            that.state.onComplete = null;

        };
    }
    
    this.set_scale(this.scale_x);
    
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();
    
};

SpineAnimation.prototype.set_position = function(x, y) {
    Drawable.prototype.set_position.call(this, x, y);
    this.skeleton.x = this.bounds.pos.x;
    this.skeleton.y = this.bounds.pos.y;
};

SpineAnimation.prototype.set_bounds_position = function(x, y) {
    Drawable.prototype.set_bounds_position.call(this, x, y);
    this.skeleton.x = this.bounds.pos.x;
    this.skeleton.y = this.bounds.pos.y;
};

SpineAnimation.prototype.set_scale = function(scale) {

    Drawable.prototype.set_scale.call(this, scale);

    var root = this.skeleton.getRootBone();
    root.scaleX = scale;
    root.scaleY = scale;

};

SpineAnimation.prototype.on_added_to_parent = function(parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);
};

SpineAnimation.prototype.on_remove_from_parent = function(parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);
};

SpineAnimation.prototype.draw = function(context) {
    
    
   // context.drawImage(this.image,0,0);

    var drawOrder = this.skeleton.drawOrder;
    var vertices = [];
    for (var i = 0, n = drawOrder.length; i < n; i++) {
        var slot = drawOrder[i];
        var attachment = slot.attachment;
        if (!(attachment instanceof spine.RegionAttachment))
            continue;
if(Config.is_low_resolution){
    attachment.computeVertices(this.skeleton.x/2, this.skeleton.y/2, slot.bone, vertices);
}else{
    attachment.computeVertices(this.skeleton.x, this.skeleton.y, slot.bone, vertices);
}
        

        // do math to find what we need.

        var v1 = SAT.pool.get();
        v1.x = vertices[2];
        v1.y = vertices[3];

        var v2 = SAT.pool.get();
        v2.x = vertices[4];
        v2.y = vertices[5];

        if (this.skeleton.flipX) {

            v1.x = vertices[4];
            v1.y = vertices[5];

            v2.x = vertices[2];
            v2.y = vertices[3];
        }

        var angle = Math.get_angle(v1, v2);


        


//        if (Config.debug) {
//
//            context.fillStyle = '#f00';
//            context.beginPath();
//            context.moveTo(vertices[0], vertices[1]);
//            context.lineTo(vertices[2], vertices[3]);
//
//            context.lineTo(vertices[4], vertices[5]);
//            context.lineTo(vertices[6], vertices[7]);
//            context.closePath();
//            context.stroke();
//        }


        this.draw_fragment(context, slot, v1, angle);


    }

    if (Config.debug) {
        this.debug_bounds(context);

    }

};

SpineAnimation.prototype.update = function(dt) {

    this.state.update(dt / 1000);
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();

};

SpineAnimation.prototype.draw_fragment = function(context, slot, point, angle) {

    var w = slot.attachment.width;
    var h = slot.attachment.height;
    
    var l_scale_x = slot.bone.scaleX;
    var l_scale_y = slot.bone.scaleY;
    

    var ach = SAT.pool.get();
    ach.x = w / 2;
    ach.y = h / 2;
    ach.rotate(angle);



   

    point.add(ach);


    var apos = point;
    
    

    if (this.is_visible) {

        this._alpha = context.globalAlpha;


        context.save();

      

        apos.sub(ach);

       
        context.translate(apos.x, apos.y);
        context.rotate(angle);
        
        

        if (slot.a !== 1) {
            context.globalAlpha = context.globalAlpha * slot.a;
        }

        var new_width = w * this.scale_x*l_scale_x;
        var new_height = h * this.scale_y*l_scale_y;
        
        slot.attachment.rendererObject;
        
        
        
        var regionX = slot.attachment.rendererObject.x;
        var regionY = slot.attachment.rendererObject.y;
        
        if(Config.is_low_resolution){
            regionX = regionX/2;
            regionY = regionY/2;
        }

        if (this.skeleton.flipX) {
            regionX = this.image.width - regionX - w;
        }

        context.drawImage(this.image,
                regionX,
                regionY,
                w,
                h,
                0,
                0,
                new_width,
                new_height);

        context.restore();


    }



};


SpineAnimation.prototype.on_draw_finished = function(context) {
    context.globalAlpha = this._alpha;
};


SpineAnimation.prototype.clear = function(context) {
};

window.SpineAnimation = SpineAnimation;

//}(window));