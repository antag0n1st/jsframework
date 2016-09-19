(function (window) {

    function Stage(dom_id) {
        this.initialize(dom_id);
    }

    Stage.prototype = Object.create(PIXI.Container.prototype);
    Stage.prototype.constructor = Stage;

    Stage.prototype.initialize = function (dom_id) {

        PIXI.Container.call(this);

        this.is_children_sortable = true;

        this.draw_calls = 0;
        this.iterator = 0;
        this.debug_layer = new PIXI.Graphics();
        this.debug_layer.z_index = 999999999999;
        this.addChild(this.debug_layer);

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
        
        var resolution = 1;
       
        
        this.renderer = PIXI.autoDetectRenderer(Config.screen_width, Config.screen_height, {
            view: this.canvas,
            backgroundColor: Config.background_color ,          
            clearBeforeRender: Config.should_clear_stage,
            preserveDrawingBuffer: !Config.should_clear_stage,
            resolution:resolution
        });
        
        this.canvas.style.width = Config.canvas_width + "px";
        this.canvas.style.height = Config.canvas_height + "px";

        if (Config.window_mode === Config.MODE_FLEXIBLE_HEIGHT_CENTERED) {
            if (Config.window_width > Config.game_width) {            
                this.canvas.style.left = Math.round(((Config.window_width / 2) - Config.canvas_width / 2)) + "px";
            }
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

    Stage.prototype.sort_strategy = function (a, b) {
        return a.z_index > b.z_index;
    };

    Stage.prototype.sort_objects = function (objects) {
        Math.insertionSort(objects, this.sort_strategy);
    };

    window.Stage = Stage;

}(window));