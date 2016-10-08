(function (window, undefined) {

    function Style() {
        throw "can't initialize this class";
    }
    //Style.prototype = new ParentClassName();
    //Style.prototype.parent_initialize = Style.prototype.initialize;    
    Style.initialize = function () {
        Style.BITMAP_LABEL = {
            font_name: 'Half Bold Pixel-7',
            font_size: 35,
            font_color: "#999999",
            shadow_color: "#777777",
            shadow_distance: 3,
            padding: 4,
            text_align: Label.TEXT_H_ALIGN_CENTER,
        };
        // this.parent_initialize();
       Style.SAMPLE_BUTTON = {
            image_normal: 'button',
            image_selected: 'button',
            font_name: 'arial',
            font_size: 35,
            font_color: "#ffffff",
            shadow_color: "#555555",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.SAMPLE_LABEL = {
            font_name: 'arial',
            font_size: 60,
            font_color: "#ffffff",
            shadow_color: "#777777",
            shadow_distance: 3,
            padding: 4,
            text_align: Label.TEXT_H_ALIGN_CENTER,
        };
    };
    
    window.Style = Style;

}(window));