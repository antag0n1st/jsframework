(function(window) {

    function Stage(dom_id) {
        this.initialize(dom_id);
    }

    Stage.prototype.initialize = function(dom_id) {

        this.children = [];
        this.layers = [];
        this.non_children = [];
        this.containers = [];
        this.is_children_sortable = true;
        this.position = {x: 0, y: 0};
        this.width = Config.screen_width;
        this.height = Config.screen_height;
        this.draw_calls = 0;
        this.iterator = 0;

        var canvas = window.document.getElementById('stage');

        this.context = canvas.getContext('2d');

        if (Config.is_low_resolution) {
            this.context.canvas.width = Config.screen_width / 2;
            this.context.canvas.height = Config.screen_height / 2;
        } else {
            this.context.canvas.width = Config.screen_width;
            this.context.canvas.height = Config.screen_height;
        }

        canvas.style.width = Config.window_width + "px";
        canvas.style.height = Config.window_height + "px";


    };

    Stage.prototype.add = function(o) {
        o.parent = this;
        o.on_added_to_parent(this);
        this.children.push(o);
        this.sort_objects(this.children);
    };

    Stage.prototype.clear = function() {


    };

    Stage.prototype.remove = function(o) {
        var index = this.children.indexOf(o);
        if (index !== -1) {
            o.on_remove_from_parent(this);
            this.children.splice(index, 1);
        }
    };

// usefull for updating the stage outside the ticker
    Stage.prototype.update = function() {
        this.tick();
    };

    Stage.prototype.draw = function() {
       // this.tick();
    };

    Stage.prototype.tick = function() {
        this.draw_objects = 0;
       // log("-----------");
        this.draw_children(this.children, this.context, this);       
      
    };

    Stage.prototype.draw_children = function(children, context, parent) {

        if (parent.is_children_sortable) {
            this.sort_objects(children);           
        }

        for (var i=0;i<children.length;i++) {
            
            var child = children[i];
            if(!child.is_visible){
                continue;
            }
            child.draw(context);
            this.draw_objects++;
            this.draw_children(child.get_children(), context, child);
            child.on_draw_finished(context);
        }
        
    };
    
    Stage.prototype.on_draw_finished = function(context){
        
    };

    Stage.prototype.sort_strategy = function(a, b) {
        return a.z_index > b.z_index;
    };

    Stage.prototype.sort_objects = function(objects) {
        // Math.bubble_sort(objects, this.sort_strategy);
        Math.insertionSort(objects, this.sort_strategy);
    };

    Stage.prototype.clear_canvas = function() {

        if(Config.should_clear_stage){
            this.context.clearRect(0, 0, Config.screen_width, Config.screen_height);
            this.clear_children(this.children, this.context);
        }        
        
    };

    Stage.prototype.clear_children = function(children, context) {
        
        return false;

        // then clear the rest of the canvas        
        var i = children.length;
        while (i--) {
            var child = children[i];
            children[i].clear(context);
            this.clear_children(child.get_children(), context);
        }

    };

    Stage.prototype.remove_children = function(parent) {

        var children = parent.get_children();
        var i = children.length;
        while (i--) {
            var child = children[i];
            child.on_remove_from_parent(parent);
            this.remove_children(child);
        }

    };

    Stage.prototype.remove_child = function(child) {
        this.remove(child);
    };

    Stage.prototype.get_position = function() {
        return this.position;
    };
    
    Stage.prototype.get_parent = function(){
        return null;
    };

// -------------------------------------------------------------
// --------------------------------------------------------------

    Stage.prototype.debug_grid = function() {
return;
        this.context.save();

        this.context.fillStyle = "#206838";
        this.context.beginPath();
        this.context.rect(0, 0, Config.screen_width, Config.screen_height);
        this.context.fill();
        this.context.closePath();

        this.context.strokeStyle = "#fff";
        this.context.lineWidth = 1;
        this.context.globalAlpha = 0.2;

        var x = Config.height_in_tiles;
        var y = Config.width_in_tiles;
        var tile_width = Config.tile_width;
        var tile_height = Config.tile_height;

        // draw verticals first

        this.context.beginPath();

        for (var i = 0; i < y; i++) {
            // console.log(y);
            this.context.moveTo((tile_width * i), 0);
            this.context.lineTo((tile_width * i), Config.screen_height);
        }

        for (var i = 0; i < x; i++) {
            //console.log(y_offset);
            this.context.moveTo(0, (tile_height * i));
            this.context.lineTo(Config.screen_width, (tile_height * i));
        }

        this.context.stroke();
        this.context.closePath();

        this.context.globalAlpha = 1.0;

        this.context.restore();


    };


    window.Stage = Stage;

}(window));