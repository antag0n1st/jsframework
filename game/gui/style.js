(function (window, undefined) {

    function Style() {
        throw "can't initialize this class";
    }
    //Style.prototype = new ParentClassName();
    //Style.prototype.parent_initialize = Style.prototype.initialize;    
    Style.initialize = function () {
        // this.parent_initialize();

//        Style.YELLOW_BUTTON = {
//            image_normal: 'button_yellow',
//            image_selected: 'button_yellow_selected',
//            font_name: 'future_time',
//            font_size: 40,
//            font_color: "#5c5030",
//            shadow_color: "#f5d787",
//            shadow_offset_x: 2,
//            shadow_offset_y: 2
//        };
//
//        Style.DARK_GRAY_BUTTON = {
//            image_normal: 'button',
//            image_selected: 'button_selected',
//            font_name: 'future_time',
//            font_size: 40,
//            font_color: "#dddddd",
//            shadow_color: "#222222",
//            shadow_offset_x: 2,
//            shadow_offset_y: 2
//        };
//        
//        Style.LABEL_HUD = {
//            font_name: 'future_time',
//            font_size: 50,
//            font_color: "#f5c649",
//            shadow_color: "#5c5030",
//            shadow_offset_x: 2,
//            shadow_offset_y: 2
//        };
//        
//        Style.TITLE = {
//            font_name: 'future_time',
//            font_size: 50,
//            font_color: "#f5c649",
//            shadow_color: "#5c5030",
//            shadow_offset_x: 2,
//            shadow_offset_y: 2,
//            text_vertical_align: Label.TEXT_V_ALIGN_ALPHABETIC
//        };
//        
//        Style.SILVER_DESCRIPTION = {
//            font_name: 'future_time',
//            font_size: 40,
//            font_color: "#e2e2e2",
//            shadow_offset_x: 1,
//            shadow_offset_y: 1,
//            text_vertical_align: Label.TEXT_V_ALIGN_ALPHABETIC
//        };
//        
//        Style.YELLOW_DESCRIPTION = {
//            font_name: 'future_time',
//            font_size: 40,
//            font_color: "#f5c649",
//            shadow_color: "#5c5030",
//            shadow_offset_x: 2,
//            shadow_offset_y: 2,
//            text_vertical_align: Label.TEXT_V_ALIGN_ALPHABETIC
//        };
//        
//        Style.YELLOW_BUTTON_SMALL = {
//            image_normal: 'button_yellow_small',
//            image_selected: 'button_yellow_small_selected',
//            font_name: 'future_time',
//            font_size: 25,
//            font_color: "#5c5030",
//            shadow_color: "#f5d787",
//            shadow_offset_x: 2,
//            shadow_offset_y: 2
//        };
    };
    
    window.Style = Style;

}(window));