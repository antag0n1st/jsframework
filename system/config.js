
var Config = function () {
};


Config.game_width = 1920; // set the size of the canvas here 
Config.game_height = 1080;

Config.MODE_FLEXIBLE_WIDTH = 0; // it will scale to the same height and adjust the width acordingly
Config.MODE_FLEXIBLE_HEIGHT = 1; // use the same width , but change the height to flll the screen
Config.MODE_STRETCH = 2; // I dont know why I would use this mode
Config.MODE_CENTERED = 3; // it will preserve the aspect ratio an fit into the screen
Config.MODE_NONE = 4; // do not do anything about it

Config.window_mode = Config.MODE_CENTERED; // set the scaling method
Config.window_mode_mobile = null; // if you need specila mode for mobile devices

Config.is_sound_on = true; // switch the sound on/off
Config.debug_info = true;
Config.debug = false;
Config.should_clear_stage = true;
Config.slow_motion_factor = 1;
Config.is_game_paused = false;

Config.base_url = '';
Config.lang = 'en';
Config.background_color = null;

Config.ROTATION_MODE_ALLOW = 0;
Config.ROTATION_MODE_HORIZONTAL = 1;
Config.ROTATION_MODE_VERTICAL = 2;

Config.rotation_mode = Config.ROTATION_MODE_HORIZONTAL;

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
 * @type Number - the size of the browser window
 */
Config.window_width = 0;
/**
 * 
 * @type Number - the size of the browser window
 */
Config.window_height = 0;