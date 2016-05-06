(function (window, undefined) {

    function PlayerStates(player) {
        this.initialize(player);
    }
    //PlayerStates.prototype = new ParentClassName();
    //PlayerStates.prototype.parent_initialize = PlayerStates.prototype.initialize;    
    PlayerStates.prototype.initialize = function (player) {
        // this.parent_initialize();

        this.player = player;

        // idle
        // running
        // jumping
        // falling
        // attacking
        // wall_drag
        // dive_attack
        // death
        // damage
        // ritual

        var states = [
            {
                name: 'idle',
                initial: true,
                events: {
                    running: 'running',
                    jumping: 'jumping',
                    attacking: 'attacking',
                    wall_push: 'wall_push',
                    death: 'death',
                    damage: 'damage',
                    falling: 'falling'
                }
            },
            {
                name: 'running',
                events: {
                    idle: 'idle',
                    jumping: 'jumping',
                    falling: 'falling',
                    attacking: 'attacking',
                    death: 'death',
                    damage: 'damage',
                    wall_drag: 'wall_drag',
                    dive_attack: 'dive_attack'
                }
            },
            {
                name: 'jumping',
                events: {
                    idle: 'idle',
                    falling: 'falling',
                    attacking: 'attacking',
                    running: 'running',
                    wall_drag: 'wall_drag',
                    dive_attack: 'dive_attack',
                    death: 'death',
                    damage: 'damage',
                    double_jumping: 'double_jumping'

                }
            },
            {
                name: 'double_jumping',
                events: {
                    idle: 'idle',
                    falling: 'falling',
                    attacking: 'attacking',
                    running: 'running',
                    wall_drag: 'wall_drag',
                    dive_attack: 'dive_attack',
                    death: 'death',
                    damage: 'damage'
                }
            },
            {
                name: 'falling',
                events: {
                    idle: 'idle',
                    attacking: 'attacking',
                    running: 'running',
                    wall_drag: 'wall_drag',
                    dive_attack: 'dive_attack',
                    death: 'death',
                    damage: 'damage',
                    ritual: 'ritual',
                    double_jumping: 'double_jumping',
                    jumping: 'jumping'
                }
            },
            {
                name: 'attacking',
                events: {
                    idle: 'idle',
                    running: 'running',
                    jumping: 'jumping',
                    falling: 'falling',
                    wall_drag: 'wall_drag',
                    dive_attack: 'dive_attack',
                    death: 'death',
                    damage: 'damage'
                }
            },
            {
                name: 'dive_attack',
                events: {
                    jumping: 'jumping',
                    falling: 'falling',
                    idle: 'idle',
                    running: 'running',
                    death: 'death',
                    damage: 'damage'
                }
            },
            {
                name: 'death',
                events: {
                    falling: 'falling',
                    jumping: 'jumping',
                    idle: 'idle'
                }
            },
            {
                name: 'damage',
                events: {
                    falling: 'falling',
                    jumping: 'jumping',
                    idle: 'idle',
                    running: 'running',
                    death: 'death',
                    attacking: 'attacking'
                }
            },
            {
                name: 'wall_drag',
                events: {
                    jumping: 'jumping',
                    idle: 'idle',
                    falling: 'falling',
                    running: 'running',
                    damage: 'damage',
                    death: 'death',
                    dive_attack: 'attacking',
                    ritual: 'ritual'
                }
            }
        ];

        this.fsm = new StateMachine(states);
        this.fsm.subscribe("*", this);
        
        Notes.add(this, Notes.NOTE_SIDE_FLIPPED);
    };

    PlayerStates.prototype.update = function () {

        var that = this;


        if (this.player.velocity.y !== 0) {
            this.player.is_on_ground = false;
        }
        
        if (this.player.velocity.x > 0 && this.player.current_flipped === true) {           
            Notes.send(Notes.NOTE_SIDE_FLIPPED, null, this.player);
        } else if (this.player.velocity.x < 0 && this.player.current_flipped === false) {
            Notes.send(Notes.NOTE_SIDE_FLIPPED, null, this.player);
        }

//        if (this.player.velocity.y < this.player.dive_treshold &&
//                this.player.velocity.y > -this.player.dive_treshold &&
//                !this.player.is_on_ground &&
//                !this.player.is_wall_drag &&
//                this.player.controller.is_down &&
//                !this.player.controller.is_attacking &&
//                Ticker.time - this.player.dive_attack_time > 1000
//                ) {
//            this.player.dive_attack_time = Ticker.time;
//            this.player.is_dive_attacking = true;
//        }

        if (this.fsm.currentState.name === 'dive_attack') {
            this.player.controller.is_attacking = false;
        }

        if (this.player.is_on_ground) {

            if (this.player.is_dead) {
                this.fsm.set('death');
            } else if (this.player.is_under_attack) {
                this.fsm.set('damage');
            } else if (this.player.is_dive_attacking) {
                this.fsm.set('dive_attack');
            } else if (this.player.controller.is_attacking) {
                this.fsm.set('attacking');
            } else if (this.player.is_wall_drag) {
                this.fsm.set('wall_drag');
            } else if (this.player.controller.is_ritual && this.player.is_shaman) {
                this.fsm.set('ritual');
            } else if (this.player.velocity.x !== 0) {
                this.fsm.set('running');
            } else {
                this.fsm.set('idle');
            }

        } else {

            if (this.player.is_dead) {
                this.fsm.set('death');
            } else if (this.player.is_under_attack) {
                this.fsm.set('damage');
            } else if (this.player.is_dive_attacking) {
                this.fsm.set('dive_attack');
            } else if (this.player.controller.is_attacking) {
                this.fsm.set('attacking');
            } else if (this.player.is_wall_drag) {
                this.fsm.set('wall_drag');
            } else if (this.player.velocity.y < 0 && !this.player.can_double_jump) {
                this.fsm.set('double_jumping');
            } else if (this.player.velocity.y > 0) {
                this.fsm.set('falling');
            } else if (this.player.velocity.y < 0) {
                this.fsm.set('jumping');
            }
        }

    };

    PlayerStates.prototype.on_state = function (prev_state, current_state, data) {



        if (prev_state.name === 'falling' && (current_state.name === 'idle' || current_state.name === 'running')) {
            //  Sounds.fall.play();
        }

        if (current_state.name == 'jumping' && prev_state.name !== 'dive_attack') {

            if (this.player.is_enchanted) {

                if (!this.player.have_witnessed) {
                    this.player.have_witnessed = true;
                    // Sounds.witness_meee.volume(0.7).play();
                } else {
                    // Sounds.jump_1.volume(0.7).play();
                }

            } else {
                //  Sounds.jump_1.volume(0.7).play();
            }


        }

        if (prev_state.name === 'wall_drag') {
            //  Sounds.slide.stop();
        } else if (current_state.name === 'wall_drag') {

            // Sounds.slide.volume(0.1).loop(true).play();
        }



        if (current_state.name === 'idle') {
            this.player.play('idle', true, this.player.current_flipped);
        } else if (current_state.name === 'running') {
            this.player.play('run', true, this.player.current_flipped);
        } else if (current_state.name === 'jumping') {
            this.player.play('jump', false, this.player.current_flipped);
        } else if (current_state.name === 'falling') {
            this.player.play('fall', false, this.player.current_flipped);
        } else if (current_state.name === 'attacking') {

            // Sounds.sword_attack.play();


            if (Ticker.time - this.player.attack_time > 400) {
                this.player.attack_count = 0;
            }
            this.player.attack_time = Ticker.time;

            var at = this.player.attack_count++ % 3;

//            this.player.play('attack_'+(at+1), false, this.player.current_flipped, function ()
//            {
//                this.controller.is_attacking = false;
//            });
        } else if (current_state.name === 'dive_attack') {

//            this.player.controller.is_attacking = false;
//            this.player.is_dive_attacking = true;
//
//            this.player.play('dive_attack', false, this.player.current_flipped, function ()
//            {
//                this.is_dive_attacking = false;
//            });
        } else if (current_state.name === 'death') {
            this.player.play('death', false, this.player.current_flipped);
        } else if (current_state.name === 'wall_drag') {
            this.player.velocity.y *= 0.1;
            this.player.play('wall_drag', true, this.player.current_flipped);
        } else if (current_state.name === 'damage') {
            var that = this;
            this.player.is_wall_drag = false;
//            this.player.play('damage',false,this.player.current_flipped,function ()
//            {
//              that.player.controller.is_locked = false;
//              that.player.is_under_attack = false;
//              
//             
//              
//            });
        } else if (current_state.name === 'ritual') {
            this.player.play('ritual', true, this.player.current_flipped);
        }

        if (prev_state.name === 'falling' && (
                current_state.name === 'idle' ||
                current_state.name === 'running')) {

            Notes.send(Notes.CHARACTER_LANDED, this.player, this);
        }

        if (current_state.name === 'dive_attack') {
            // this.player.dash.is_visible = true;
        } else if (prev_state.name === 'dive_attack') {
            //  this.player.dash.is_visible = false;
        }
        
    };

    PlayerStates.prototype.on_note = function (event_name, data, sender) {

        if (sender === this.player) {
            if (
                    this.player.current_animation !== 'attack_1' &&
                    this.player.current_animation !== 'attack_2' &&
                    this.player.current_animation !== 'attack_3' &&
                    this.player.current_animation !== 'dive_attack' &&
                    this.player.current_animation !== 'damage' &&
                    this.player.current_animation !== 'death' &&
                    this.player.current_animation !== 'wall_drag'
                    ) {

                this.player.current_flipped = !this.player.current_flipped;
                this.player.play(this.player.current_animation, true, this.player.current_flipped);
            }
        }



    };

    window.PlayerStates = PlayerStates;

}(window));