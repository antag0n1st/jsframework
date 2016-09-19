//(function(window, undefined) {

function Sprite(image_name) {
    if (image_name) {
        this.initialize(image_name);
    }
}

Sprite.prototype = new Drawable();
Sprite.prototype.drawable_initialize = Sprite.prototype.initialize;
Sprite.prototype.initialize = function (image_name) {
    this.drawable_initialize();

    if (image_name) {
        this.image_name = image_name;
       
        this.image = Images[image_name].image;
        if (Config.is_low_resolution) {
            this.set_size(this.image.width * 2, this.image.height * 2);
        } else {
            this.set_size(this.image.width, this.image.height);
        }
    } else {
        this.image_name = "";
        this.image = null;
        this.set_size(0, 0);
    }

};

Sprite.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

Sprite.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

Sprite.prototype.on_draw = function (context,x,y) {
};

Sprite.prototype.draw = function (context) {

    var w = this.width;
    var h = this.height;
    var anchor = this.bounds.pos.clone();
    var ach = this.get_anchor();
    var pos = SAT.pool.get();

    if (Config.is_low_resolution) {
        w = w / 2;
        h = h / 2;
        pos.x = pos.x / 2;
        pos.y = pos.y / 2;
        anchor.x = anchor.x / 2;
        anchor.y = anchor.y / 2;
    }

    pos.x = anchor.x + (-w * ach.x);
    pos.y = anchor.y + (-h * ach.y);

    if (this.is_visible) {

        this._alpha = context.globalAlpha;

        if (this.angle !== 0) {
            context.save();
            context.translate(Math.round(anchor.x), Math.round(anchor.y));
            context.rotate(this.angle);

            pos.x = -w * ach.x;
            pos.y = -h * ach.y;
        }

        if (this.alpha !== 1) {
            context.globalAlpha = context.globalAlpha * this.alpha;
        }

        var new_width = w * this.scale_x;
        var new_height = h * this.scale_y;
        
        if (this.image && w && h) { // if it has dimensions            
            context.drawImage(this.image,
                    0,
                    0,
                    w,
                    h,
                    pos.x - ach.x * (new_width - w),
                    pos.y - ach.y * (new_height - h),
                    new_width,
                    new_height);
                    
                    this.on_draw(context,pos.x - ach.x * (new_width - w),pos.y - ach.y * (new_height - h));
        }

        if (this.angle !== 0) {
            context.restore();
        }

    }

    if (Config.debug) {
        this.debug_bounds(context);
    }

};

Sprite.prototype.on_draw_finished = function (context) {
    context.globalAlpha = this._alpha;
};


Sprite.prototype.clear = function (context) {
};

window.Sprite = Sprite;

//}(window));