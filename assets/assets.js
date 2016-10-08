Game.prototype.load_assets = function () {





ContentManager.add_bitmap_font('half_bold_pixel','assets/fonts/half_bold_pixel.fnt');

ContentManager.add_image('arrow','arrow.png');

ContentManager.add_image('attractor','attractor.png');
ContentManager.add_image('attractor2','attractor2.png');
ContentManager.add_image('button','button.png');
ContentManager.add_image('favicon','favicon.png');

ContentManager.add_image('black','initial/black.png');
ContentManager.add_image('lights1','initial/lights1.png');
ContentManager.add_image('lights2','initial/lights2.png');
ContentManager.add_image('loading_bg','initial/loading_bg.png');
ContentManager.add_image('loading_fr_pice','initial/loading_fr_pice.png');
ContentManager.add_image('rotate_device_to_landscape','initial/rotate_device_to_landscape.png');
ContentManager.add_image('rotate_device_to_portrait','initial/rotate_device_to_portrait.png');
ContentManager.add_image('white','initial/white.png');

ContentManager.add_image('backspace','keyboard/backspace.png');
ContentManager.add_image('capitalize','keyboard/capitalize.png');
ContentManager.add_image('preview_key','keyboard/preview_key.png');
ContentManager.add_image('space','keyboard/space.png');
ContentManager.add_image('magical_forest','magical_forest.png');
ContentManager.add_image('platform','platform.png');
ContentManager.add_image('player','player.png');
ContentManager.add_image('player2','player2.png');
ContentManager.add_image('wall','wall.png');

ContentManager.add_file('en','assets/localization/en.txt');


ContentManager.add_sound('jump',['assets/sounds/effects/jump.webm','assets/sounds/effects/jump.mp3']);

ContentManager.add_audio('background',['assets/sounds/music/background.webm','assets/sounds/music/background.mp3']);

 
};