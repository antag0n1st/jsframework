Game.prototype.load_assets = function () {

    ////////////////////////////////////////////////////////////////////////
    //////////////////////   LOAD YOUR ASSETS HERE   ///////////////////////

    ContentManager.add_spine('knight');
    ContentManager.add_atlas('spider_atlas');    
    ContentManager.add_image('flames');
    
    ContentManager.add_image('button');
    ContentManager.add_image('button_selected');

};
