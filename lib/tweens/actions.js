(function (window, undefined) {

    function Actions() {
        throw "can't initialize Action";
    }

    Actions.actions = [];
    Actions.to_remove = [];

    Actions.add = function (action) {
        var index = this.actions.indexOf(action);
        if (index === -1) {
            this.actions.push(action);
            action.step(0); // it will execute immidietly if duration is 0   
        }
    };

    Actions.remove = function (action) {
        this.to_remove.push(action);
    };

    Actions.stop_all = function () {
        Actions.actions = [];
    };

    Actions.run = function () {

        for (var i = 0; i < this.to_remove.length; i++) {
            var index = this.actions.indexOf(this.to_remove[i]);

            if (index !== -1) {
                this.actions.splice(index, 1);
            }
        }

        this.to_remove.length = 0;
        var count = this.actions.length;
        var step = Ticker.step * Config.slow_motion_factor;

        for (var i = 0; i < count; i++) {
            if (!this.actions[i].is_paused) {
                this.actions[i].step(step);
            }
        }

    };

    window.Actions = Actions;

}(window));