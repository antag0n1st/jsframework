(function (window, undefined) {

    function Device() {
        this.initialize();
    }

    Device.prototype.initialize = function () {

        this.is_android = false;
        this.is_ios = false;
        this.is_touch = false;
        this.is_mobile = false;
        this.is_ie = false;

        this.is_fullscreen = false;

        this.read_device_type();
        this.read_touch_device();
        this.read_mobile();
        this.read_ie();

        ////

        this.calculate_sizes();

        //////////////

        var that = this;

        window.addEventListener("webkitfullscreenchange", function (evt) {
            that.fullscreen_callback();
        });

        window.addEventListener("mozfullscreenchange", function (evt) {
            that.fullscreen_callback();
        });

        window.addEventListener("fullscreenchange", function (evt) {
            that.fullscreen_callback();
        });

        window.addEventListener("MSFullscreenChange", function (evt) {
            that.fullscreen_callback();
        });

        ////////////

        window.addEventListener("resize", function (event) {
            if (game) {
                game.resize();
            }
        });

    };

    Device.prototype.read_device_type = function () {

        if (/iPhone|iPod/i.test(navigator.userAgent)) {
            this.is_ios = true;
            //  var vp = window.document.getElementById("viewport");
            //   vp.setAttribute("content", "width=device-width, initial-scale=0.5, maximum-scale=1.0, minimum-scale=0.5, user-scalable=no, minimal-ui");

        } else if (/Android/i.test(navigator.userAgent)) {
            this.is_android = true;
        }

    };

    Device.prototype.read_touch_device = function () {
        this.is_touch = 'ontouchstart' in window        // works on most browsers 
                || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };

    Device.prototype.read_mobile = function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.is_mobile = true;
        } else {
            this.is_mobile = false;
        }
    };

    Device.prototype.calculate_sizes = function () {

        var width = Config.game_width;
        var height = Config.game_height;
        var mode = Config.window_mode;
        var size = this.window_size();

        Config.window_width = size.width;
        Config.window_height = size.height;

        Config.canvas_width = Math.ceil(size.width);
        Config.canvas_height = Math.ceil(size.height);

        var ratio = size.width / size.height;

        if (mode === Config.MODE_FLEXIBLE_WIDTH) {

            Config.screen_height = height;            
            Config.screen_width = height * ratio;

        } else if (mode === Config.MODE_FLEXIBLE_HEIGHT) {

            Config.screen_width = width;
            Config.screen_height = width / ratio;

        } else if (mode === Config.MODE_STRETCH) {
            
            Config.screen_width = width;
            Config.screen_height = height;
            
        }  else if (mode === Config.MODE_CENTERED) {
            
            Config.screen_width = width;
            Config.screen_height = height;
            
            var gratio = width/height;
            
            if(ratio >= width/height){
               // the screen size is wider               
               Config.canvas_width = Math.ceil(size.height*gratio);
               Config.canvas_height = Math.ceil(size.height);
            } else {
                // the screen size is taller
                Config.canvas_width = Math.ceil(size.width);
                Config.canvas_height = Math.ceil(size.width/gratio);
            }
           
            
        }

    };

    Device.prototype.window_size = function () {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {width: e[ a + 'Width' ], height: e[ a + 'Height' ]};
    };

    Device.prototype.read_ie = function () {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            this.is_ie = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            return this.is_ie;
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            this.is_ie = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            return this.is_ie;
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            this.is_ie = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            return this.is_ie;
        }

        // other browser
        this.is_ie = false;
        return this.is_ie;
    };



    Device.prototype.go_fullscreen = function () {

        if (!this.is_fullscreen) {

            this.is_fullscreen = true;
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

    Device.prototype.can_go_fullscreen = function () {

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

    Device.prototype.exit_fullscreen = function () {

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

    Device.prototype.fullscreen_callback = function () {
        if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement) {

            this.is_fullscreen = false;
        } else {
            this.is_fullscreen = true;
        }
    };

    window.Device = Device;

}(window));