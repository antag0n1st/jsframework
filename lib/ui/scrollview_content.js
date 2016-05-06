(function (window, undefined) {

    function ScrollviewContent(name) {
        this.initialize(name);
    }

    ScrollviewContent.prototype = new Sprite();
    ScrollviewContent.prototype.sprite_initialize = ScrollviewContent.prototype.initialize;
    ScrollviewContent.TYPE = UID.numbering();
    ScrollviewContent.prototype.initialize = function (name) {
        this.sprite_initialize(name); // your image name
        this.TYPE = ScrollviewContent.TYPE;

    };

    ScrollviewContent.prototype.set_position = function (x, y) {

        var parent = this.get_parent();

        if (parent) {
            var x_max = parent.__width - parent.content_width;
            x = (x > 0) ? 0 : x;
            x = (x < x_max) ? x_max : x;

            var y_max = parent.__height - parent.content_height;
            
            y = (y > 0) ? 0 : y;
            y = (y < y_max) ? y_max : y;
        }

        Sprite.prototype.set_position.call(this, x, y);
    };

    ScrollviewContent.prototype.on_added_to_parent = function (parent) {
        Sprite.prototype.on_added_to_parent.call(this, parent);

    };

    ScrollviewContent.prototype.on_remove_from_parent = function (parent) {
        Sprite.prototype.on_remove_from_parent.call(this, parent);

    };

    ScrollviewContent.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);
    };

    ScrollviewContent.prototype.on_note = function (note, data, sender) {
        // if (note === Notes.NOTE_NAME) {}
    };


    window.ScrollviewContent = ScrollviewContent;

}(window));