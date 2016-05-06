(function (window, undefined) {

    function StateMachine(states) {
        this.initialize(states);
    }
//State_machine.prototype = new ParentClassName();
//State_machine.prototype.parent_initialize = State_machine.prototype.initialize;    
    StateMachine.prototype.initialize = function (states) {
        // this.parent_initialize();

        this.states = states;
        this.subscribers = [];
        this.currentState = '';
        this.previousState = '';

        this.initial_state = null;

        this.indexes = {}; //just for convinience
        for (var i = 0; i < this.states.length; i++) {
            this.indexes[this.states[i].name] = i;
            if (this.states[i].initial) {
                this.currentState = this.states[i];
                this.previousState = this.states[i];
                this.initial_state = this.currentState;
            }
        }

        if (!this.initial_state) {
            throw "you must have initial state when configuring a state machine";
        }

    };

    StateMachine.prototype.go_to_previus_state = function () {
        this.set(this.previousState.name);
    };

    StateMachine.prototype.set = function (state, data) {
        if (this.currentState.events[state]) {
            var prev_state = this.currentState;
            this.previousState = prev_state;
            this.currentState = this.states[this.indexes[this.currentState.events[state]]];

            var listeners = this.subscribers[this.currentState.name];
            if (listeners) {

                var count = listeners.length;
                for (var i = 0; i < count; i++) {
                    listeners[i].on_state(prev_state, this.currentState, data);
                }
            }
        }
    };
    StateMachine.prototype.get = function () {
        return this.currentState.name;
    };

    StateMachine.prototype.reset = function () {
        this.set(this.initial_state.name);
        this.subscribers = [];
    };

    StateMachine.prototype.subscribe = function (event, object) {

        if (event === '*') {

            for (var i = 0; i < this.states.length; i++) {
                var event_state = this.states[i].name;
                if (!this.subscribers[event_state]) {
                    this.subscribers[event_state] = [];
                }
                this.subscribers[event_state].push(object);

            }

        } else {
            if (!this.subscribers[event]) {
                this.subscribers[event] = [];
            }
            this.subscribers[event].push(object);
        }


    };
    StateMachine.prototype.unsubscribe = function (event, object) {
        var events = this.subscribers[event];
        if (events) {
            var index = events.indexOf(object);
            if (index !== -1) {
                events.splice(index, 1);
            }
        }

    };

    StateMachine.prototype.get_subscribers = function () {
        return this.subscribers;
    };
    StateMachine.prototype.unsubscribe_from_all = function (object) {

        for (var event in this.subscribers) {
            var events = this.subscribers[event];
            if (events) {
                var index = events.indexOf(object);
                if (index !== -1) {
                    events.splice(index, 1);
                }
            }
        }

    };

    StateMachine.prototype.unsubscribe_all = function () {
        this.subscribers = [];

    };


    window.StateMachine = StateMachine;

}(window));