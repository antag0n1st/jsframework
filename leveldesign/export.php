<?php

function create_subdirs($file) {

    $parts = explode("/", $file);

    $path = '../assets/data/';

    for ($i = 0; $i < count($parts) - 1; $i++) {

        $folder = $parts[$i];

        if (!file_exists($path . "/" . $folder)) {
            mkdir($path . "/" . $folder, 0777, true);
        }

        $path .= "/" . $folder;
    }
}

if (isset($_POST) and $_POST['file_name']) {

    $file_name = $_POST['file_name'];

    $data = "";

    if (isset($_POST) and $_POST['data']) {
        $data = $_POST['data'];
    }


    // write to file
    // create directory if it does not exist

    create_subdirs($file_name);


    $myfile = fopen("../assets/data/" . $file_name, "w");
    fwrite($myfile, $data);
    fclose($myfile);

    print_r(json_encode(["message" => "success"]));
}


