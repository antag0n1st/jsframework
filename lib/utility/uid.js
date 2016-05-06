(function (window) {

    function UID() {
        throw "UID cannot be instantiated";
    }

    UID.gen = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    
    UID._current_number = 0;
    
    UID.numbering = function(){
        return UID._current_number++;
    };

    window.UID = UID;

}(window));