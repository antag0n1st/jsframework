(function (window, undefined) {

    function ScrollView() {
        this.initialize();
    }
    ScrollView.prototype = new Sprite();
    ScrollView.TYPE = UID.numbering();
    ScrollView.prototype.sprite_initialize = ScrollView.prototype.initialize;

    ScrollView.prototype.initialize = function () {
        this.sprite_initialize();
        this.TYPE = ScrollView.TYPE;

        this.content_width = 0;
        this.content_height = 0;

        this.content = new ScrollviewContent();
        this.addChild(this.content);
        this.content.on_added_to_parent(this);
        var position = this.content.get_absolute_position();
        this.content.set_bounds_position(position);
        this.content.iterate_children();

        this.scrolling_speed = new V();

        this.last_scroll_position = new V();
        this.current_scroll_position = new V();

        this.star_scroll_position = new V();

        this.prev_x = 0;
        this.prev_y = 0;

        this.priority = 11; // 1 above the button

        this._has_scrolled = false;

    };

    ScrollView.prototype.scroll_to_element = function (element, time) {

        var p = new V().copy(element.bounds.pos);
        var to = new V(Config.screen_width / 2, 2 * (Config.screen_height / 3));

        var diff_p = Vector.substruction(to, p);

        if (time > 0) {
            var that = this;
            var animate_to = Vector.addition(diff_p, this.current_scroll_position);
            var bezier = new Bezier(.48,.15,.52,.92); //  new Bezier(.16,.49,.4,.99)
         
            var t = new TweenMoveTo(this.content, animate_to,bezier, time, function (object) {
                that.current_scroll_position.copy(object.get_position());
                that.last_scroll_position.copy(that.current_scroll_position);
            });
            t.run();
        } else {
            this.scroll_by(diff_p.x, diff_p.y);
            this.last_scroll_position.copy(this.current_scroll_position);
        }

    };

    ScrollView.prototype.scroll_by = function (diff_x, diff_y) {

        var p = this.current_scroll_position;
        var x = p.x + diff_x;
        var y = p.y + diff_y;

        // constrain the movement

        var x_max = this.__width - this.content_width;
        if (x > 0 || x < x_max) {
            this.scrolling_speed.x = 0;
        }
        x = (x > 0) ? 0 : x;
        x = (x < x_max) ? x_max : x;

        var y_max = this.__height - this.content_height;
        if (y > 0 || y < y_max) {
            this.scrolling_speed.y = 0;
        }
        y = (y > 0) ? 0 : y;
        y = (y < y_max) ? y_max : y;

        this.content.set_position(x, y);

        this.current_scroll_position.x = x;
        this.current_scroll_position.y = y;
    };

    ScrollView.prototype.on_mouse_down = function (event) {
        this.prev_y = event.point.y;
        this.prev_x = event.point.x;
        this.star_scroll_position.copy(event.point);
        this._has_scrolled = false;
    };

    ScrollView.prototype.on_mouse_move = function (event) {

        // add tolerance 
        var d = Math.get_distance(this.star_scroll_position, event.point);
        
        if (d > 10) {
            var diff_x = -this.prev_x + event.point.x;
            var diff_y = -this.prev_y + event.point.y;

            this.scroll_by(diff_x, diff_y);

            this.prev_x = event.point.x;
            this.prev_y = event.point.y;
            this._has_scrolled = true;
        }

    };

    ScrollView.prototype.on_mouse_up = function (event) {
        if (this._has_scrolled) {
            event.stop_propagation();
        }
        this._has_scrolled = false;
    };

    ScrollView.prototype.on_mouse_cancel = function () {

    };

    ScrollView.prototype.update = function (dt) {

        var current_offset = Vector.substruction(this.current_scroll_position, this.last_scroll_position);

        if (current_offset.len() > 0) {
            this.scrolling_speed.x = (this.scrolling_speed.x + (current_offset.x / dt)) / 2;
            this.scrolling_speed.y = (this.scrolling_speed.y + (current_offset.y / dt)) / 2;
        }

        var speed = this.scrolling_speed.len();

        if (speed > 0.02) {
            if (!this.is_mouse_down) {
                this.scroll_by(this.scrolling_speed.x * dt, this.scrolling_speed.y * dt);
            }
            this.scrolling_speed.scale(0.9, 0.9);
        } else if (speed < 0.02) {
            this.scrolling_speed.x = 0;
            this.scrolling_speed.y = 0;
        }

        this.last_scroll_position.copy(this.current_scroll_position);

    };

    ScrollView.prototype.add_child = function () {
        throw "Don't add child content to the scroll view directly , use the content instead";
    };
    
    ScrollView.prototype.set_position = function (x,y) {
        Sprite.prototype.set_position.call(this,x,y);
        
        var mask = new PIXI.Graphics();  
        mask.beginFill();
        mask.drawRect(x,y,this.__width,this.__height);
        mask.endFill();
        this.mask = mask;
    };
    
    ScrollView.prototype.set_size = function (width,height) {
        Sprite.prototype.set_size.call(this,width,height);
        
        var mask = new PIXI.Graphics();
        var p = this.get_position();
        mask.beginFill();
        mask.drawRect(p.x,p.y,width,height);
        mask.endFill();
        this.mask = mask;
    };

    ScrollView.prototype.set_content_size = function (width, height) {
        this.content_width = width;
        this.content_height = height;
        this.content.set_size(width, height);
    };

    window.ScrollView = ScrollView;

}(window));