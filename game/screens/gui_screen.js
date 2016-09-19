(function (window, undefined) {

    function GuiScreen() {
        this.initialize();
    }

    GuiScreen.prototype = new HScreen();
    GuiScreen.prototype.screen_initialize = GuiScreen.prototype.initialize;
    GuiScreen.TYPE = UID.numbering();

    GuiScreen.prototype.initialize = function () {
        
        this.screen_initialize();
        this.TYPE = GuiScreen.TYPE;
        
        this.background = new Sprite('black');
        this.background.strech(Config.screen_width,Config.screen_height);
        this.add_child(this.background);
        
        ///////// SCROLL VIEW /////////////////////
        
        this.scroll_view = new ScrollView();
        this.scroll_view.set_size(800,600);
        this.scroll_view.set_content_size(1920,1080);
        this.scroll_view.set_position(Config.screen_width/2 - 400,Config.screen_height/2 - 300);
        this.scroll_view.content.add_child(new Sprite('magical_forest'));
        this.add_child(this.scroll_view);
        
        ////////////// TABLE VIEW /////////////////
        
        this.table = new TableView();
        this.table.set_size(400,600);
        this.table.set_position(100, 200);
        this.table.set_cell_type(TableCell);
        
        var data = [];
        for (var i = 0; i < 20; i++) {
            data.push({text:"Sample Text "+i});
        }
        this.table.set_data(data);
        
        this.add_child(this.table);
        
        /////////// LABEL /////////////////
        
        this.label = new Label(Style.SAMPLE_LABEL);
        this.label.txt = lang("GUI Screen");
        this.label.set_anchor(0.5,0.5);
        this.label.set_position(Config.screen_width/2, 100);
        this.add_child(this.label);
        
        
        /////////// BUTTONS ////////////////
        
        this.button = new Button(Style.SAMPLE_BUTTON);
        this.button.label.txt = lang("Go Back");
        this.button.tag = 0;
        this.button.on_mouse_up = GuiScreen.prototype.on_button.bind(this);
        this.button.set_position(30,50);
        this.add_child(this.button);
        
        
        this.popup_button = new Button(Style.SAMPLE_BUTTON);
        this.popup_button.label.txt = lang("Show Popup");
        this.popup_button.tag = 1;
        this.popup_button.set_anchor(0.5,0.5);
        this.popup_button.on_mouse_up = GuiScreen.prototype.on_button.bind(this);
        this.popup_button.set_position(Config.screen_width/2,Config.screen_height - 100);
        this.add_child(this.popup_button);
        
        // POPUP

    };
    
    GuiScreen.prototype.on_confirm = function (is_yes,sender) {
        sender.hide(true);
    };
    
    GuiScreen.prototype.on_button = function (event,sender) {
        if(sender.tag === 0){
            game.navigator.go_back(HNavigator.ANIMATION_TYPE_FADEOUT,200);
        } else if(sender.tag === 1){
            
           var popup = new Confirm(this,"Are you sure");
           popup.show();
        }
        
    };
    
    

    GuiScreen.prototype.update = function (dt) {
        HScreen.prototype.update.call(this);

    };

    GuiScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);
        game.input.add(this.scroll_view);
        game.input.add(this.table);
        game.input.add(this.button);
        game.input.add(this.popup_button);
    };

    GuiScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);
        game.input.remove(this.scroll_view);
        game.input.remove(this.table);
        game.input.remove(this.button);
        game.input.remove(this.popup_button);
    };

    GuiScreen.prototype.on_note = function (event_name, data, sender) {

    };

    GuiScreen.prototype.on_resize = function () {

    };

    GuiScreen.prototype.on_mouse_down = function (event, element) {

    };

    GuiScreen.prototype.on_mouse_move = function (event, element) {

    };

    GuiScreen.prototype.on_mouse_up = function (event, element) {

    };

    GuiScreen.prototype.on_mouse_cancel = function (element) {

    };

    GuiScreen.prototype.on_right_mouse_down = function (event) {

    };

    GuiScreen.prototype.destroy = function () {

    };

    window.GuiScreen = GuiScreen; // make it available in the main scope

}(window));