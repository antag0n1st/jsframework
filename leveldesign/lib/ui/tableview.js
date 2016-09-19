//(function(window, undefined) {


    function TableView() {

        this.initialize();

    }

    TableView.prototype = new Drawable();
    TableView.prototype.drawableInitialize = Drawable.prototype.initialize;

    TableView.prototype.initialize = function() {

        this.drawableInitialize();

        this.cell_type = TableCell;

        this.data = [];
        this.offset_y = 0;
        this.offset_x = 0;
        this.cells = [];
        this.cells_height = 0;
        this.number_of_cells_visible = 0;
        this.prev_y = 0;
        this.scrolling_speed = 0; // pixels per second
        this.friction = 0.05; // 5%
        this.prev_frame_y_offset = 0;
        this.is_children_sortable = false;
        this.is_scrollable = true;
        this.cell_index_selected = undefined;
        this.tolerance_distance = 5;
        this.tapped_location = {x:0,y:0};
        
        this.ready_counter = 100; // should draw the table instantly


        
        
        

    };
    
    TableView.prototype.on_mouse_down = function(event) {
        this.prev_y = event.point.y;
        this.tapped_location = event.point;
    };
    TableView.prototype.on_mouse_move = function(event) {
        
        var distance = Math.get_distance(this.tapped_location,event.point);
       
        var change = this.prev_y - event.point.y;
        this.prev_y = event.point.y;
        
        if(distance > this.tolerance_distance){
            this.scroll_y(change);
        }

        
    };
    
    
    TableView.prototype.on_added_to_parent = function(parent){
            Drawable.prototype.on_added_to_parent.call(this,parent); // call the parent method
            if(this.cells.length === 0){
               this.init_cells();
            }
            
            game.input.add(this);
    };
    
    TableView.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent); 
        game.input.remove(this);
    };

    TableView.prototype.set_cell_type = function(type) {
        this.cell_type = type;        
    };

    TableView.prototype.scroll_y = function(y) {
        
        if(!this.is_scrollable){
            this.offset_y = 0;
            return true;
        }
        
        if (this.offset_y + y < 0) {
            this.offset_y = 0;
            this.scrolling_speed = 0;
        } else if (this.offset_y + y >= this.data.length * this.cells_height - this.height) {
                this.offset_y = this.data.length * this.cells_height - this.height;  
                this.scrolling_speed = 0;
        } else {
            this.offset_y += y;
        }
    };

    TableView.prototype.init_cells = function() {

        if(this.width <=0 || this.height <=0){
            throw 'framework: table must have visible size';
        }
        
        if(!this.data.length){
            throw 'framework: table must have data';
        }

        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].remove_from_parent();
        }
        this.cells = [];

        var inspection_cell = new this.cell_type();
        this.cells_height = inspection_cell.height;
        
        if(this.cells_height * this.data.length <= this.height){
            this.number_of_cells_visible = this.data.length;
            this.is_scrollable = false;
        }else{
            this.number_of_cells_visible = Math.ceil((this.height / this.cells_height)) + 1;
        }

        
        for (var i = 0; i < this.number_of_cells_visible; i++) {
            var cell = new this.cell_type();
            cell.set_size({width: this.width, height: this.cells_height});
            this.cells.push(cell);
            this.add_child(cell);
        }
    };

    TableView.prototype.set_data = function(data) {
        this.data = data;
    };

    TableView.prototype.get_first_visible_cell_index = function() {
        return Math.floor(this.offset_y / this.cells_height);
    };

    TableView.prototype.stop_scrolling = function(){
        this.ready_counter = 0;
        this.scrolling_speed = 0;
        this.prev_frame_y_offset = this.offset_y;
       
    };

    TableView.prototype.draw = function(ctx) {

        if(!this.data.length){ return;}
        
        var current_offset = this.offset_y - this.prev_frame_y_offset;

        if (current_offset !== 0) {
            this.scrolling_speed = (this.scrolling_speed + (current_offset / Ticker.step)) / 2;
        }

        if (this.scrolling_speed > 0.02 || this.scrolling_speed < -0.02) {
 
        if(!this.is_mouse_down){
            this.scroll_y(this.scrolling_speed * Ticker.step);
        }
            
            this.scrolling_speed = this.scrolling_speed - this.scrolling_speed * this.friction;
 
        } else if(this.scrolling_speed < 0.02 && this.scrolling_speed > -0.02)  {
            this.scrolling_speed = 0.0;
        }

        this.prev_frame_y_offset = this.offset_y;

 
 
        ///////////////////

        var first_index = Math.floor(this.offset_y / this.cells_height);
        var local_offset_y = this.offset_y % this.cells_height;
        var pos = 0;
        
       // var cells_distance = 
 
        for (var i = first_index; i < first_index + this.number_of_cells_visible  ; i++) {
 
            var cell = this.cells[pos];
            
            
            cell.index = i;
            cell.set_position({x: 0, y: pos * this.cells_height - local_offset_y});
            if (i === this.data.length) {
                break;
            }
           
            cell.is_selected = false;
            if(cell.index === this.cell_index_selected){
                cell.is_selected = true;
            }
           
            cell.bind_data(this.data[i]);
           
            pos++;
        }




        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#77bb23";
        var bounds = this.bounds;
        ctx.rect(bounds.position.x, bounds.position.y, bounds.width, bounds.height);
        ctx.stroke();
        ctx.clip();
        ctx.closePath();
        //ctx.restore();

    };
    
    TableView.prototype.on_draw_finished = function(context){
        context.restore();
    };
    
    /**
     * 
     * @param TableCell cell
     * @param {type} point
     * @returns {undefined}
     */
    TableView.prototype.on_cell_selected = function(cell,event){
        this.cell_index_selected = cell.index;
        
    };
 
    TableView.prototype.clear = function(ctx){
 
    };


//    window.TableView = TableView;


//}(window));