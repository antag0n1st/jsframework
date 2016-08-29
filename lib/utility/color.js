(function (window, undefined) {


    function Color(hex_code) {
        this.initialize(hex_code);
    }
    //Color.prototype = new ParentClassName();
    //Color.prototype.parent_initialize = Color.prototype.initialize;
    Color.TYPE = UID.numbering();
    Color.prototype.initialize = function (hex_code) {
        // this.parent_initialize();
        this.TYPE = Color.TYPE;
        this.hex_code = hex_code;

        if (hex_code > 16777215) {
            this.alpha = hex_code >>> 24;
            this.a = hex_code >>> 24;
        } else {
            this.alpha = 255;
            this.a = hex_code >>> 255;
        }

        this.red = hex_code >> 16 & 0xFF;
        this.green = hex_code >> 8 & 0xFF;
        this.blue = hex_code & 0xFF;

        this.r = hex_code >> 16 & 0xFF;
        this.g = hex_code >> 8 & 0xFF;
        this.b = hex_code & 0xFF;

    };


    Color.get_color_32 = function (a, r, g, b) {

        return a << 24 | r << 16 | g << 8 | b;

    };

    window.Color = Color;

}(window));