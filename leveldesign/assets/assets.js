Game.prototype.load_assets = function() {

    ////////////////////////////////////////////////////////////////////////
    //////////////////////   LOAD YOUR ASSETS HERE   ///////////////////////

        
    //ContentManager.add_spine_animation('spine_animation_nameas');    
    ContentManager.add_image('blank_black','assets/images/blank_black.png');
    ContentManager.add_image('blank_black_highlighted','assets/images/blank_black_highlighted.png');
    ContentManager.add_image('child_message','assets/images/child_message.png');
    
    ContentManager.add_file('types.json',function(data){
        var types = JSON.parse(data);      
        ContentManager.object_types = types;
    },function(){});
    
    ContentManager.add_file('layers.json',function(data){
        var layers = JSON.parse(data);      
        ContentManager.layers = layers;
    },function(){});
    
    ////////////////////////////////////////////////////////////////////////

};