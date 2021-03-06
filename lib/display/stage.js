(function (window) {

    function Stage(device) {
        this.initialize(device);
    }

    Stage.prototype = Object.create(PIXI.Container.prototype);
    Stage.prototype.constructor = Stage;

    Stage.prototype.initialize = function (device) {

        PIXI.Container.call(this);

        this.debug_layer = new PIXI.Graphics();
        this.debug_layer.z_index = 999999999999;
        this.addChild(this.debug_layer);

        var canvas_element = document.getElementById('stage');

        if (canvas_element) {
            this.canvas = canvas_element;
        } else {
            var canvas_content = '<h1>Your browser does not appear to support HTML5.  Try upgrading your browser to the latest version.  <a href="http://www.whatbrowser.org">What is a browser?</a>';
            canvas_content += '<br/><br/><a href="http://www.microsoft.com/windows/internet-explorer/default.aspx">Microsoft Internet Explorer</a><br/>';
            canvas_content += '<a href="http://www.mozilla.com/firefox/">Mozilla Firefox</a><br/>';
            canvas_content += '<a href="http://www.google.com/chrome/">Google Chrome</a><br/>';
            canvas_content += '<a href="http://www.apple.com/safari/download/">Apple Safari</a><br/>';
            canvas_content += '<a href="http://www.google.com/chromeframe">Google Chrome Frame for Internet Explorer</a><br/></h1>';

            this.canvas = document.createElement('canvas');
            this.canvas.id = 'stage';
            this.canvas.innerHTML = canvas_content;
            document.body.appendChild(this.canvas);
        }

        var resolution = 1;
        var useCanvas = false;
        
        if(device.is_ie){
            useCanvas = true;
        }
        
        var settings = {
            view: this.canvas,
            clearBeforeRender: Config.should_clear_stage,
            preserveDrawingBuffer: !Config.should_clear_stage,
            resolution: resolution
        };
        
        if(Config.background_color){
            settings.backgroundColor = Config.background_color;
        } else {
            settings.transparent = true;
        }

        this.renderer = PIXI.autoDetectRenderer(Config.screen_width, Config.screen_height,settings,useCanvas);

        if (Config.window_mode !== Config.MODE_NONE) {
            this.canvas.style.width = Config.canvas_width + "px";
            this.canvas.style.height = Config.canvas_height + "px";
        }
        
        if (Config.window_mode === Config.MODE_CENTERED) {
            this.adjust_canvas_position(this.renderer.view);
        }
    };

    Stage.prototype.add = function (o) {
        this.addChild(o);
        o.on_added_to_parent(this);
        this.sort_objects(this.children);
    };

    Stage.prototype.remove_child = function (o) {
        this.removeChild(o);
        o.on_remove_from_parent(this);
    };

    Stage.prototype.update = function () {
        if (Config.freeze > 0) {
            Config.freeze -= Ticker.step;
        } else {
            this.renderer.render(this);
            if (Config.debug) {
                this.debug_layer.clear();
            }
        }
    };

    Stage.prototype.get_position = function () {
        return new V();
    };

    Stage.prototype.sort_objects = function (objects) {
        Math.insertionSort(objects, this.compare_method);
    };
    
    Stage.prototype.compare_method = function (a, b) {
        return a.z_index > b.z_index;
    };

    Stage.prototype.adjust_canvas_position = function (canvas) {

        var x = Config.window_width - Config.canvas_width;
        var y = Config.window_height - Config.canvas_height;

        this.canvas.style.marginLeft = Math.ceil(x / 2) + "px";
        this.canvas.style.marginTop = Math.ceil(y / 2) + "px";

    };

    window.Stage = Stage;

}(window));