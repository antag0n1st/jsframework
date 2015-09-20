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

    };
    
    Playlist.prototype.add = function (song,volume) {
        this.playlist.push({
            song: song,
            volume: volume
        });
    };

    Playlist.prototype.play = function () {

        var index = 0;
        
        this.stop();
        
        if(this.randomize){
           index = Math.random_int(0,this.playlist.length-1);
        } else {
           index = ++this.current_playing_index % this.playlist.length;
        }
        
        this.current_playing_index = index;
        
        var object = this.playlist[index];
                
        object.song.volume(object.volume).play();        
        this.now_playing = object.song;       
        var that = this;
        this.now_playing.on('end',function(){
            that.play();
        });

    };
    
    

    Playlist.prototype.stop = function () {
        if(this.now_playing){
            this.now_playing.stop();
        }
    };

    window.Playlist = Playlist;

}(window));