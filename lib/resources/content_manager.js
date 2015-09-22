//(function(window){


var ContentManager = function () {
    throw 'cant initialize';
};

ContentManager.base_url = '';
ContentManager.screen = null;
ContentManager.count_loaded = 0;
ContentManager.count_to_load = 0;
ContentManager.sounds_to_load = [];
ContentManager.spine = {};

ContentManager.on_progress = function (loader, resource) {
    ContentManager.count_loaded++;

    if (resource.isImage) {
        Images[resource.name] = resource;
    } else if (resource.data.bones) {
        ContentManager.spine[resource.name] = resource;
    }
};

ContentManager.on_complete = function () {
    ContentManager.count_loaded = 0;
    ContentManager.count_to_load = 0;
    ContentManager.sounds_to_load = [];
    ContentManager.set_loader();
    ContentManager.callback();
};

ContentManager.set_loader = function () {
    ContentManager.loader = new PIXI.loaders.Loader();

    ContentManager.loader.on('progress', function (loader, resource) {
        ContentManager.on_progress(loader, resource);
    }).once('complete', function () {
        ContentManager.on_complete();
    });
};

ContentManager.set_loader();

ContentManager.callback = function () {
};

ContentManager.add_image = function (index, url) {

    if (!url) {
        url = ContentManager.base_url + 'assets/images/' + index + '.png';
    } else {
        url = ContentManager.base_url + 'assets/images/' + url;
    }

    ContentManager.loader.add(index, url);
    ContentManager.count_to_load++;

};

ContentManager.add_sound = function (index, url) {

    var ind = ContentManager.sounds_to_load.indexOf(index);
    if (ind !== -1) {
        throw "the name of the sound: '" + url + "' already exists";
    }
    ContentManager.sounds_to_load[index] = url;
    ContentManager.count_to_load++;

};

ContentManager.add_spine = function (index) {

    ContentManager.count_to_load += 3;
    this.loader.use(PIXI.spine.loaders.atlasParser())
            .add(index, 'assets/spine/' + index + '.json');

    ContentManager.loader.add(index + '_texture', 'assets/spine/' + index + '.png');

};

ContentManager.add_atlas = function (index) {
    var url = ContentManager.base_url + 'assets/images/atlases/' + index + '.json';
    ContentManager.loader.add(index, url);
    ContentManager.count_to_load += 2;
};

ContentManager.add_font = function (index, url) {



};

ContentManager.add_audio = function (index, url) {

    var sound = new Howl({
        src: [url + '.ogg', url + '.mp3'],
        onload: function () {
        },
        onloaderror: function () {
        }
    });

    Sounds[index] = sound;

};

ContentManager.download_resources = function (screen, callback) {


    ContentManager.screen = screen;
    ContentManager.callback = callback;

    for (var index in ContentManager.sounds_to_load) {
        var sound = new Howl({
            src: [ContentManager.sounds_to_load[index] + '.ogg', ContentManager.sounds_to_load[index] + '.mp3'],
            onload: function () {
                ContentManager.count_loaded++;
            },
            onloaderror: function (e) {
                log("Error loading: " + index);
            },
            buffer: true
        });

        Sounds[index] = sound;
    }


    ContentManager.loader.load();

    if (ContentManager.count_to_load === 0 && ContentManager.count_loaded === 0) {
        ContentManager.callback();
    }

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