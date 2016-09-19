//(function(window, undefined) {


    function TableCell() {

        this.initialize();

    }

    TableCell.prototype = new Drawable();
    TableCell.prototype.drawableInitialize = Drawable.prototype.initialize;
    

    TableCell.prototype.initialize = function() {

        this.drawableInitialize();

        this.height = 100;
        this.index = 0;
        this.is_selected = false;

        this.tapped_location = {x:0,y:0};

    };

    TableCell.prototype.on_mouse_move = function(event) {
        
        var distance = Math.get_distance(this.tapped_location,event.point);
      
        if(distance > this.get_parent().tolerance_distance){
            this.resign_event_to_parent(event, 'on_mouse_down');
        }
                
    };

    TableCell.prototype.on_mouse_down = function(event) {
        var parent = this.get_parent();
        this.tapped_location = event.point;
               
        if (parent.scrolling_speed != 0.0) {
            parent.stop_scrolling();
            this.resign_event_to_parent(event, 'on_mouse_down');
        }
    };

    TableCell.prototype.on_mouse_up = function(event) {
        var parent = this.get_parent();

        if (parent.scrolling_speed != 0.0) {
            
            parent.stop_scrolling();
        } else {
            //this.is_selected = true;
            parent.on_cell_selected(this, event);
        }


    };

    TableCell.prototype.on_added_to_parent = function(parent) {
        Drawable.prototype.on_added_to_parent.call(this);
        game.input.add(this);
    };

    TableCell.prototype.on_remove_from_parent = function(parent) {
        Drawable.prototype.on_remove_from_parent.call(this);
        game.input.remove(this);
    };

    TableCell.prototype.draw = function(ctx) {
        throw "cell should implement its own draw method";
    };

    TableCell.prototype.clear = function(ctx) {
        throw "cell should implement its own clear method";
    };

    TableCell.prototype.bind_data = function(data) {
        throw "cell should implement its own bind data method";
    };

//    window.TableCell = TableCell;
//
//
//}(window));