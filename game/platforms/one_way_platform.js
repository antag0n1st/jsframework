(function(window, undefined) {

    function OneWayPlatform(image_name) {
        this.initialize(image_name);
    }
    OneWayPlatform.prototype = new Sprite();
    OneWayPlatform.TYPE = UID.numbering();
    OneWayPlatform.prototype.parent_initialize = OneWayPlatform.prototype.initialize;    
    OneWayPlatform.prototype.initialize = function(image_name) {
        this.parent_initialize(image_name);
        this.TYPE = OneWayPlatform.TYPE;
        this.c_index = 0;
        this.response = new Response();
        this.is_dynamic = false;
    };

    OneWayPlatform.prototype.check = function(object) {
       
        var polygon = this.bounds;

        if (SAT.testPolygonPolygon(object.bounds, polygon, this.response)) {

            
            if(object.velocity.y<0){ // while jumping
                return;                
            }

            var overlap = this.response.overlapV;
            
            if(overlap.x !== 0){
                return; // if it is on the side of the platform
            }
            
             // this factor is to dinamicly prevent from passing the platform
             // if the speed is grater , then we need grater value
             // so , if the player is landing of the platform with a grater speed
             // the platform will behave like it has grater height and it will prevent
             // it from falling
            
            var factor = 20;                       
            
            var pos = object.get_position();           
            
            var p = this.get_position();
            var y = p.y + factor + (factor*object.velocity.y);
          
            if(y < pos.y){
                return;
            }
            
            if (object.velocity.y > -0.05) { // its a threshold not to start running on the edge
                    object.velocity.y = 0;
                    object.is_on_ground = true;
            }
            
                        
            pos.sub(overlap);         
            object.set_position(pos.x, pos.y);

        }
        this.response.clear();
    };
    
    
    OneWayPlatform.prototype.clear = function(context){
        
    };

    window.OneWayPlatform = OneWayPlatform;

}(window));
