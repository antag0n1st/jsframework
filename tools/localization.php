<?php

define('DS', DIRECTORY_SEPARATOR);
$main_dir = getcwd() . DS . '..' . DS . 'game';

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

function getStringsBetween($string, $start, $end) {
    $pattern = sprintf(
            '/%s(.*?)%s/', preg_quote($start), preg_quote($end)
    );
    preg_match_all($pattern, $string, $matches);

    return $matches[1];
}

$localized_strings = array();

function listFolderFiles($dir) {
    $ffs = scandir($dir);
    global $main_dir, $content, $localized_strings;
    foreach ($ffs as $ff) {
        if ($ff != '.' && $ff != '..') {

            if (endsWith($ff, '.js')) {
                $file_content = file_get_contents($dir . DS . $ff);

                $matches = getStringsBetween($file_content, "lang(", ")");

                if (count($matches) > 0) {

                    for ($i = 0; $i < count($matches); $i++) {
                        $match = $matches[$i];
                        $match = trim($match);
                        $match = trim($match, "\"\'");
                        $localized_strings[$match] = $match;
                        // $content .= "\"" . $match . "\" = \"" . $match . "\"\n";
                    }
                }
            }

            if (is_dir($dir . DS . $ff)) {
                listFolderFiles($dir . DS . $ff);
            }
        }
    }
}

listFolderFiles($main_dir);

$content = "";

foreach ($localized_strings as $key => $value) {
    $content .= "\"" . $key . "\" = \"" . $value . "\"\n";
}

echo "<pre>";
echo $content;


//echo $content;
//$content = "Game.prototype.load_assets = function () {\n\n" . $content . " \n};";
file_put_contents('..' . DS . 'assets' . DS . 'localization' . DS . 'en.txt', $content);
//echo $main_dir."/assets/assets.js"." GENEREATED";
?>
