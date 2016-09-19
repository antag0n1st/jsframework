(function(window){
    
    function UID () {
            throw "UID cannot be instantiated";
    }
    
    UID.current_id=1;
    UID.prefix = 'e';
    
    UID.gen = function(){
        return UID.current_id++;
    };
    
    window.UID = UID;
    
}(window));