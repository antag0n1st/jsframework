(function (window, undefined) {

    function StageImporter() {
        this.initialize();
    }
    //StageImporter.prototype = new ParentClassName();
    //StageImporter.prototype.parent_initialize = StageImporter.prototype.initialize;    
    StageImporter.TYPE = UID.numbering();
    StageImporter.prototype.initialize = function () {
        // this.parent_initialize();
        this.TYPE = StageImporter.TYPE;

        this.platforms = [];
        this.enemies = [];
        this.obsticles = [];
        this.layers = [];

        this.spawn_point = new V();
    };

    StageImporter.prototype.get_layer_by_name = function (name) {
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if (layer.name === name) {
                return layer;
            }
        }
        return false;
    };

    StageImporter.prototype.create_layers = function (layers) {
        for (var i = 0; i < layers.length; i++) {
            var l = new Layer();
            l.name = layers[i].name;
            l.factor = layers[i].factor;
            this.layers.push(l);
        }
    };

    StageImporter.prototype.import = function (resource) {

        this.platforms = [];
        this.enemies = [];
        this.obsticles = [];
        this.layers = [];


        var level = resource.data;

        this.create_layers(level.layers);

        var obsticles = level.obsticles;

        for (var i = 0; i < obsticles.length; i++) {

            var obsticle = obsticles[i];

            var layer = this.get_layer_by_name(obsticle.layer_name);


            if (obsticle.type === 'Moving Platform') {

                var line = obsticle.children[0];
                var points = line.points;

                var p1 = new V(points[0].x + line.pos.x, points[0].y + line.pos.y);
                var p2 = new V(points[1].x + line.pos.x, points[1].y + line.pos.y);

                p1.x += obsticle.pos.x;
                p1.y += obsticle.pos.y;

                p2.x += obsticle.pos.x;
                p2.y += obsticle.pos.y;

                var float_platform = new FloatPlatform('moving_platform');
                float_platform.set_position(obsticle.pos.x, obsticle.pos.y);
                float_platform.set_anchor(0.5, 0.5);
                var bounds = new Box(new V(), 155, 40).toPolygon();
                bounds.translate(-75, -2);
                float_platform.set_bounds(bounds);
                float_platform.set_points(p1, p2);
                this.platforms.push(float_platform);
                layer.add_child(float_platform);




            } else if (obsticle.type === "Solid Platform") { // Solid Platform

                var points = [];
                for (var j = 0; j < obsticle.points.length; j++) {
                    var p = obsticle.points[j];

                    points.push(new V(p.x, p.y));
                }

                var platform = new SolidPlatform();
                platform.set_size(obsticle.width, obsticle.height);
                platform.set_position(obsticle.pos.x, obsticle.pos.y);
                platform.c_index = obsticle.c_index;
                platform.width = obsticle.width;
                platform.height = obsticle.height;
                this.platforms.push(platform);
                layer.add_child(platform);

            } else if (obsticle.type === "Slope") { // Solid Platform

                var points = [];
                for (var j = 0; j < obsticle.points.length; j++) {
                    var p = obsticle.points[j];
                    points.push(new V(p.x, p.y));
                }

                var platform = new Slope();
                var b = new Polygon(new V(obsticle.pos.x, obsticle.pos.y), points);
                platform.set_bounds(b);
                platform.set_position(obsticle.pos.x, obsticle.pos.y);
                this.platforms.push(platform);
                layer.add_child(platform);

            } else if (obsticle.type === "End") {
                this.spawn_point.x = obsticle.pos.x;
                this.spawn_point.y = obsticle.pos.y;
            } else if (obsticle.type === 'Spider') {

                var spider = new Spider();
                spider.set_position(obsticle.pos.x, obsticle.pos.y);

                spider.z_index = 5;
                spider.platforms = this.platforms;
                this.enemies.push(spider);

            } else if (obsticle.type === "Passable Platform") { // down-up Platform

                var points = [];
                for (var j = 0; j < obsticle.points.length; j++) {
                    var p = obsticle.points[j];
                    points.push(new V(p.x, p.y));
                }

                var platform = new OneWayPlatform();
                var b = new Polygon(new V(obsticle.pos.x, obsticle.pos.y), points);
                platform.set_bounds(b);
                platform.set_position(obsticle.pos.x, obsticle.pos.y);
                this.platforms.push(platform);
                layer.add_child(platform);

            } else if (obsticle.type === "Floating Platform") { // down-up Platform

                var child_bounds = obsticle.children[0];

                var points = [];
                for (var j = 0; j < child_bounds.points.length; j++) {
                    var p = child_bounds.points[j];
                    points.push(new V(p.x, p.y));
                }

                var platform = new FloatBouncePlatform(obsticle.image_name.replace('_png', ''));
                var b = new Polygon(new V(obsticle.pos.x, obsticle.pos.y), points);
            
                b.translate(child_bounds.pos.x, child_bounds.pos.y);
                b.offset.copy(child_bounds.pos);
                platform.set_bounds(b);
                platform.set_position(obsticle.pos.x, obsticle.pos.y);
                platform.initial_position.copy(obsticle.pos);
                this.platforms.push(platform);
                layer.add_child(platform);

            } else if (obsticle.object_type === "Graphic") {

                var s = new Sprite(obsticle.image_name.replace('_png', ''));
                s.z_index = obsticle.z_index;
                s.set_anchor(obsticle.anchor_x, obsticle.anchor_y);
                s.set_alpha(obsticle.alpha);
                s.set_scale_x(obsticle.scale_x);
                s.set_scale_y(obsticle.scale_y);
                s.set_position(obsticle.pos.x, obsticle.pos.y);
                s.rotate_to(obsticle.angle);
                layer.add_child(s);

            } 
            

        }

    };

    window.StageImporter = StageImporter;

}(window));