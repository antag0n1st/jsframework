(function (window, undefined) {

    function Style() {
        throw "can't initialize this class";
    }
    //Style.prototype = new ParentClassName();
    //Style.prototype.parent_initialize = Style.prototype.initialize;    
    Style.initialize = function () {
        // this.parent_initialize();
       Style.SAMPLE_BUTTON = {
            image_normal: 'button_name',
            image_selected: 'button_name_selected',
            font_name: 'arial',
            font_size: 35,
            font_color: "#5f6a23",
            shadow_color: "#fefefd",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.SAMPLE_LABEL = {
            font_name: 'arial',
            font_size: 60,
            font_color: "#ffffff",
            shadow_color: "#777777",
            shadow_distance: 3,
            padding: 4
        };
    };
    
    window.Style = Style;

}(window));