var game;

//(function(window,undefined){

var Config = function () {
};

Config.debug = false;
Config.debug_info = true;
Config.slow_motion_factor = 1;
Config.should_clear_stage = true;
Config.is_auto_run = false;
Config.is_game_paused = false;
Config.is_sound_on = true;
Config.lang = 'en';

/**
 *  Number of miliseconds to pause the drawing
 * @type Number
 */
Config.freeze = 0;
        
/**
 * 
 * @type Number - the actual size of the screen
 */
Config.screen_width = 0;
/**
 * 
 * @type Number - the actual size of the screen 
 */
Config.screen_height = 0;
/**
 * 
 * @type Number - the size of the canvas frame
 */
Config.canvas_width = 0;
/**
 * 
 * @type Number - the size of the canvas frame
 */
Config.canvas_height = 0;
/**
 * 
 * @type Number - the physical size of the screen
 */
Config.device_width = 0;
/**
 * 
 * @type Number - the physical size of the screen
 */
Config.device_height = 0;
/**
 * 
 * @type Number - the wanted size of the screen
 */
Config.game_width = 0;
/**
 * 
 * @type Number - the wanted size of the screen
 */
Config.game_height = 0;
/**
 * 
 * @type Number - the size of the browser window
 */
Config.window_width = 0;
/**
 * 
 * @type Number - the size of the browser window
 */
Config.window_height = 0;

Config.device = '';

Config.height_in_tiles = 48;
Config.width_in_tiles = 80;
Config.tile_width = 0;
Config.tile_height = 0;


Config.is_fullscreen = false;
Config.MODE_FLEXIBLE_WIDTH = 0;
Config.MODE_FLEXIBLE_HEIGHT = 1;
Config.MODE_STRETCH = 2;
Config.MODE_FLEXIBLE_HEIGHT_CENTERED = 3;
Config.window_mode = 0;
Config.is_low_resolution = false;
Config.should_scale = true;
Config.should_go_fullscreen = true;
Config._is_resolution_set = false;

Config.ROTATION_MODE_ALLOW = 0;
Config.ROTATION_MODE_HORIZONTAL = 1;
Config.ROTATION_MODE_VERTICAL = 2;

Config.rotation_mode = Config.ROTATION_MODE_VERTICAL;

Config.set_game_size = function (width, height, mode) {

    var size = Config.window_size();

    Config.window_width = size.width;
    Config.window_height = size.height;

    if (window.screen) {
        Config.device_height = window.screen.height;
        Config.device_width = window.screen.width;
    }

    Config.game_width = width;
    Config.game_height = height;
    Config.canvas_width = Math.ceil(size.width);
    Config.canvas_height = Math.ceil(size.height);
    Config.window_mode = mode;

    if (mode === Config.MODE_FLEXIBLE_WIDTH) {

        Config.screen_height = height;
        var ratio = size.width / size.height;
        Config.screen_width = height * ratio;

    } else if (mode === Config.MODE_FLEXIBLE_HEIGHT) {

        Config.screen_width = width;
        var ratio = size.width / size.height;
        Config.screen_height = width / ratio;

    } else if (mode === Config.MODE_FLEXIBLE_HEIGHT_CENTERED) {

        if (size.width > width) {
            var h = size.height;
            var ratio = width / height;
            var w = ratio * h;

            Config.canvas_width = Math.ceil(w);
            Config.canvas_height = Math.ceil(h);

            Config.screen_width = width;
            Config.screen_height = height;
        } else {
            Config.canvas_width = Math.ceil(size.width);
            Config.canvas_height = Math.ceil(size.height);

            Config.screen_width = width;
            var ratio = size.width / size.height;
            Config.screen_height = width / ratio;
        }

    } else if (mode === Config.MODE_STRETCH) {
        Config.screen_width = width;
        Config.screen_height = height;
    }

};

Config.window_size = function () {
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return {width: e[ a + 'Width' ], height: e[ a + 'Height' ]};
};

Config.get_querystring = function (name)
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results === null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
};

Config.is_mobile = function () {
   
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
};

Config.go_fullscreen = function () {

    if (!Config.is_fullscreen) {

        Config.is_fullscreen = true;
        var elem = document.body;

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

Config.can_go_fullscreen = function () {

    var elem = document.body;

    if (elem.requestFullscreen) {
        return true;
    } else if (elem.msRequestFullscreen) {
        return true;
    } else if (elem.mozRequestFullScreen) {
        return true;
    } else if (elem.webkitRequestFullscreen) {
        return true;
    }

    return false;
};

Config.exit_fullscreen = function () {

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

Config.fullscreen_callback = function () {
    if (!document.fullscreenElement && // alternative standard method
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement) {

        Config.is_fullscreen = false;
    } else {
        Config.is_fullscreen = true;
    }
};

window.addEventListener("webkitfullscreenchange", function (evt) {
    Config.fullscreen_callback();
});

window.addEventListener("mozfullscreenchange", function (evt) {
    Config.fullscreen_callback();
});

window.addEventListener("fullscreenchange", function (evt) {
    Config.fullscreen_callback();
});

window.addEventListener("MSFullscreenChange", function (evt) {
    Config.fullscreen_callback();
});

window.addEventListener("resize", function (event) {
    Config.set_game_size(Config.game_width, Config.game_height, Config.window_mode);

    if (game) {
        game.resize();
    }

});


function detect_ie() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  
  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
  
  // IE 12 / Spartan
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
  
  // Edge (IE 12+)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

Config.is_ie = detect_ie();

// window.Config = Config;

//}(window));



