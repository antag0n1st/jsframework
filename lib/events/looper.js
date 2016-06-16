(function (window, undefined) {

    function Looper(queue, is_single_loop, delay) {
        this.initialize(queue, is_single_loop, delay);
    }
    //Looper.prototype = new ParentClassName();
    //Looper.prototype.parent_initialize = Looper.prototype.initialize;    
    Looper.prototype.initialize = function (queue, is_single_loop, delay) {
        // this.parent_initialize();
        this.queue = [];
        this.number_of_events = 0;
        this.total_time = 0;
        this.callback = function () {
        };
        this.is_single_loop = is_single_loop;
        this.current_time = delay ? -delay : 0;
        this.current_event_name = "";
        this.previous_loop_event_name = null;
        this.current_percent = 0;
        this.is_finished = false;
        this.delay = delay ? delay : 0;

        for (var i = 0; i < queue.length; i++) {

            var event = queue[i];
            if (typeof (event) === "function") {
                this.callback = event;
            } else {
                this.number_of_events++;
                this.total_time += event.duration;
                this.queue.push(event);
            }

        }

    };
    
    Looper.prototype.step = function(dt){
        this.update(dt);
    };

    Looper.prototype.update = function (dt) {

        if (this.is_finished) {
            return false;
        }

        this.current_time += dt;

        if (this.current_time < 0) {
            if(this.previous_loop_event_name === null) {
               this.previous_loop_event_name = "";
            } else {
                this.previous_loop_event_name = this.current_event_name;
            }            
            this.current_event_name = "delay";
            this.current_percent = (this.delay - Math.abs(this.current_time)) / this.delay;
        }

        var time = 0;

        if (this.current_time > this.total_time) {

            if (this.is_single_loop) {
                this.is_finished = true;
                this.callback();
                return;
            } else {
                this.current_time -= this.total_time;
                this.previous_loop_event_name = '';
                this.callback();
            }
        }

        for (var i = 0; i < this.queue.length; i++) {

            var event = this.queue[i];
            var t1 = time;
            time += event.duration;

            if (this.current_time >= t1 && this.current_time <= time) {
                this.previous_loop_event_name = this.current_event_name;
                this.current_event_name = event.name;
                var x = this.current_time - t1;
                this.current_percent = x / event.duration;
            }

        }

    };

    Looper.prototype.restart = function () {
        this.is_finished = false;
        this.current_time = -this.delay;
        this.current_event_name = null;
        this.current_percent = 0;
        this.previous_loop_event_name = null;
    };

    Looper.prototype.go_to_next = function () {
        var time = 0;
        for (var i = 0; i < this.queue.length; i++) {

            var event = this.queue[i];
            var t1 = time;
            time += event.duration;

            if (this.current_time >= t1 && this.current_time <= time) {
                
                if (this.queue.length > i + 1) {
                    this.current_time = time + 1;
                    this.current_percent = 0;
                }
                break;
            }

        }
    };

    Looper.prototype.get = function () {
        return {
            name: this.current_event_name,
            percent: this.current_percent,
            is_first_time: (this.previous_loop_event_name !== this.current_event_name)
        };
    };

    window.Looper = Looper;

}(window));