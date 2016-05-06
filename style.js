(function (window, undefined) {

    function Style() {
        throw "can't initialize this class";
    }
    //Style.prototype = new ParentClassName();
    //Style.prototype.parent_initialize = Style.prototype.initialize;    
    Style.initialize = function () {
        // this.parent_initialize();
        
        Style.POPUP_SCORE = {
            font_name: 'agency_fb',
            font_size: 60,
            font_color: "#ffffff",
            shadow_color: "#777777",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.MAP_MILESTONE = {
            font_name: 'agency_fb',
            font_size: 25,
            font_color: "#ffffff",
            shadow_color: "#333333",
            shadow_distance: 1,
            padding: 4
        };
        
        Style.SCORE_TITLE = {
            font_name: 'agency_fb',
            font_size: 32,
            font_color: "#6c7730",
            shadow_color: "#e0e7be",
            shadow_distance: 1,
            padding: 4
        };
        
        Style.SCORE_NUMBER = {
            font_name: 'agency_fb',
            font_size: 50,
            font_color: "#7c883d",
            shadow_color: "#fefefd",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.SCORE_NAME = {
            font_name: 'agency_fb',
            font_size: 50,
            font_color: "#5f6a23",
            shadow_color: "#fefefd",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.SCORE_SCORE = {
            font_name: 'agency_fb',
            font_size: 50,
            font_color: "#5f6a23",
            shadow_color: "#fefefd",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.SYMBOLS_LEVEL = {
            font_name: 'agency_fb',
            font_size: 20,
            font_color: "#373e12",
            shadow_color: "#cbd2a8",
            shadow_distance: 1,
            padding: 4
        };
        
        Style.SYMBOLS_TITLE = {
            font_name: 'agency_fb',
            font_size: 60,
            font_color: "#FFFFFF",
            shadow_color: "#555555",
            shadow_distance: 2,
            padding: 4
        };
        
        Style.POPUP_TITLE = {
            font_name: 'agency_fb',
            font_size: 55,
            font_color: "#5f6a23",
            shadow_color: "#fefefd",
            shadow_distance: 3,
            padding: 4
        };
        
        
        Style.TOAST_MESSAGE = {
            font_name: 'agency_fb',
            font_size: 50,
            font_color: "#ffffff",
            shadow_color: "#000000",
            shadow_distance: 2,
            padding: 4
        };
        
        Style.POPUP_SUBTITLE = {
            font_name: 'agency_fb',
            font_size: 30,
            font_color: "#5f6a23",
            shadow_color: "#fefefd",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.NEXT_BUTTON = {
            image_normal: 'next_btn',
            image_selected: 'next_btn_pressed',
            font_name: 'agency_fb',
            font_size: 25,
            font_color: "#fefefe",
            shadow_color: "#97a25d",
            shadow_distance: 2
        };
        
        Style.NUMBERING_BUTTON = {
            image_normal: 'numbering',
            image_selected: 'numbering',
            font_name: 'agency_fb',
            font_size: 18,
            font_color: "#ffffff",
            shadow_color: "#999999",
            shadow_distance: 1
        };
        
        Style.BACK_BUTTON = {
            image_normal: 'back_btn',
            image_selected: 'back_btn_pressed'
        };
        
        Style.POPUP_BUTTON = {
            image_normal: 'popup_button',
            image_selected: 'popup_button_pressed'
        };
        
        Style.RESUME_BUTTON = {
            image_normal: 'resume_button',
            image_selected: 'resume_button_selected',
            font_name: 'agency_fb',
            font_size: 35,
            font_color: "#5f6a23",
            shadow_color: "#fefefd",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.PAUSE_BUTTON = {
            image_normal: 'pause',
            image_selected: 'pause',
            font_name: 'agency_fb',
            font_size: 30,
            font_color: "#5f6a23",
            shadow_color: "#fefefd",
            shadow_distance: 3,
            padding: 4
        };
        
        Style.MARKER = {
            image_normal: 'marker_active',
            image_selected: 'marker_active'
        };
        
        Style.FULLSCREEN_ON_BUTTON = {
            image_normal: 'go_fullscreen',
            image_selected: 'go_fullscreen_pressed'
        };
        
        Style.FULLSCREEN_OFF_BUTTON = {
            image_normal: 'exit_fullscreen',
            image_selected: 'exit_fullscreen_pressed'
        };
        
        Style.SOUND_ON_BUTTON = {
            image_normal: 'sounds',
            image_selected: 'sounds_pressed'
        };
        
        Style.SOUND_OFF_BUTTON = {
            image_normal: 'sounds_off',
            image_selected: 'sounds_off_pressed'
        };
                
        
        
        Style.MAIN_MENU_BUTTON = {
            image_normal: 'main_menu_button',
            image_selected: 'main_menu_button_pressed',
            font_name: 'agency_fb',
            font_size: 50,
            font_color: "#fefefe",
            shadow_color: "#97a25d",
            shadow_distance: 2,
            padding: 4
        };

        Style.MOCK_BUTTON = {
            image_normal: 'background_btn',
            image_selected: 'background_btn',
            font_name: 'Arial',
            font_size: 25,
            font_color: "#333333",
            shadow_color: "#f5d787",
            shadow_distance: 2,
            padding: 4
        };
        
        Style.MOCK_BUTTON_2 = {
            image_normal: 'background_btn_half',
            image_selected: 'background_btn_half',
            font_name: 'Arial',
            font_size: 20,
            font_color: "#333333",
            shadow_color: "#f5d787",
            shadow_distance: 2,
            padding: 4
        };

        Style.DARK_GRAY_BUTTON = {
            image_normal: 'button',
            image_selected: 'button_selected',
            font_name: 'future_time',
            font_size: 40,
            font_color: "#dddddd",
            shadow_color: "#222222",
            shadow_distance: 2,
            padding: 4
        };
        
        Style.LABEL_HUD = {
            font_name: 'agency_fb',
            font_size: 60,
            font_color: "#ffffff",
            shadow_color: "#000000",
            shadow_distance: 2,
            padding: 4
        };
        
        Style.TITLE = {
            font_name: 'Arial',
            font_size: 28,
            font_color: "#333333",
            shadow_color: "#999999",
            shadow_distance: 2,
            text_vertical_align: Label.TEXT_V_ALIGN_ALPHABETIC,
            padding: 4
        };
        
        Style.SILVER_DESCRIPTION = {
            font_name: 'future_time',
            font_size: 40,
            font_color: "#e2e2e2",
            shadow_distance: 1,
            text_vertical_align: Label.TEXT_V_ALIGN_ALPHABETIC,
            padding: 4
        };
        
        Style.YELLOW_DESCRIPTION = {
            font_name: 'future_time',
            font_size: 40,
            font_color: "#f5c649",
            shadow_color: "#5c5030",
            shadow_distance: 2,
            text_vertical_align: Label.TEXT_V_ALIGN_ALPHABETIC,
            padding: 4
        };
        
        Style.YELLOW_BUTTON_SMALL = {
            image_normal: 'button_yellow_small',
            image_selected: 'button_yellow_small_selected',
            font_name: 'future_time',
            font_size: 25,
            font_color: "#5c5030",
            shadow_color: "#f5d787",
            shadow_distance: 2,
            padding: 4
        };
    };
    
    window.Style = Style;

}(window));