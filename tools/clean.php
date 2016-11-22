<?php 

function delete_dir($dir) {
    system('rd ' . escapeshellarg($dir).' /S /Q', $retval);
    return $retval == 0; 
}

function delete_file($file) {
	
	if(file_exists($file)){
		chmod( $file, 0777 );
                unlink( $file );
	} else {
		echo $file." already deleted \n <br />";
	}
	 
}

delete_dir("../.git");
delete_dir("../nbproject");
delete_dir("../node_modules");
delete_file("../.gitignore");

delete_dir("../leveldesign/game");
delete_dir("../leveldesign/lib");
delete_dir("../leveldesign/node_modules");
delete_file("../leveldesign/config.js");

delete_dir("../game/objects");
delete_dir("../game/platforms");
delete_dir("../game/player");

delete_file("../game/screens/fake3d_screen.js");
delete_file("../game/screens/filters_screen.js");
delete_file("../game/screens/font_screen.js");
delete_file("../game/screens/gui_screen.js");
delete_file("../game/screens/keyboard_screen.js");
delete_file("../game/screens/ori_scren.js");

delete_file("../assets/fonts/half_bold_pixel.fnt");
delete_file("../assets/fonts/half_bold_pixel_0.png");

delete_dir("../assets/images/keyboard");

delete_file("../assets/images/arrow.png");
delete_file("../assets/images/attractor.png");
delete_file("../assets/images/attractor2.png");
delete_file("../assets/images/button.png");
delete_file("../assets/images/magical_forest.png");
delete_file("../assets/images/platform.png");
delete_file("../assets/images/player.png");
delete_file("../assets/images/player2.png");
delete_file("../assets/images/wall.png");

delete_file("../assets/sounds/effects/jump.mp3");
delete_file("../assets/sounds/effects/jump.webm");

delete_file("../assets/sounds/music/background.mp3");
delete_file("../assets/sounds/music/background.webm");

include './assets.php';