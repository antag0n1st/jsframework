(function (window, undefined) {

    function ImageButton(style, icon_name) {
        this.initialize(style, icon_name);
    }
    ImageButton.prototype = new Button();
    ImageButton.prototype.button_initialize = ImageButton.prototype.initialize;
    ImageButton.TYPE = UID.numbering();

    ImageButton.prototype.initialize = function (style, icon_name) {
        this.button_initialize(style);
        this.TYPE = ImageButton.TYPE;
        this.set_anchor(0.5,0.5);
        if (icon_name) {
            this.icon = new Sprite(icon_name);   
            this.icon.set_anchor(0.5,0.5);
            this.add_child(this.icon);
        }

    };

    ImageButton.prototype.update = function (dt) {
        Button.prototype.update.call(this, dt);
    };

    window.ImageButton = ImageButton;

}(window));