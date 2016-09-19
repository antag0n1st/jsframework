//(function(window,undefined){
    
    function LoadingScreen(){
        this.initialize();
    }    
    
    LoadingScreen.prototype = new Screen();
    LoadingScreen.prototype.screen_initialize = LoadingScreen.prototype.initialize;    
    LoadingScreen.prototype.initialize = function(){        
        this.screen_initialize();
        
        var mid_x = Config.screen_width/2;
        var mid_y = Config.screen_height/2;
        var height = Config.screen_height;
        var width = Config.screen_width;
        
        var logo = new Sprite('logo');
        logo.set_position(mid_x,height*0.4);
        logo.set_anchor(0.5,0.5);
        
        var light1 = new Sprite('lights1');
        light1.set_position(mid_x,height*0.4);
        light1.set_anchor(0.5,0.5);
        
        var light2 = new Sprite('lights2');
        light2.set_position(mid_x,height*0.4);
        light2.set_anchor(0.5,0.5);
        
        var loading_bg = new Sprite('loading_bg');
        loading_bg.set_position(mid_x,height*0.7);
        loading_bg.set_anchor(0.5,0.5);
        
        this.loading_fr = new Sprite('loading_fr');
        this.loading_fr.set_position(mid_x - this.loading_fr.width/2 ,height*0.7);
        this.loading_fr.set_anchor(0,0.5);
        this.loading_fr.z_index = 2;
        
        this.loading_width = this.loading_fr.width;
        
        
        
        this.add_child(loading_bg);
        this.add_child(this.loading_fr);
        this.add_child(light1);
        this.add_child(light2);
        this.add_child(logo);
        
        this.rotate_light1 = new TweenRotate(light1,1,null,10000);
        this.rotate_light1.run();
        
        this.rotate_light2 = new TweenRotate(light2,-1,null,50000);
        this.rotate_light2.run();
                
    };
    
    LoadingScreen.prototype.show = function(){
        Screen.prototype.show.call(this);
        
    };
    
    LoadingScreen.prototype.hide = function(){
        Screen.prototype.hide.call(this);
        this.rotate_light1.stop()
        this.rotate_light2.stop();
    };
    
    LoadingScreen.prototype.update = function(){
        Screen.prototype.update.call(this);
         
         var to_load = ContentManager.count_resources;
         var loaded = ContentManager.loaded_resources;
         
         var loading = loaded/to_load;
        
         
         loading = (loading <=0) ? 0.01: loading;
         
         loading = (to_load === 0) ? 1 : loading;
         
         this.loading_fr.width = loading * this.loading_width;
         
        
    };
    
    LoadingScreen.prototype.on_added_to_parent = function(parent){
        Screen.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    LoadingScreen.prototype.on_remove_from_parent = function(parent){
        Screen.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    LoadingScreen.prototype.draw = function(context){
       
        Screen.prototype.draw.call(this,context);
        
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.bounds.pos.x,this.bounds.pos.y,this.width,this.height);
        
        
        
    };
    
    LoadingScreen.prototype.clear = function(context){
        
    };
    
//    window.LoadingScreen = LoadingScreen;
    
//}(window));