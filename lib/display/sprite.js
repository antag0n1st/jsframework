//(function(window, undefined) {

function Sprite(image_name) {
    if (image_name) {
        this.initialize(image_name);
    }
}

Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;
Sprite.prototype.initialize = function (image_name) {

    if (Images[image_name]) {
        PIXI.Sprite.call(this, Images[image_name].texture);
    } else if (image_name) {
        var texture = PIXI.Texture.fromFrame(image_name);
        PIXI.Sprite.call(this, texture);
    } else {
        PIXI.Sprite.call(this);
    }

    this.extend([Drawable]);
    
    this.set_size(this.width,this.height);
    
};

Sprite.prototype.update = function (dt) {
    if (Config.debug && game.stage.debug_layer) {
       
       var b = this.bounds;
       var p = this.bounds.pos;

        
        var path = [];
        for(var i=0;i<b.points.length;i++){
            path.push(new PIXI.Point(p.x + b.points[i].x,p.y + b.points[i].y));
        }
        
        game.stage.debug_layer.beginFill(0x000000, 0);
        game.stage.debug_layer.lineStyle(1, 0x000000,1);
        game.stage.debug_layer.drawPolygon(path);
        
        game.stage.debug_layer.beginFill(0xFFFF00, 1);
        game.stage.debug_layer.lineStyle(1, 0xFFFF00,0);        
        game.stage.debug_layer.drawCircle(p.x,p.y,3);
      //  game.stage.debug_layer.drawRect(b.pos.x, b.pos.y, this.width, this.height);
    }
};

window.Sprite = Sprite;

//}(window));