(function (window, undefined) {

    function Playlist(playlist) {
        this.initialize(playlist);
    }
    //Playlist.prototype = new ParentClassName();
    //Playlist.prototype.parent_initialize = Playlist.prototype.initialize;    
    Playlist.prototype.initialize = function (playlist) {
        // this.parent_initialize();

        this.playlist = playlist || [];

        this.now_playing = null;
        this.randomize = false;
        this.current_playing_index = -1;

        this.is_paused = false;
        this.is_stoped = true;

    };

    Playlist.prototype.add = function (song, volume) {
        this.playlist.push({
            song: song,
            volume: volume
        });
    };

    Playlist.prototype.play = function () {
        
        if(!this.is_stoped && !this.is_paused){
            return;
        }

        if (this.now_playing) {
            this.now_playing.play();
            var object = this.playlist[this.current_playing_index];
            this.now_playing.fade(0, object.volume, 200);
            this.is_paused = false;
            this.is_stoped = false;
            return;
        }

        var index = 0;

        this.stop();

        if (this.randomize) {
            index = Math.random_int(0, this.playlist.length - 1);
        } else {
            index = ++this.current_playing_index % this.playlist.length;
            
        }

        this.current_playing_index = index;

        var object = this.playlist[index];

        object.song.volume(object.volume).play();
        this.now_playing = object.song;
        var that = this;
        this.now_playing.once('end', function () {
            timeout(function(plylist){
                plylist.next();
            },100,that);            
        });

        this.is_paused = false;
        this.is_stoped = false;

    };

    Playlist.prototype.next = function () {
        if (this.now_playing) {
          
            var index = 0;

            this.stop();

            if (this.randomize) {
                index = Math.random_int(0, this.playlist.length - 1);
            } else {
                index = ++this.current_playing_index % this.playlist.length;
            }

            this.current_playing_index = index;

            var object = this.playlist[index];

            object.song.volume(object.volume).play();
            this.now_playing = object.song;
            var that = this;
            this.now_playing.once('end', function () {
                that.next();
            });
            
            this.is_paused = false;
            this.is_stoped = false;
        } else {           
            this.play();
        }
    };



    Playlist.prototype.stop = function () {
        if (this.now_playing) {
            this.now_playing.stop();
            this.now_playing = null;
        }
        this.is_stoped = true;
        this.is_paused = false;
    };


    Playlist.prototype.pause = function () {
        if (this.now_playing) {
            this.now_playing.pause();
        }
        this.is_paused = true;
        this.is_stoped = false;
    };

    window.Playlist = Playlist;

}(window));