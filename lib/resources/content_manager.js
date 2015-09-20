//(function(window){


var ContentManager = function () {
    throw 'cant initialize';
};

ContentManager.stage = null;
ContentManager.base_url = '';
ContentManager.loaded_resources = 0;
ContentManager.count_resources = 0;
ContentManager.number_of_failed_attepts = 5;
ContentManager.failed_attempts_delay = 1000;
ContentManager.sounds_to_load = [];
ContentManager.files_to_load = [];
ContentManager.images_to_load = [];
ContentManager.url_to_download = [];
ContentManager.failed_attempts = [];
ContentManager.fonts_to_load = [];
ContentManager.atlases = [];
ContentManager.spine_atlases = {};
ContentManager.skeletons = [];

ContentManager.callback = function () {

};

ContentManager.add_image = function (index, url) {

    if (Config.is_low_resolution) {
        url = url.replace(/([^/]*)$/, 'low_resolution/' + '$1');
    }

    url = ContentManager.base_url + url;

    var file_name = url.split("/").pop();

    var ind = Images[index];
    if (ind !== undefined) {
      //  log("the name of the image: '" + url + "' already exists , please change the key name for that image - iko");
        return;
    }

    ind = ContentManager.images_to_load[index];
    if (ind !== undefined) {
        throw "the key " + index + " for the name of the image: '" + url + "' already exists , please change the key name for that image - iko";
    }

    ContentManager.images_to_load[index] = {image: new Image(), url: url, image_name: index, file_name: file_name};
    ContentManager.count_resources++;
    ContentManager.url_to_download.push(url);

};

ContentManager.add_sound = function (index, url) {

    var ind = ContentManager.sounds_to_load.indexOf(index);
    if (ind !== -1) {
        throw "the name of the sound: '" + url + "' already exists";
    }
    ContentManager.sounds_to_load[index] = url;
    ContentManager.count_resources++;

};

ContentManager.add_atlas = function (index) {

    ContentManager.add_image(index,'assets/images/atlases/'+index+'.png');
    
    ContentManager.add_file('assets/images/atlases/'+index+'.json',function(data){
        ContentManager.atlases.push(JSON.parse(data));
    },function(){
        log("Could not load atlas: "+index);
    });

};

ContentManager.add_font = function (index, url) {

    var ind = ContentManager.fonts_to_load.indexOf(index);
    if (ind !== -1) {
        throw "the name of the font: '" + url + "' already exists";
    }
    ContentManager.fonts_to_load[index] = url;
    ContentManager.count_resources++;

};

ContentManager.add_audio = function (index, url) {

    var sound = new Howl({
        src: [ url + '.ogg',url + '.mp3'],
        onload: function () {
        },
        onloaderror: function () {
        }
    });

    Sounds[index] = sound;

};

ContentManager.download_resources = function (stage, callback) {

    ContentManager.callback = callback || function () {
    };

    ContentManager.stage = stage;

    for (var index in ContentManager.sounds_to_load) {
        var sound = new Howl({
            src: [ContentManager.sounds_to_load[index] + '.ogg',ContentManager.sounds_to_load[index] + '.mp3'],
            onload: ContentManager.resource_loaded,
            onloaderror: function (e) {
                ContentManager.handle_sound_error(index, ContentManager.sounds_to_load[index]);
            },
            buffer:true
        });

        Sounds[index] = sound;
    }
    
    for (var index in ContentManager.fonts_to_load) {
        
        var font = new Font();
        
        var that = this;
        
        font.onload = function(){
            ContentManager.resource_loaded();
        };
        
        font.onerror = function(){
            log("can't load font: "+index);
        };
        
        font.fontFamily = index;
        font.src = ContentManager.fonts_to_load[index];
        font.format = 'embedded-opentype';

        Fonts[index] = font;
    }

    for (var item in ContentManager.images_to_load) {
        ContentManager.images_to_load[item].image.onload = ContentManager.resource_loaded;
        ContentManager.images_to_load[item].image.onerror = function (e) {
            var _url = ContentManager.images_to_load[item].url;
            ContentManager.handle_image_error(item, _url);
        };
        ContentManager.images_to_load[item].image.src = ContentManager.images_to_load[item].url;
    }

    for (var i = 0; i < ContentManager.files_to_load.length; i++) {
        var f = ContentManager.files_to_load[i];
        ContentManager.download_file(f);
    }

    if (ContentManager.loaded_resources === 0 && ContentManager.count_resources === 0) {
        ContentManager.callback();
    }
};


