(function (window, undefined) {

    function PlayerController() {
        this.initialize();
    }
    //PlayerController.prototype = new ParentClassName();
    //PlayerController.prototype.parent_initialize = PlayerController.prototype.initialize;    
    PlayerController.prototype.initialize = function () {
        // this.parent_initialize();

        var that = this;
        


    };
    
    


    PlayerController.prototype.reset = function () {
        
        this.is_up = false;
        this.is_right = false;
        this.is_down = false;
        this.is_left = false;


        this.is_up_pressed = false;
        this.is_right_pressed = false;
        this.is_down_pressed = false;
        this.is_left_pressed = false;
        this.is_up_holding = false;

        this.is_up_locked = false;
        this.is_down_locked = false;
        
        this.last_pressed = 0;
        
        this.is_space = false;
        
        this.is_ritual = false;
        this.is_teleport = false;
    };
    

    window.PlayerController = PlayerController;

}(window));