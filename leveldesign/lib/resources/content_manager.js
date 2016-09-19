//(function(window){


var ContentManager = function() {
    throw 'cant initialize';
};

ContentManager.stage = null;
ContentManager.callback = function() {
};
ContentManager.loaded_resources = 0;
ContentManager.count_resources = 0;


ContentManager.sounds_to_load = [];
ContentManager.files_to_load = [];
ContentManager.images_to_load = [];
ContentManager.atlases = [];
ContentManager.skeletons = [];


ContentManager.failed_attempts = [];
ContentManager.number_of_failed_attepts = 5;
ContentManager.failed_attempts_delay = 1000;

ContentManager.add_image = function(index, url) {
    
    if(Config.is_low_resolution){
       url = url.replace(/([^/]*)$/,'low_resolution/'+'$1');
       
    }  
    var file_name = url.split("/").pop();
    
    var ind = Images[index];
    if (ind !== undefined) {
        log("the name of the image: '" + url + "' already exists , please change the key name for that image - iko");
        return;
    }
    
    ind = ContentManager.images_to_load[index];
    if (ind !== undefined) {
        throw "the key "+index+" for the name of the image: '" + url + "' already exists , please change the key name for that image - iko";
    }
    
    ContentManager.images_to_load[index] = {image: new Image(), url: url, image_name: index,file_name:file_name};
    ContentManager.count_resources++;
};

ContentManager.add_sound = function(index, url) {
    var ind = ContentManager.sounds_to_load.indexOf(index);
    if (ind !== -1) {
        throw "the name of the sound: '" + url + "' already exists";
    }
    ContentManager.sounds_to_load[index] = url;
    ContentManager.count_resources++;
};

ContentManager.add_audio = function(index, url) {

    var sound = new Howl({
        urls: [url + '.mp3', url + '.wav'],
        onload: function() {
        },
        onloaderror: function() {
        }
    });

    Sounds[index] = sound;

};

ContentManager.download_resources = function(stage, callback, base_url) {


    ContentManager.callback = callback || function() {
    };
    ContentManager.stage = stage;
    ContentManager.base_url = base_url;

    for (var index in ContentManager.sounds_to_load) {
        var sound = new Howl({
            urls: [ContentManager.sounds_to_load[index] + '.mp3', ContentManager.sounds_to_load[index] + '.wav'],
            onload: ContentManager.resource_loaded,
            onloaderror: function(e) {
                ContentManager.handle_sound_error(index, ContentManager.sounds_to_load[index]);
            }
        });

        Sounds[index] = sound;

    }



    for (var item in ContentManager.images_to_load) {
        ContentManager.images_to_load[item].image.onload = ContentManager.resource_loaded;
        ContentManager.images_to_load[item].image.onerror = function(e) {
            var _url = (ContentManager.base_url ? ContentManager.base_url : '') + ContentManager.images_to_load[item].url;
            ContentManager.handle_image_error(item, _url);
        };
        ContentManager.images_to_load[item].image.src = (ContentManager.base_url ? ContentManager.base_url : '') + ContentManager.images_to_load[item].url;
    }
    
      
    for(var i=0;i<this.files_to_load.length;i++){
        var f = this.files_to_load[i];
        ContentManager.download_file(f._filename,f._success,f._fail);
    }
        
    if(ContentManager.loaded_resources === 0 && ContentManager.count_resources === 0){
        ContentManager.callback();
    }
    
    
};


ContentManager.handle_image_error = function(index, url) {

    if (ContentManager.set_failed(url)) {
        setTimeout(function() {
            ContentManager.images_to_load[index].image.src = url;
        }, ContentManager.failed_attempts_delay);
    } else {
        log("FAILED: image with index name: " + index + " url: " + url);
    }

};

ContentManager.handle_sound_error = function(index, url) {


    if (ContentManager.set_failed(url)) {
        setTimeout(function() {

            var sound = new Howl({
                urls: [ContentManager.sounds_to_load[index] + '.mp3', ContentManager.sounds_to_load[index] + '.wav'],
                onload: ContentManager.resource_loaded,
                onloaderror: function() {
                    ContentManager.handle_sound_error(index, ContentManager.sounds_to_load[index]);
                }
            });

            Sounds[index] = sound;


        }, ContentManager.failed_attempts_delay);
    } else {
        log("sound index name: " + index + " url: " + url);
    }





};



ContentManager.resource_loaded = function() {
    ContentManager.loaded_resources++;
    
    if (ContentManager.loaded_resources === ContentManager.count_resources) {

        ContentManager.base_url = null;
        ContentManager.loaded_resources = 0;
        ContentManager.count_resources = 0;
        
        
       
        for(var index in ContentManager.images_to_load){
            Images[index] = ContentManager.images_to_load[index];         
        }
        
        ContentManager.images_to_load = [];
        ContentManager.sounds_to_load = [];
        ContentManager.files_to_load = [];

        ContentManager.callback();
    }

};

ContentManager.ajaxRequest = function() {
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

ContentManager.add_spine_animation = function(name) {

    ContentManager.add_image(name, 'assets/spine/' + name + '.png');
    ContentManager.add_image(name+'_fliped', 'assets/spine/' + name + '_fliped.png');

    ContentManager.add_file('assets/spine/' + name + '.json', function(data) {
       
        ContentManager.skeletons[name] = JSON.parse(data);
    }, function() {
    });

    ContentManager.add_file('assets/spine/' + name + '.atlas', function(data) {
        
        ContentManager.atlases[name] = data;
      
    }, function() {
    });
};

ContentManager.add_file = function(filename, success, fail) {

    ContentManager.count_resources++;
    
    this.files_to_load.push({
        _filename:filename,
        _success:success,
        _fail:fail
    });
    
};

ContentManager.download_file = function(filename,success,fail){
    
    var mygetrequest = new ContentManager.ajaxRequest();
    mygetrequest.onreadystatechange = function() {
 
        if (mygetrequest.readyState === 4) {
            if (mygetrequest.status === 200) {
                success(mygetrequest.responseText);
                ContentManager.resource_loaded();
            }
            else {

                if (ContentManager.set_failed(filename)) {
                    setTimeout(function() {                       
                        ContentManager.download_file(filename, success, fail);
                    }, ContentManager.failed_attempts_delay);
                } else {
                    fail();
                }

            }
        }
    };

    mygetrequest.open("GET", filename, true);
    mygetrequest.send(null);
    
};

ContentManager.set_failed = function(name) {

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

//    window.ContentManager = ContentManager;
//    
//}(window));