(function (window, undefined) {

    function TableCell() {
        this.initialize();
    }

    TableCell.prototype = new Sprite();
    TableCell.prototype.sprite_initialize = TableCell.prototype.initialize;
    TableCell.TYPE = UID.numbering();

    TableCell.prototype.initialize = function () {

        this.sprite_initialize();
        this.TYPE = TableCell.TYPE;
        this.index = 0;
        this.is_selected = false;
        this.set_size(100,100);
        this.tapped_location = {x: 0, y: 0};
        
        this.label = new Label();
        this.label.font_size = 30;
        this.label.font_color = "#ffffff";
        this.add_child(this.label);

    };

    TableCell.prototype.on_mouse_move = function (event) {

        var distance = Math.get_distance(this.tapped_location, event.point);

        if (distance > this.get_parent().tolerance_distance) {
            this.resign_event_to_parent(event, 'on_mouse_down');
        }

    };

    TableCell.prototype.on_mouse_down = function (event) {
        var parent = this.get_parent();
        this.tapped_location = event.point;

        if (parent.scrolling_speed != 0.0) {
            parent.stop_scrolling();
            this.resign_event_to_parent(event, 'on_mouse_down');
        }
    };

    TableCell.prototype.on_mouse_up = function (event) {
        var parent = this.get_parent();

        if (parent.scrolling_speed != 0.0) {
            parent.stop_scrolling();
        } else {
            //this.is_selected = true;
            parent.on_cell_selected(this, event);
        }
    };

    TableCell.prototype.on_added_to_parent = function (parent) {
        Sprite.prototype.on_added_to_parent.call(this);
        this.set_size(parent.__width,this.__height);
        //game.input.add(this);
    };

    TableCell.prototype.on_remove_from_parent = function (parent) {
        Sprite.prototype.on_remove_from_parent.call(this);
       // game.input.remove(this);
    };

    TableCell.prototype.bind_data = function (data) {
        this.label.txt = data.text;
       // throw "cell should implement its own bind data method";
    };

    window.TableCell = TableCell;


}(window));