ContentManager.handle_image_error = function (index, url) {

    if (ContentManager.set_failed(url)) {
        timeout(function () {
            ContentManager.images_to_load[index].image.src = url;
        }, ContentManager.failed_attempts_delay);
    } else {
        log("FAILED: image with index name: " + index + " url: " + url);
    }

};

ContentManager.handle_sound_error = function (index, url) {

    if (ContentManager.set_failed(url)) {

        timeout(function () {

            var sound = new Howl({
                src: [ContentManager.sounds_to_load[index] + '.ogg',ContentManager.sounds_to_load[index] + '.mp3'],
                onload: ContentManager.resource_loaded,
                onloaderror: function () {
                    ContentManager.handle_sound_error(index, ContentManager.sounds_to_load[index]);
                }
            });

            Sounds[index] = sound;

        }, ContentManager.failed_attempts_delay);

    } else {
        log("sound index name: " + index + " url: " + url);
    }
};

ContentManager.resource_loaded = function (event) {

    ContentManager.loaded_resources++;
   
    
    var url = "";
    
    if(event && event.srcElement){
        url = event.srcElement.src;
    } else if(event && event.target){
        url = event.target.src;
    }
    
    for (var i = ContentManager.url_to_download.length - 1; i >= 0; i--) {
        var to_download_url = ContentManager.url_to_download[i];
        if (url === to_download_url) {
            ContentManager.url_to_download.splice(i, 1);
        }
    }

    if (ContentManager.loaded_resources === ContentManager.count_resources) {

        ContentManager.loaded_resources = 0;
        ContentManager.count_resources = 0;

        for (var index in ContentManager.images_to_load) {
            Images[index] = ContentManager.images_to_load[index];
        }

        ContentManager.images_to_load = [];
        ContentManager.sounds_to_load = [];
        ContentManager.files_to_load = [];

        ContentManager.callback();
    }

};

ContentManager.ajaxRequest = function () {
    var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //activeX versions to check for in IE
    if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        for (var i = 0; i < activexmodes.length; i++) {
            try {
                return new ActiveXObject(activexmodes[i]);
            }
            catch (e) {
                //suppress error
            }
        }
    }
    else if (window.XMLHttpRequest) // if Mozilla, Safari etc
        return new XMLHttpRequest();
    else
        return false;

};

ContentManager.add_spine_animation = function (name) {

    ContentManager.add_image(name, 'assets/spine/' + name + '.png');
    ContentManager.add_image(name + '_flipped', 'assets/spine/' + name + '_flipped.png');

    ContentManager.add_file('assets/spine/' + name + '.json', function (data) {

        ContentManager.skeletons[name] = JSON.parse(data);
    }, function () {
    });

    ContentManager.add_file('assets/spine/' + name + '.atlas', function (data) {

        ContentManager.spine_atlases[name] = data;

    }, function () {
    });
};

ContentManager.add_file = function (filename, success, fail) {

    filename = ContentManager.base_url + filename;
    ContentManager.count_resources++;
    ContentManager.url_to_download.push(filename);

    ContentManager.files_to_load.push({
        _filename: filename,
        _success: success || function(){},
        _fail: fail || function(){},
        _ready: 0,
        _status: 0
    });

};

ContentManager.download_file = function (file) {

    var mygetrequest = new ContentManager.ajaxRequest();
    mygetrequest.onreadystatechange = function () {

        file._ready = mygetrequest.readyState;
        file._status = mygetrequest.status;

        if (mygetrequest.readyState === 4) {
            if (mygetrequest.status === 200) {

                ContentManager.resource_loaded({
                    srcElement: {
                        src: file._filename
                    }
                });

                file._success(mygetrequest.responseText);

            } else {

                if (ContentManager.set_failed(file._filename)) {
                    timeout(function () {
                        ContentManager.download_file(file);
                    }, ContentManager.failed_attempts_delay);
                } else {
                    file._fail();
                }

            }
        }

    };

    mygetrequest.open("GET", file._filename, true);
    mygetrequest.send(null);

};

ContentManager.set_failed = function (name) {

    if (!ContentManager.failed_attempts[name]) {
        ContentManager.failed_attempts[name] = 0;
    }

    ContentManager.failed_attempts[name]++;

    if (ContentManager.failed_attempts[name] > ContentManager.number_of_failed_attepts) {
        log("resource not found: " + name);
        return false;
    }

    return true;

};

ContentManager.get_base_url = function () {

    var url = document.URL;

    if (url.indexOf("localhost") > 0) {

        var index = url.lastIndexOf('/');
        var base = url.substring(0, index);
        ContentManager.base_url = base + '/';
    } else {
        ContentManager.base_url = '';
    }

};

ContentManager.get_base_url();

//    window.ContentManager = ContentManager;
//    
//}(window));