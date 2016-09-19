(function (window, undefined) {


    function Confirm(delegate, msg) {
        this.initialize(delegate, msg);
    }
    Confirm.prototype = new Popup();
    Confirm.prototype.parent_initialize = Confirm.prototype.initialize;
    Confirm.TYPE = UID.numbering();
    Confirm.prototype.initialize = function (delegate, msg) {
        
        this.parent_initialize(delegate, null);
        this.TYPE = Confirm.TYPE;

        this.label = new Label(Style.SAMPLE_LABEL);
        this.label.set_anchor(0.5, 0.5);
        this.label.font_size = 40;
        this.label.font_color = "#555555";
        this.label.is_multiline = true;
        this.label.label_width = 500;
        this.label.set_position(0, -50);
        this.add_child(this.label);
        this.label.set_alpha(0);
        this.label.txt = msg;
        
        var that = this;

        this.yes = new Button(Style.SAMPLE_BUTTON);
        this.yes.set_anchor(0.5,0.5);
        this.yes.label.txt = lang("Yes");
        this.yes.priority = 1001;
        this.yes.on_mouse_up = function(event,sender){
            if(that.delegate && that.delegate.on_confirm){
                that.delegate.on_confirm(true,that);
            }
        };
        this.yes.set_position(-180, 100);
        this.add_child(this.yes);
        this.yes.set_alpha(0);


        this.no = new Button(Style.SAMPLE_BUTTON);
        this.no.set_anchor(0.5,0.5);
        this.no.label.txt = lang("No");
        this.no.priority = 1001;
        this.no.on_mouse_up = function(event,sender){
            if(that.delegate && that.delegate.on_confirm){
                that.delegate.on_confirm(false,that);
            }
        };
        this.no.set_position(180, 100);
        this.add_child(this.no);
        this.no.set_alpha(0);

    };


    Confirm.prototype.show = function () {
        Popup.prototype.show.call(this);
        
        var show_time = 200;

        timeout(function (that) {

            new TweenAlpha(that.label, 1, null, show_time).run();
            new TweenAlpha(that.yes, 1, null, show_time).run();
            new TweenAlpha(that.no, 1, null, show_time).run();
            

        }, 600, this);

        game.input.add(this.yes);
        game.input.add(this.no);

    };

    Confirm.prototype.hide = function (animated) {
        Popup.prototype.hide.call(this, animated);
        
        game.input.remove(this.yes);
        game.input.remove(this.no);
    };

    window.Confirm = Confirm;

}(window));