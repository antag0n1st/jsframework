(function (window, undefined) {

    function Emitter(emission_point, layer, particle_type, frequency) {
        this.initialize(emission_point, layer, particle_type, frequency);
    }

    Emitter.prototype.initialize = function (emission_point, layer, particle_type, frequency) {

        this.emission_point = emission_point;
        this.layer = layer;
        this.particle_type = particle_type;
        this.frequency = frequency;
        this.time_passed = 0;
        this.particles_count = 0; // emitted
        this.free_particles = [];
        this.is_running = false;
    };

    Emitter.prototype.reset = function () {
        this.time_passed = 0;
        this.particles_count = 0;
    };

    Emitter.prototype.get_particle = function () {
        if (this.free_particles.length === 0) {
            var particle = new this.particle_type();
            particle.emitter = this;
            this.free_particles.push(particle);
        }
        return this.free_particles.pop();
    };

    Emitter.prototype.recycle_particle = function (particle) {
        this.free_particles.push(particle);
        particle.remove_from_parent();
    };

    Emitter.prototype.start = function () {
        if (this.is_running) {
            return;
        }
        this.is_running = true;
        Actions.add(this);
    };

    Emitter.prototype.run = function () {
        if (this.is_running) {
            return;
        }
        this.is_running = true;
        Actions.add(this);
    };

    Emitter.prototype.stop = function () {
        if (!this.is_running) {
            return;
        }
        this.is_running = false;
        Actions.remove(this);
    };

    Emitter.prototype.step = function (dt) {

        this.time_passed += dt;

        var tp = Math.round(this.time_passed * this.frequency);

        var particles_to_emit = tp - this.particles_count;

        this.particles_count = tp;

        for (var i = 0; i < particles_to_emit; i++) {

            var particle = this.get_particle();
            particle.reset();
            particle.set_position(this.emission_point.x, this.emission_point.y);

            if (!this.layer) {
                throw "Please set the layer for the particle engine,better do that in the 'on_added_to_parent()' method";
            }

            this.layer.add_child(particle);
        }
    };

    window.Emitter = Emitter;

}(window));