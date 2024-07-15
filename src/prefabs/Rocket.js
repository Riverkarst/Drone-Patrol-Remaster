class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);  //add to existing, diplayList, & updateList
        this.isFiring = false;  
        this.moveSpeed = 2;
        this.sfxRocket = scene.sound.add('sfx_explosion'); // assigning sfxRocket with scene's sfx_explosion sound in order to access it 
        this.readyVoice = scene.sound.add('ready');
        this.rearmingVoice = scene.sound.add('rearming');
        this.status = 'ready';
    }

    getStatus() {
        return this.status;
    }

    update() {
        if (this.isFiring) { this.status = 'rearming';}
        else if (!this.isFiring) { this.status = 'ready';}
        //left/right movement
        if (!this.isFiring) {
            //this.x = this.pointer.x;
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
            //this.time.delayedCall(1000, this.rearmingVoice.play(), null, this);
            this.rearmingVoice.play();
        }
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            //this.isFiring = false;
            //this.y = game.config.height - borderUISize - borderPadding;
            this.reset();
            this.readyVoice.play();
        }
    }

    // reset rocket to ground instead of having to wait for it to reach the top
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding - 20;
    }

}