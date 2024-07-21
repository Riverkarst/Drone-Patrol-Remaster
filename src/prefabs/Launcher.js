class Launcher {
    constructor(scene) {
        this.scene = scene;
        
        this.activated = true;
        this.activatedRackY = 0;
        this.activatedLauncherY = game.config.height * 0.913;

        //add component sprites: launcher and launcher rack
        this.rack = this.scene.add.sprite(0, this.activatedRackY, 'launcher_rack_x5');
        this.rack.setScale(0.2 * sizeMult);
        this.rack.setOrigin(0,0);
        this.launcher = this.scene.add.sprite(game.config.width * 0.5, this.activatedLauncherY, 'launcher', 0);
        this.launcher.setOrigin(0.5, 0.5);

        //setting up animations
        /*this.scene.anims.create({
            key: 'launcher_fire_1',
            frames: this.scene.anims.generateFrameNumbers('launcher', { start: 0, end: 9, first: 0}),
            frameRate: 30,
        });
        this.launcher.anims.play('launcher_fire_1');   //play explode animation
        this.launcher.on('animationcomplete', ()   => { //callback after anim completes
            console.log("done");
        })*/

        this.firingSpeed = 2;
        this.reloadSpeed = 10;
        this.lightRestartSpeed = 2;
        this.setUpAnimations();

        /*this.launcher.anims.play('launcher_light_restart_4');   
        this.launcher.on('animationcomplete', ()   => { 
            console.log("done");
        })*/
    }



    update() {
        //if (this.scene.state == 3) {

        //}
    }

    setUpAnimations() {
        //Firing with full tube of rockets
        this.scene.anims.create({
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
                start: 31,
                end: 72,
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
                end: 115,
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
                end: 159,
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
                end: 204,
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
        }); 
        

    }


}
