//(function(window,undefined){

function Notes() {
    throw "Can't initialize Notes";
}

Notes.listeners = [];

Notes.add = function(listener,event_name) {
    // check if the object can respond to on_note method
    if (listener.on_note) {
        if (!Notes.listeners[event_name]) {
            Notes.listeners[event_name] = [];
        }
        Notes.listeners[event_name].push(listener);
    } else {
        throw "the object must implement on_note method in order to recive Notes";
    }
};

Notes.remove = function(listener, event_name) {

    if (event_name) {
        var events = Notes.listeners[event_name];
        if (events) {
            var index = events.indexOf(listener);
            if (index !== -1) {
                events.splice(index, 1);
            }
        }
    } else {
        for (var event in Notes.listeners) {
            var events = Notes.listeners[event];
            if (events) {
                var index = events.indexOf(listener);
                if (index !== -1) {
                    events.splice(index, 1);
                }
            }
        }
    }

};

Notes.remove_all = function() {
    Notes.listeners = [];
};

Notes.send = function(event_name, data, sender) {

    // check if there is such an event
    
    if(Notes.listeners[event_name]){
        var subscribers = Notes.listeners[event_name];
        for(var i=0;i<subscribers.length;i++){
            var object = subscribers[i];
            object.on_note(event_name,data,sender);
        }
    }else{
        log("You are tring to send a message for which there are no subscribers");
    }
    
};

// window.Notes = Notes;

//}(window));