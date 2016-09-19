var game;

//(function(window,undefined){

var Config = function() {
};


Config.screen_width = 0;
Config.screen_height = 0;
Config.window_width = 0;
Config.window_height = 0;
Config.device_width = 0;
Config.device_height = 0;
Config.device = '';

Config.height_in_tiles = 48;
Config.width_in_tiles = 80;
Config.tile_width = 0;
Config.tile_height = 0;

Config.debug = false;
Config.debug_info = true;
Config.slow_motion_factor = 1;
Config.should_clear_stage = true;

Config.is_fullscreen = false;
Config.MODE_FLEXIBLE_WIDTH = 0;
Config.MODE_FLEXIBLE_HEIGHT = 1;
Config.MODE_STRETCH = 2;
Config.window_mode = 0;
Config.is_low_resolution = false;
Config.should_scale = true;
Config.should_go_fullscreen = false;
Config._is_resolution_set = false;

Config.set_game_size = function(width, height, mode) {

    var size = Config.window_size();
    

    var low_limit_width = 480;
    var low_limit_height = 280;

    if (!Config._is_resolution_set) { // if it is not set for low resolution
        // lets check if it is actually for a low resolution

        if (window.screen) {
            Config.device_height = window.screen.height;
            Config.device_width = window.screen.width;
        }

        if (size.width < low_limit_width || size.height < low_limit_height) {
            Config.is_low_resolution = true;
        }
        
        if(isIPhone && size.width === 480 && size.height === 320){
            Config.is_low_resolution = true;
        }

        if(isIPhone){
            Config.is_low_resolution = false;
        }

        Config._is_resolution_set = true;

    }

    window.scrollTo(scrollToX,scrollToY);

    Config.window_width = size.width;
    Config.window_height = size.height;
    Config.window_mode = mode;

    if (mode === Config.MODE_FLEXIBLE_WIDTH) {

        Config.screen_height = height;
        var ratio = size.width / size.height;
        Config.screen_width = height * ratio;

    } else if (mode === Config.MODE_FLEXIBLE_HEIGHT) {

        Config.screen_width = width;
        var ratio = size.width / size.height;
        Config.screen_height = width / ratio;

    } else if (mode === Config.MODE_STRETCH) {
        Config.screen_width = width;
        Config.screen_height = height;
    }

};

Config.window_size = function() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return {width: e[ a + 'Width' ], height: e[ a + 'Height' ]};
};

Config.set_window_height = function(height){
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    e[ a + 'Height' ] = height;
};

Config.get_querystring = function(name)
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
};

Config.is_mobile = function() {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
};

Config.go_fullscreen = function() {

    if (!Config.is_fullscreen) {

        Config.is_fullscreen = true;
        var elem = document.getElementById('stage');

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }


    }

};

Config.exit_fullscreen = function() {

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }

};

Config.fullscreen_callback = function() {
    if (!document.fullscreenElement && // alternative standard method
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement) {

        Config.is_fullscreen = false;
    } else {
        Config.is_fullscreen = true;
    }
};

window.addEventListener("webkitfullscreenchange", function(evt) {
    Config.fullscreen_callback();
});

window.addEventListener("mozfullscreenchange", function(evt) {
    Config.fullscreen_callback();
});

window.addEventListener("fullscreenchange", function(evt) {
    Config.fullscreen_callback();
});

window.addEventListener("MSFullscreenChange", function(evt) {
    Config.fullscreen_callback();
});

window.addEventListener("resize", function(event) {
    Config.set_game_size(Config.screen_width, Config.screen_height, Config.window_mode);
    window.scrollTo(scrollToX,scrollToY);
    if(game){
        game.resize();
    }
    
});

// window.Config = Config;

//}(window));



