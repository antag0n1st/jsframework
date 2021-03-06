(function (window, undefined) {

    function Input(device) {
        this.initialize(device);
    }

    Input.prototype.initialize = function (device) {

        this.point = {x: false, y: false};
        this.device = device;
        this.elements = [];
        this.offset = {top: 0, left: 0};
        this.element = null;

    };

    Input.prototype.add_listener = function (element_id) {

        var element = window.document.getElementById(element_id);

        this.offset = this.recursive_offset(element);
        this.element = element;

        if (this.device.is_touch && !this.device.is_mobile) {

            this.register_touch(element);
            this.register_mouse(element);

        } else if (this.device.is_touch) {
            this.register_touch(element);
        } else {
            this.register_mouse(element);
        }

    };

    Input.prototype.register_touch = function (element) {

        var that = this;

        element.addEventListener("touchmove", function (evt) {
            for (var i = 0; i < evt.changedTouches.length; i++) {
                that.map_touch_location(evt.changedTouches[i]);
                that.set_mouse_move(evt.changedTouches[i].identifier);
            }
            evt.preventDefault();
            evt.stopPropagation();
        }, false);

        element.addEventListener("touchend", function (evt) {
            for (var i = 0; i < evt.changedTouches.length; i++) {
                that.map_touch_location(evt.changedTouches[i]);
                that.set_mouse_up(evt.changedTouches[i].identifier);
            }
            evt.preventDefault();
            evt.stopPropagation();
        }, false);

        element.addEventListener("touchleave", function (evt) {
            for (var i = 0; i < evt.changedTouches.length; i++) {
                that.map_touch_location(evt.changedTouches[i]);
                that.set_mouse_up(evt.changedTouches[i].identifier);
            }
            evt.preventDefault();
            evt.stopPropagation();
        }, false);

        element.addEventListener("touchstart", function (evt) {

            for (var i = 0; i < evt.changedTouches.length; i++) {
                that.map_touch_location(evt.changedTouches[i]);
                that.set_mouse_down(evt.changedTouches[i].identifier);
            }
            evt.preventDefault();
            evt.stopPropagation();
        }, false);

        element.addEventListener("touchcancel", function (evt) {
            for (var i = 0; i < evt.changedTouches.length; i++) {
                that.set_mouse_cancel(evt.changedTouches[i].identifier);
            }
            evt.preventDefault();
            evt.stopPropagation();
        }, false);

    };

    Input.prototype.register_mouse = function (element) {

        var that = this;


        element.addEventListener('mouseup', function (event) {

            that.fixWhich(event);

            var posx = 0;
            var posy = 0;
            if (!event)
                event = window.event;
            if (event.pageX || event.pageY) {
                posx = event.offsetX ? (event.offsetX) : event.layerX;
                posy = event.offsetY ? (event.offsetY) : event.layerY;

            } else if (event.clientX || event.clientY) {
                posx = event.clientX + document.body.scrollLeft
                        + document.documentElement.scrollLeft;
                posy = event.clientY + document.body.scrollTop
                        + document.documentElement.scrollTop;
            }

            that.map_point_location(posx, posy);

            if (event.which === 1) {
                that.set_mouse_up(1);
            } else {
                that.set_right_mouse_up();
            }

        }, false);


        element.addEventListener('mouseleave', function (event) {

            that.fixWhich(event);

            var posx = 0;
            var posy = 0;
            if (!event)
                event = window.event;
            if (event.pageX || event.pageY) {
                posx = event.offsetX ? (event.offsetX) : event.layerX;
                posy = event.offsetY ? (event.offsetY) : event.layerY;

            } else if (event.clientX || event.clientY) {
                posx = event.clientX + document.body.scrollLeft
                        + document.documentElement.scrollLeft;
                posy = event.clientY + document.body.scrollTop
                        + document.documentElement.scrollTop;
            }

            that.map_point_location(posx, posy);

            if (event.which === 1) {
                that.set_mouse_cancel(1);
            } else {
                that.set_right_mouse_up();
            }

        }, false);

        element.addEventListener('mousedown', function (event) {
            
            that.fixWhich(event);

            var posx = 0;
            var posy = 0;
            if (!event)
                event = window.event;
            if (event.pageX || event.pageY) {
                posx = event.offsetX ? (event.offsetX) : event.layerX;
                posy = event.offsetY ? (event.offsetY) : event.layerY;

            } else if (event.clientX || event.clientY) {
                posx = event.clientX + document.body.scrollLeft
                        + document.documentElement.scrollLeft;
                posy = event.clientY + document.body.scrollTop
                        + document.documentElement.scrollTop;
            }

            that.map_point_location(posx, posy);

            if (event.which === 1) {
                that.set_mouse_down(1);
            } else {
                that.set_right_mouse_down();
            }

        }, false);

        element.addEventListener('mousemove', function (event) {

            that.fixWhich(event);

            var posx = 0;
            var posy = 0;
            if (!event)
                event = window.event;
            if (event.pageX || event.pageY) {
                posx = event.offsetX ? (event.offsetX) : event.layerX;
                posy = event.offsetY ? (event.offsetY) : event.layerY;

            } else if (event.clientX || event.clientY) {
                posx = event.clientX + document.body.scrollLeft
                        + document.documentElement.scrollLeft;
                posy = event.clientY + document.body.scrollTop
                        + document.documentElement.scrollTop;
            }

            that.map_point_location(posx, posy);

            if (event.which === 1) {
                that.set_mouse_move(1);
            } else {
                that.set_right_mouse_move();
            }

        }, false);

        element.addEventListener("contextmenu", function (event) {
            event.preventDefault();
        });
        
        element.addEventListener("wheel", function (event) {
            event.preventDefault();
            that.set_wheel(event.wheelDelta);
        });

    };

    Input.prototype.fixWhich = function (e) {

        if (!e.which && e.button) {

            if (e.button & 1) {
                e.which = 1;      // Left
            } else if (e.button & 4) {
                e.which = 2; // Middle
            } else if (e.button & 2) {
                e.which = 3; // Right
            }

        }

    };

    Input.prototype.add_element = function (element) {
        var index = this.elements.indexOf(element);
        if (element) {
            if (index === -1) {
                this.elements.push(element);
            }
        } else {
            throw "can't add undefined value to Input";
        }
    };

    Input.prototype.add = function (element) {

        if (Object.prototype.toString.call(element) === '[object Array]') {
            for (var i = 0; i < element.length; i++) {
                var el = element[i];
                this.add_element(el);
            }
        } else {
            this.add_element(element);
        }

    };

    Input.prototype.remove = function (element) {

        if (Object.prototype.toString.call(element) === '[object Array]') {
            for (var i = 0; i < element.length; i++) {
                var el = element[i];
                this.remove_element(el);
            }
        } else {
            this.remove_element(element);
        }

    };

    Input.prototype.remove_element = function (element) {
        var index = this.elements.indexOf(element);
        if (index !== -1) {
            this.elements.splice(index, 1);
        }

    };

    Input.prototype.remove_all = function () {
        this.elements = [];
    };

    Input.prototype.sort_input = function () {
        Math.insertionSort(this.elements, function (a, b) {
            return a.priority < b.priority;
        });
    };

    Input.prototype.map_touch_location = function (touch) {
       // this.point.x = touch.pageX - this.offset.left;
       // this.point.y = touch.pageY - this.offset.top;
       this.map_point_location(touch.pageX - this.offset.left,touch.pageY - this.offset.top)
    };

    Input.prototype.map_point_location = function (x, y) {
        var ratio_x = x / Config.canvas_width;
        var xx = ratio_x * Config.screen_width;

        var ratio_y = y / Config.canvas_height;
        var yy = ratio_y * Config.screen_height;

        this.point.x = xx;
        this.point.y = yy;
    };
    
    Input.prototype.recalculate_offset = function (){
        this.offset = this.recursive_offset(this.element);
    };

    Input.prototype.recursive_offset = function (element) {
        var offsetLeft = 0;
        var offsetTop = 0;
        while (element) {
            offsetLeft += element.offsetLeft;
            offsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        return {
            left: offsetLeft,
            top: offsetTop
        };
    };


    //////////////
    
    Input.prototype.set_wheel = function (delta) {

        // create the event
        var event = new HEvent(0,delta, 0, null);

        this.sort_input();

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element) {

                if (event.propagate) {
                    element.on_wheel(event, element);

                } else {
                    break;
                }
                //TODO consider if its needed to keep track of the events
            }
        }
    };

    Input.prototype.set_mouse_down = function (identifier) {

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.DOWN, identifier);

        this.sort_input();

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.event_idx === -1 && !element.is_mouse_down && element.check(event.point) && element.is_touchable) {

                if (event.propagate) {
                    element.is_mouse_down = true;
                    element.event_idx = event.idx;
                    element.on_mouse_down(event, element);

                    if (event.is_canceled) {
                        this.set_mouse_cancel(identifier);
                    }

                } else {
                    break;
                }
                //TODO consider if its needed to keep track of the events
            }
        }
    };

    Input.prototype.set_mouse_move = function (identifier) {

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.DOWN, identifier);

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.event_idx === identifier && element.is_mouse_down) {

                element.event_idx = event.idx;
                element.on_mouse_move(event, element);

                if (event.is_canceled) {
                    this.set_mouse_cancel(identifier);
                }

            }
        }

    };

    Input.prototype.set_mouse_up = function (identifier) {

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.UP, identifier);

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.event_idx === identifier && element.is_mouse_down) {

                if (element.check(event.point)) {
                    element.is_mouse_down = false;
                    element.event_idx = -1;
                    element.on_mouse_up(event, element);
                } else {
                    this.set_mouse_cancel(identifier);
                }

                //TODO consider if its needed to keep track of the events
            }
        }

    };

    Input.prototype.set_mouse_cancel = function (identifier) {

        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];
            var event = new HEvent(0, 0, HEvent.CANCEL, identifier);

            if (element && element.event_idx === identifier) {
                element.event_idx = -1;
                element.is_mouse_down = false;
                element.on_mouse_cancel(event, element);
            }
        }

    };



    Input.prototype.set_right_mouse_up = function (x, y) {


    };

    Input.prototype.set_right_mouse_down = function (x, y) {

        //TODO


    };

    Input.prototype.set_right_mouse_move = function (x, y) {

        //TODO



    };



    window.Input = Input;

}(window));
