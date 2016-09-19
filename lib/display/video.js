(function (window, undefined) {

    function Video(name) {
        this.initialize(name);
    }

    Video.prototype = Object.create(PIXI.Sprite.prototype);
    Video.TYPE = UID.numbering();
    Video.prototype.constructor = Video;

    Video.prototype.initialize = function (name) {

        PIXI.Sprite.call(this, PIXI.Texture.EMPTY);
        this.texture = PIXI.Texture.fromVideo(ContentManager.base_url + 'assets/videos/' + name);

        this.extend([Drawable]);
        this.TYPE = Video.TYPE;

        this.is_auto_play = false;
        this.is_playing = false;

        var that = this;
        this.texture.baseTexture.on('loaded', function (data) {
            that.on_loaded(data);
        });

    };

    Video.prototype.on_loaded = function (data) {

        if (!this.is_auto_play) {
            this.pause();
        } else {
            this.is_playing = true;
        }

        var sx = this.scale.x;
        var sy = this.scale.y;

        this.set_scale(1);
        this.set_size(this.width, this.height);

        this.set_scale_x(sx);
        this.set_scale_y(sy);

        var that = this;
        this.texture.baseTexture.source.addEventListener('ended', function (event) {
            that.is_playing = false;
            that.on_end(event);
        }, false);

    };

    Video.prototype.on_end = function (event) {

    };

    Video.prototype.play = function () {
        if (this.texture.baseTexture.source) {
            this.is_playing = true;
            this.texture.baseTexture.source.play();
        }
    };

    Video.prototype.pause = function () {
        if (this.texture.baseTexture.source) {
            this.is_playing = false;
            this.texture.baseTexture.source.pause();
        }
    };
    
    Video.prototype.stop = function(){
        this.pause();
    };

    window.Video = Video;

}(window));