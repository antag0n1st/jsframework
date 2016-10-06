<?php

define('DS', DIRECTORY_SEPARATOR);
$main_dir = getcwd().DS .'..' . DS . 'assets';

$content = "";

function stringContains($haystack, $needle) {
    return strpos($haystack, $needle) !== false;
}

function startsWith($haystack, $needle) {
    // search backwards starting from haystack length characters from the end
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
}

function endsWith($haystack, $needle) {
    // search forward starting from end minus needle length characters
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}

function beforeComma($string) {

    return substr($string, 0, strrpos($string, '.'));
}

function create_url($dir) {
    global $main_dir;
    $url = str_replace($main_dir, '', $dir);
    $url = str_replace(DS, "/", $url);
    return 'assets' . $url . '/';
}

function listFolderFiles($dir) {
    $ffs = scandir($dir);
    global $main_dir, $content;
    foreach ($ffs as $ff) {
        if ($ff != '.' && $ff != '..') {

            /////////////////////////
            // files to skip

            if ($ff === "assets.js" || $ff === "css") {
                // do nothing   
            } else {

                if (endsWith($dir, DS . 'spine')) {
                    if (endsWith($ff, '.png')) {
                        $basic = beforeComma($ff);
                        $content .= "ContentManager.add_spine('" . $basic . "');\n";
                    }
                } else if (stringContains($dir, 'sounds' . DS . 'effects')) {
                    if (endsWith($ff, '.mp3')) {
                        $basic = beforeComma($ff);
                        $data = file_get_contents($dir.DS.$ff);
                        $base64 = "data:audio/mp3;base64,".base64_encode($data);
                        $content .= "ContentManager.add_sound('" . $basic . "','" . $base64 . "');\n";
                    }
                } else if (stringContains($dir, 'sounds' . DS . 'music')) {
                    if (endsWith($ff, '.mp3')) {
                        $basic = beforeComma($ff);
                        $data = file_get_contents($dir.DS.$ff);
                        $base64 = "data:audio/mp3;base64,".base64_encode($data);
                        $content .= "ContentManager.add_audio('" . $basic . "','" . $base64 . "');\n";
                    }
                } else if (endsWith($dir, DS . 'fonts')) {
                    if (endsWith($ff, '.ttf')) {
                        $basic = beforeComma($ff);
                        $content .= "ContentManager.add_font('" . $basic . "','" . create_url($dir) . $ff . "');\n";
                    }
                } else if (stringContains($dir, 'assets' . DS . 'images' . DS . "atlases")) {
                    if (endsWith($ff, '.png')) {
                        $basic = beforeComma($ff);
                        $content .= "ContentManager.add_atlas('" . $basic . "');\n";
                    }
                } else if (endsWith($dir, DS . 'localization')) {
                    if (endsWith($ff, '.txt')) {
                        $basic = beforeComma($ff);
                        $content .= "ContentManager.add_file('" . $basic . "','" . create_url($dir) . $ff . "');\n";
                    }
                } else if (stringContains($dir, 'assets' . DS . 'images')) {
                    if (endsWith($ff, '.png')) {
                        $basic = beforeComma($ff);
                        $url = create_url($dir);
                        $url = str_replace('assets/images', '', $url);
                        $url = ltrim($url, '/');
                        $content .= "ContentManager.add_image('" . $basic . "','" . $url . $ff . "');\n";
                    }
                } else if (endsWith($ff, '.json')) {
                    // looking for json files 
                    $basic = beforeComma($ff);
                    $content .= "ContentManager.add_file('" . $basic . "','" . create_url($dir) . $ff . "');\n";
                }
            }

            ///////////////////////////////


            if (is_dir($dir . DS . $ff)) {
                $content .= "\n";
                listFolderFiles($dir . DS . $ff);
            }
        }
    }
}

listFolderFiles($main_dir);

$file_name = "assets64.js";

$content = "Game.prototype.load_assets = function () {\n\n" . $content . " \n};";

file_put_contents('..'.DS.'assets' . DS . $file_name, $content);

echo $main_dir . "/assets/".$file_name . " GENEREATED";
