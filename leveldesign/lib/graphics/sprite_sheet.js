//(function(window) {

    function SpriteSheet(config) {
        this.initialize(config);
    }
    
    SpriteSheet.prototype.initialize = function(configs){
            
//            image: ContentManager.player_image,
//                    frames: {x:10,y:6},
//                    animations: {
//                        run: {start:0,end:9,loop:true,duration:300} ,
//                        idle: {start:10,end:17,loop:true,duration:300},
//                        jump: {start:20,end:25,loop:false,duration:300} 
//                    }
//                    ,reg:{x:0.5,y:0.5,width:0.35,height:0.80,left:0.0,top:0.0}

     this._animations = [];
     this._frames = [];
     this._images = [];
     this._regs = [];

     for(var i=0;i<configs.length;i++){
         var config = configs[i];
         
            this._animations.push(config.animations);
            this._frames.push(config.frames);
            this._images.push(config.image.image);
            this._regs.push(config.reg);
         
     }

       // this.image = config.image.image;
      //  this.image_name = config.image.image_name;
        
      //  this.frame_width = Math.floor(this.image.width / config.frames.x);
      //  this.frame_height = Math.floor(this.image.height / config.frames.y);

      //  this.frames = config.frames;
      //  this.animations = config.animations;
        
      //  this.reg = config.reg;
 
      
    };
    
    
    
//    window.SpriteSheet = SpriteSheet;
//
//}(window));