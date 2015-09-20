(function(window) {

    function Stage(dom_id) {
        this.initialize(dom_id);
    }
    
    Stage.prototype = Object.create(PIXI.Container.prototype);
    Stage.prototype.constructor = Stage;

    Stage.prototype.initialize = function(dom_id) {
        
        PIXI.Container.call(this);

        this.is_children_sortable = true;

        this.draw_calls = 0;
        this.iterator = 0;
        
        
        var canvas_content = '<h1>Your browser does not appear to support HTML5.  Try upgrading your browser to the latest version.  <a href="http://www.whatbrowser.org">What is a browser?</a>';
        canvas_content += '<br/><br/><a href="http://www.microsoft.com/windows/internet-explorer/default.aspx">Microsoft Internet Explorer</a><br/>';
        canvas_content += '<a href="http://www.mozilla.com/firefox/">Mozilla Firefox</a><br/>';
        canvas_content += '<a href="http://www.google.com/chrome/">Google Chrome</a><br/>';
        canvas_content += '<a href="http://www.apple.com/safari/download/">Apple Safari</a><br/>';
        canvas_content += '<a href="http://www.google.com/chromeframe">Google Chrome Frame for Internet Explorer</a><br/></h1>';
        
        
        var canvas = document.createElement('canvas');
        canvas.id = 'stage';
        canvas.innerHTML = canvas_content;
        document.body.appendChild(canvas); 
        
        this.renderer = PIXI.autoDetectRenderer(Config.screen_width, Config.screen_height, {
            view:canvas,
            backgroundColor : 0xffffff
        }, false);
        
        canvas.style.width = Config.canvas_width + "px";
        canvas.style.height = Config.canvas_height + "px";
        
        if(Config.window_mode === Config.MODE_FLEXIBLE_HEIGHT_CENTERED){
            if(Config.window_width > Config.game_width) {
                // it should be placed in the center                
                canvas.style.left = ((Config.window_width / 2 ) - Config.canvas_width / 2)+"px";
            }
        }

    };

    Stage.prototype.add = function(o) {
        this.addChild(o);
    };

    Stage.prototype.clear = function() {


    };

    Stage.prototype.remove = function(o) {
//        var index = this.children.indexOf(o);
//        if (index !== -1) {
//            o.on_remove_from_parent(this);
//            this.children.splice(index, 1);
//        }
    };

// usefull for updating the stage outside the ticker
    Stage.prototype.update = function() {
        
        if(Config.freeze > 0){
            Config.freeze -= Ticker.step;
        } else {
            this.renderer.render(this);
        }       
        
    };

    Stage.prototype.sort_strategy = function(a, b) {
        return a.z_index > b.z_index;
    };

    Stage.prototype.sort_objects = function(objects) {
        // Math.bubble_sort(objects, this.sort_strategy);
        Math.insertionSort(objects, this.sort_strategy);
    };


// -------------------------------------------------------------
// --------------------------------------------------------------



    window.Stage = Stage;

}(window));