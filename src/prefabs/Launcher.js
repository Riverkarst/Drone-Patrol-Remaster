class Launcher {
    constructor(scene) {
        this.scene = scene;
        
        this.activated = true;
        this.activatedRackY = 0;
        this.activatedLauncherY = game.config.height * 0.912;
        this.rackBoundLeft = game.config.width * 0.035;
        this.rackBoundRight = game.config.width - this.rackBoundLeft;
        this.stowedOffset = game.config.height * 0.15;
        this.activationSlideSpeed = game.config.height * 0.009;

        //add component sprites: launcher and launcher rack
        this.rack = this.scene.add.sprite(0, this.activatedRackY + this.stowedOffset, 'launcher_rack_x5');
        this.rack.setScale(0.2 * sizeMult);
        this.rack.setOrigin(0,0);
        this.launcher = this.scene.add.sprite(game.config.width/2, this.activatedLauncherY + this.stowedOffset, 'launcher', 0);
        this.launcher.setOrigin(0.5, 0.5);
        this.movementSpeed = game.config.width * 0.01;

        this.firingSpeed = 30;
        this.reloadSpeed = 60;
        this.lightRestartSpeed = 2;
        this.setUpAnimations();

        this.fireSide = 1;
        this.ammo = 4;
        this.justFired = false;
        //small delay after firing before you can fire again
        this.disabled = false;
        this.fireDelaying = false; 
        this.shotDelay = 50; 
        this.reloadDelay = 2000;

        //update stats after reload animation is done
        this.launcher.on('animationcomplete', ()=>{
            this.reloadBanner();
            this.reloading=false
        }, this);

        this.rocketArray = new Array();
        this.rocketXLeft = this.launcher.x - this.launcher.width * 0.2
        this.rocketXRight = this.launcher.x + this.launcher.width * 0.05;
        this.rocketY = this.activatedLauncherY - this.launcher.height * 0.15;

        //launch1  sfx_rocket  blastoff  blastoff2  blastoff3
        this.blastoffSound = this.scene.sound.add('blastoff2');
        this.blastoffConfig = { loop:false, volume:0.1 };
        this.reloadSound = this.scene.sound.add('reload');
        this.reloadConfig = { loop:false, volume:1 };
        this.reloadStartSound = this.scene.sound.add('reloadStart');
        this.reloadStartConfig = { loop:false, valume: 0.05 }
        
        //STATES
        //1: On menu, waiting for player to click play
        //2: Player just clicked play, now moving into active position
        //3: Moved into active position, controls now active
        //4: Time up, stow called by Banner
        this.state = 1;

        //this.rocketSemaphore = 1;
    }

    activate() {
        this.state = 2;
        this.launcher.setX(game.config.width * 0.5)
    }

    stow() {
        this.state = 4;
    }

    update() {
        if (this.state == 1) { //On menu waiting for player to click play
            return;
        } else if (this.state == 2) {  //player just clicked play, now moving into active position
            this.rack.setY(this.rack.y - this.activationSlideSpeed);
            this.launcher.setY(this.launcher.y - this.activationSlideSpeed);
            if (this.rack.y <= this.activatedRackY) {
                this.rack.setY(this.activatedRackY);
                this.launcher.setY(this.activatedLauncherY);
                this.state = 3;
            }
        }
        else if (this.state == 3) {  //in active position, controls active.
            //MOVEMENT CODE
            if ((keyLEFT.isDown || keyA.isDown) && (!keyRIGHT.isDown || !keyD.isDown)) {
                this.launcher.setX(Math.max((this.launcher.x - this.movementSpeed), this.rackBoundLeft));
            } 
            if ((keyRIGHT.isDown || keyD.isDown) && (!keyLEFT.isDown || !keyA.isDown)) {
                this.launcher.setX(Math.min((this.launcher.x + this.movementSpeed), this.rackBoundRight));
            }

            //FIRING CODE
            /*if (keyZ.isDown && !this.justFired) {
                this.fire();
                this.justFired = true;
            } else if (keyZ.isUp) {
                this.justFired = false;
            } */
           //console.log(this.fireDelaying);
           /*if (keyZ.isDown && !this.fireDelaying) {
                this.fire();
                this.fireDelaying = true;
                this.scene.clock.delayedCall(500, ()=>{
                    this.fireDelaying = false;
                }, [], this)
           }*/
          if ((keyZ.firstDown || keySPACE.firstDown) && !this.fireDelaying) {
            this.fire();
          }
            //RELOADING CODE
            /*if (keyX.firstDown && !this.fireDelaying && !this.reloading) {
                this.reload();
            }*/

            this.rocketXLeft = this.launcher.x - this.launcher.width * 0.2
            this.rocketXRight = this.launcher.x + this.launcher.width * 0.05;
            //update rocket array
            /*for (let i = 0; i < this.rocketArray.length; i++) {
                if (this.rocketArray[i] != undefined && this.rocketArray[i] != null) {
                    if (this.rocketArray[i].destroyed) this.rocketArray[i] = null;
                     else this.rocketArray[i].update();
                }
            }*/
        } else if (this.state == 4) {  //Time up, stow called by Banner
            this.rack.setY(this.rack.y + this.activationSlideSpeed);
            this.launcher.setY(this.launcher.y + this.activationSlideSpeed);
            if (this.rack.y >= this.activatedRackY + this.stowedOffset) {
                this.rack.setY(this.activatedRackY + this.stowedOffset);
                this.launcher.setY(this.activatedLauncherY + this.stowedOffset);
                this.state = 1;
                //this._discreteReload();
            }
        }
    }

    updateRockets() {
        this.rocketSemaphore = false;
        for (let i = 0; i < this.rocketArray.length; i++) {
            if (this.rocketArray[i] != undefined && this.rocketArray[i] != null) {
                if (this.rocketArray[i].destroyed) this.rocketArray[i] = null;
                 else this.rocketArray[i].update();
            }
        }
        this.rocketSemaphore = true;
    }

    fire() {
        if (this.scene.banner.carpalTunnelCountermeasure == true) return;
        if (this.fireDelaying || this.reloading) return;

        this.scene.banner.addCarpalTunnel();
        this.blastoffSound.play(this.blastoffConfig);
        let x;
        let fireAnim
        if (this.fireSide == 1) {
            x = this.rocketXLeft;
            fireAnim = 'launcher_fire_1'
            this.fireSide = 2;
        } else if (this.fireSide == 2) {
            x = this.rocketXRight;
            fireAnim = 'launcher_fire_2'
            this.fireSide = 1;
        }         
        this.fireDelaying = true;
        this.scene.clock.delayedCall(this.shotDelay, ()=>{this.fireDelaying=false}, this);
        this.launcher.anims.play(fireAnim); 
        this.rocketArrayPush(new Rocket(this.scene, x, this.rocketY, this));
    }

    /*
    fire() {
        if (this.fireDelaying || this.reloading) return;
        this.blastoffSound.play(this.blastoffConfig);
        if (this.ammo == 4) {
            this.fireDelaying = true;
            this.scene.clock.delayedCall(this.shotDelay, ()=>{this.fireDelaying=false}, this);
            this.launcher.anims.play('launcher_fire_1'); 
            this.rocketArrayPush(new Rocket(this.scene, this.rocketXLeft, this.rocketY, this));
            this.ammo = 3;  
            this.scene.banner.remainingRockets[0].setAlpha(0.2);
        } else if (this.ammo == 3) {
            this.fireDelaying = true;
            this.scene.clock.delayedCall(this.shotDelay, ()=>{this.fireDelaying=false}, this);
            this.launcher.anims.play('launcher_fire_2');
            this.rocketArrayPush(new Rocket(this.scene, this.rocketXRight, this.rocketY, this));
            this.ammo = 2;   
            this.scene.banner.remainingRockets[1].setAlpha(0.2);
        } else if (this.ammo == 2) {
            this.fireDelaying = true;
            this.scene.clock.delayedCall(this.shotDelay, ()=>{this.fireDelaying=false}, this);
            this.launcher.anims.play('launcher_fire_3');   
            this.rocketArrayPush(new Rocket(this.scene, this.rocketXLeft, this.rocketY, this));
            this.ammo = 1;
            this.scene.banner.remainingRockets[2].setAlpha(0.2);
        } else if (this.ammo == 1) {
            this.fireDelaying = true;
            this.scene.clock.delayedCall(this.shotDelay, ()=>{
                this.fireDelaying=false;
                //this.reload();
            }, this);
            this.launcher.anims.play('launcher_fire_4');
            this.rocketArrayPush(new Rocket(this.scene, this.rocketXRight, this.rocketY, this));
            this.ammo = 0;   
            this.scene.banner.remainingRockets[3].setAlpha(0.2);
        }
    }*/

    //input should be "l" or "r" for left or right
    rocketArrayPush(newRocket) {
        /*let side;
        if (input == "l") side = this.rocketXLeft;
        else side = this.rocketXRight;
        //populate undefined spaces in rocketarray first before creating new entry
        for (let i = 0; i < this.rocketArray.length; i++) {
            if (this.rocketArray[i] == undefined || this.rocketArray[i] == null) {
                this.rocketArray[i] = new Rocket(this.scene, this.side, this.rocketY);
                return;
            }
        }
        this.rocketArray.push(new Rocket(this.scene, this.side, this.rocketY));*/
        for (let i = 0; i < this.rocketArray.length; i++) {
            if (this.rocketArray[i] == undefined || this.rocketArray[i] == null) {
                this.rocketArray[i] = newRocket;
                return;
            }
        }
        this.rocketArray.push(newRocket);
    }

    reload() {
        if (this.fireDelaying || this.reloading || this.ammo == 4) return;
        this.reloadStartSound.play(this.reloadStartConfig);
        this.scene.clock.delayedCall(200, ()=>{
            this.reloadSound.play(this.reloadConfig);
        }, [], this)
        //reloading 1 rocket
        if (this.ammo == 3) {
            this.reloading = true;
            this.launcher.anims.play('launcher_reload_1');
            this.ammo = 4;
        } else if (this.ammo == 2) {
            this.reloading = true;
            this.launcher.anims.play('launcher_reload_2');
            this.ammo = 4;
        } else if (this.ammo == 1) {
            this.reloading = true;
            this.launcher.anims.play('launcher_reload_3');
            this.ammo = 4;
        } else if (this.ammo == 0) {
            this.reloading = true;
            this.launcher.anims.play('launcher_reload_4');
            this.ammo = 4;
        }
    }

    _discreteReload() {
        this.ammo = 4;
        this.launcher.anims.play('launcher_reload_4');
        for (let i=0; i<this.scene.banner.remainingRockets.length; i++) {
            this.scene.banner.remainingRockets[i].setAlpha(1);
        }
    }

    reloadBanner() {
        if (!this.reloading) return;
        for (let i=0; i<this.scene.banner.remainingRockets.length; i++) {
            this.scene.banner.remainingRockets[i].setAlpha(1);
        }
    }

    pauseRockets() {
        this.launcher.anims.pause();
        for (let i=0; i<this.rocketArray.length; i++) {
            if (this.rocketArray[i] != null && this.rocketArray[i] != undefined) {
                this.rocketArray[i].pause();
            }
        }
    }

    unpauseRockets() {
        this.launcher.anims.resume();
        for (let i=0; i<this.rocketArray.length; i++) {
            if (this.rocketArray[i] != null && this.rocketArray[i] != undefined) {
                this.rocketArray[i].unpause();
            }
        }
    }


//=============================================================================
// CREATING ANIMATIONS
//=============================================================================


    setUpAnimations() {
        this.scene.anims.create({
            key: 'launcher_fire_1',
            repeat:0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 0,
                end: 7,
                zeroPad: 4,
            }),
            frameRate: this.firingSpeed,
        })
        this.scene.anims.create({
            key: 'launcher_fire_2',
            repeat:0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 8,
                end: 15,
                zeroPad: 4,
            }),
            frameRate: this.firingSpeed,
        })
        //Firing with full tube of rockets
        /*this.scene.anims.create({
            key: 'launcher_fire_1',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 0,
                end: 7,
                zeroPad: 4,
            }),
            frameRate: this.firingSpeed,
        });
        //Firing with 3 out of 4 rockets remaining
        this.scene.anims.create({
            key: 'launcher_fire_2',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 8,
                end: 15,
                zeroPad: 4,
            }),
            frameRate: this.firingSpeed,
        });
        //Firing with 2 out of 4 rockets remaining
        this.scene.anims.create({
            key: 'launcher_fire_3',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 16,
                end: 23,
                zeroPad: 4,
            }),
            frameRate: this.firingSpeed,
        });
        //Firing with 1 out of 4 rockets remaining
        this.scene.anims.create({
            key: 'launcher_fire_4',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 24,
                end: 31,
                zeroPad: 4,
            }),
            frameRate: this.firingSpeed,
        });

        //RELOADS
        //Reloading 1 rocket
        this.scene.anims.create({
            key: 'launcher_reload_1',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 32,
                end: 73,
                zeroPad: 4,
            }),
            frameRate: this.reloadSpeed,
        });        
        //Reloading 2 rockets
        this.scene.anims.create({
            key: 'launcher_reload_2',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 75,
                end: 117,
                zeroPad: 4,
            }),
            frameRate: this.reloadSpeed,
        });        
        //Reloading 3 rockets
        this.scene.anims.create({
            key: 'launcher_reload_3',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 119,
                end: 162,
                zeroPad: 4,
            }),
            frameRate: this.reloadSpeed,
        });        
        //Reloading 4 rockets
        this.scene.anims.create({
            key: 'launcher_reload_4',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 164,
                end: 208,
                zeroPad: 4,
            }),
            frameRate: this.reloadSpeed,
        });
        
        //LIGHT RESTART ANIMATIONS
        //Restarting from 1 rocket reload
        this.scene.anims.create({
            key: 'launcher_light_restart_1',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 72,
                end: 73,
                zeroPad: 4,
            }),
            frameRate: this.lightRestartSpeed,
        }); 
        //Restarting from 2 rocket reload
        this.scene.anims.create({
            key: 'launcher_light_restart_2',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 115,
                end: 117,
                zeroPad: 4,
            }),
            frameRate: this.lightRestartSpeed,
        }); 
        //Restarting from 3 rocket reload
        this.scene.anims.create({
            key: 'launcher_light_restart_3',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 159,
                end: 162,
                zeroPad: 4,
            }),
            frameRate: this.lightRestartSpeed,
        });  
        //Restarting from 4 rocket reload
        this.scene.anims.create({
            key: 'launcher_light_restart_4',
            repeat: 0,
            frames: this.scene.anims.generateFrameNames('launcher', {
                prefix: 'frame',
                suffix: '.png',
                start: 204,
                end: 208,
                zeroPad: 4,
            }),
            frameRate: this.lightRestartSpeed,
        }); */
        

    }


}
