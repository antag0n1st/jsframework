//(function(window,undefined){

function GameScreen() {
    this.initialize();
}

GameScreen.prototype = new HScreen();
GameScreen.prototype.screen_initialize = GameScreen.prototype.initialize;
GameScreen.prototype.initialize = function () {
    this.screen_initialize();

    this.knight = new SpineAnimation('knight');
    this.knight.set_position(100,100);
    this.knight.play('idle', true, true);

    this.add_child(this.knight);

    knight = this.knight;

//    var confs = [{
//            atlas_name: 'spider_atlas',
//            animations: {
//                spider_idle: {frames: 25, duration: 2000, ax: 0.5, ay: 1, w: 0.5, h: 0.8},
//                spider_run: {frames: 8, duration: 360, ax: 0.5, ay: 1, w: 0.5, h: 0.8},
//                spider_attack: {frames: 11, duration: 500, ax: 0.5, ay: 1, w: 0.5, h: 0.8},
//                spider_demage: {frames: 9, duration: 500, ax: 0.5, ay: 1, w: 0.5, h: 0.8},
//            }
//        }
//    ];
//
//    spider = new AtlasAnimation(confs);
//    spider.set_position(400, 200);
//    spider.set_anchor(0.5, 1);
//    spider.play('spider_idle');
//    this.add_child(spider);

    var conf = {
        texture: Images.flames.texture,
        frames: {x: 4, y: 5},
        animations: {
            burn: {start: 0, end: 19, loop: true, duration: 1800}
        },
        reg: {x: 1, y: 0.6, width: 0.7, height: 0.5}
    };
    
    flames = new SpriteAnimation(conf);
    flames.set_position(400,200);
    flames.play('burn',true);
    this.add_child(flames);

};

GameScreen.prototype.show = function () {
    HScreen.prototype.show.call(this);

};

GameScreen.prototype.hide = function () {
    HScreen.prototype.hide.call(this);

};

GameScreen.prototype.update = function () {
    HScreen.prototype.update.call(this);

};

GameScreen.prototype.on_added_to_parent = function (parent) {
    HScreen.prototype.on_added_to_parent.call(this, parent);

};

GameScreen.prototype.on_remove_from_parent = function (parent) {
    HScreen.prototype.on_remove_from_parent.call(this, parent);

};


//    window.GameScreen = GameScreen;

//}(window));