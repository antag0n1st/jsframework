<?php

define('DS', DIRECTORY_SEPARATOR);
$main_dir = getcwd() . DS . '../assets' . DS . 'data';

function create_url($dir) {
    global $main_dir;
    $url = str_replace($main_dir, '', $dir);
    $url = str_replace(DS, "/", $url);
    return  $url . '/';
}

function beforeComma($string) {
    return substr($string, 0, strrpos($string, '.'));
}

function endsWith($haystack, $needle) {
    // search forward starting from end minus needle length characters
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}

function listFolderFiles($dir) {
    $ffs = scandir($dir);
    global $main_dir, $content;

    $files = [];

    foreach ($ffs as $ff) {

        if ($ff != '.' && $ff != '..') {


            if (endsWith($ff, '.json')) {
                
                $basic = beforeComma($ff);
                    $url = create_url($dir);
                    $url = str_replace('assets/images', '', $url);
                    $url = ltrim($url, '/');
                    
                    $files[] =  ['url' => $url . $ff, 'name' => $basic];
                
            }

            if (is_dir($dir . DS . $ff)) {

                $subfolder = listFolderFiles($dir . DS . $ff);
                $files = array_merge($files, $subfolder);
                //TODO merge with files
            }
        }
    }

    return $files;
}

$structure = listFolderFiles($main_dir);
print_r(json_encode($structure));
