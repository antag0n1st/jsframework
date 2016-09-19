<?php

define('DS', DIRECTORY_SEPARATOR);
$main_dir = getcwd() . DS ."..".DS. 'assets'.DS.'images';

$content = [];

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
  //  return $url;
    return '../assets/images' . $url . '/';
}

function listFolderFiles($dir,$folder_name) {
    $ffs = scandir($dir);
    global $main_dir, $content;

    $folder = [];
    $folder['text'] = $folder_name;
    $folder['children'] = [];
    
    if($folder_name == 'root'){
        $folder['state'] = ["opened" => true];
    }
//        state       : {
////            opened    : boolean  // is the node open
////            disabled  : boolean  // is the node disabled
////            selected  : boolean  // is the node selected
////        }
//    }

    foreach ($ffs as $ff) {

        if ($ff != '.' && $ff != '..') {

            /////////////////////////
            // files to skip

            if ($ff === "assets.js" || $ff === "css") {
                // do nothing   
            } else {

                if (endsWith($ff, '.png')) {

                    $basic = beforeComma($ff);
                    $url = create_url($dir);
                 //   $url = str_replace('', '', $url);
                    $url = ltrim($url, '/');
                    
                    $node =  ['icon' => $url . $ff, 'text' => $basic];
                    
                    $folder['children'][] = $node;
                }
            }

            ///////////////////////////////


            if (is_dir($dir . DS . $ff)) {

                $sub_folder = listFolderFiles($dir . DS . $ff , $ff);
               array_unshift($folder['children'],$sub_folder);
            }
        }
    }
    
    return $folder;
}

$structure = listFolderFiles($main_dir, 'root');
print_r(json_encode($structure));


//print_r(json_encode($content));
