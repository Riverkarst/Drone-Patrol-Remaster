function setup_Rocket_Animations(scene) {
    scene.anims.create({
        repeat: 0,
        key: 'rocket_blastoff',
        frames: scene.anims.generateFrameNumbers('rocket', { start: 0, end: 6, first: 0}),
        frameRate: 30,
    })
    scene.anims.create({
        repeat: -1,
        key: 'rocket_blasting',
        frames: scene.anims.generateFrameNumbers('rocket', { start: 7, end: 13, first: 7}),
        frameRate: 30
    })
}



class Rocket {
    constructor(scene, x, y, parent) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.blastingOffFinished = false;  //Has rocket_blastoff animation finished yet?
        this.startedBlastingAnimation = false;  //Has rocket_blasting animation started yet?

        //STATES
        //1: No animation playing
        //2: rocket_blastoff animation playing
        //3: rocket_blasting animation playing
        this.state = 1;

        //Add collider first, then make rocket chain rocket sprite to collider's position
        //this.colliderWidth = game.config.width * 0.008;
        //this.colliderHeight = game.config.height * 0.05;
        //this.collider = this.scene.physics.add.body(this.x, this.y, this.colliderWidth, this.colliderHeight);
        //this.collider.setGravity(0, 700);
        //this.collider.setVelocityY(-300);

        //add sprite
        //this.xOffset = this.collider.width * 2.6;
        //this.yOffset = this.collider.height * 0.05;
        this.scene.banner.shots++;
        this.xOffset = game.config.width * 0.0035;
        this.yOffset = game.config.height * 0.07;
        this.rocketSprite = this.scene.physics.add.sprite(this.x + this.xOffset, this.y + this.yOffset, 'rocket')
        this.rocketSprite.setSize(game.config.width * 0.008, game.config.height * 0.05);
        this.rocketSprite.setOffset(game.config.width * 0.021, 0)
        this.rocketSprite.setDepth(-1);

        this.startingVelocity = -400;
        this.blastoffPower = -4500;
        this.rocketSprite.setGravity(0, 1000);
        this.fuelTimer = 6;

        this.rocketSprite.setVelocityY(this.startingVelocity);
        this.paused = false;
        this.fuelState = 1; //controls whether fuel has kicked in or not yet
        //this.scene.clock.delayedCall(this.blastoffDelay, this.startFuel, [], this)

        this.fighter1Ref = this.scene.fighter1;
        this.fighter2Ref = this.scene.fighter2;
        this.fighter3Ref = this.scene.fighter3;
        this.scoutRef = this.scene.scout;

        //setup the delayed fuel blastoff
        //this.blastoffDelay = 200;
        //this.scene.clock.delayedCall(this.blastoffDelay, ()=>{
        //    this.rocketSprite.anims.play('rocket_blastoff')
        //}, [], this)
        //this.scene.clock.delayedCall(this.blastoffDelay, this.startFuel, [], this)

        //cleanup will be done by Launcher object
        this.outOfBounds = false;
        this.destroyed = false;

        this.savedSpeed = 0;
        this.savedVelocity = 0;
        this.savedAcceleration = 0;

    }

    update() {
        //before fuel kicks in
        if (this.fuelState == 1) {
            if (!this.paused) {
                this.fuelTimer--;
                if (this.fuelTimer <= 0) {
                    this.startFuel();
                    this.fuelState = 2;
                }
            } else if (this.paused) {}
        } else if (this.fuelState == 2) {};

        this.checkAllCollisions();
        this.checkOutOfBounds();
    }

    startFuel() {
        this.rocketSprite.body.setAccelerationY(this.blastoffPower);
        this.rocketSprite.anims.play('rocket_blastoff');
    }

    //check if out of bounds.  if so, launcher object is responsible for destroying it.
    checkOutOfBounds() {
        if (this.rocketSprite.y > game.config.width * 1.2 || this.rocketSprite.y < 0 - game.config.width * 0.2) {
            this.destroy();
        }
    }

    destroy() {
        //this.collider.destroy();
        this.destroyed = true;
        this.rocketSprite.destroy();
    }

    checkAllCollisions() {
        this.checkCollision(this.fighter1Ref);
        this.checkCollision(this.fighter2Ref);
        this.checkCollision(this.fighter3Ref);
        this.checkCollision(this.scoutRef);
        //this.checkCollision(this.scout.sprite);
    }

    checkCollision(other) {
        if (this.scene.physics.collide(this.rocketSprite, other.sprite)) {
            this.destroy();
            other.explode();
            this.scene.banner.hits++;
        }
    }

    pause() {
        if (this.destroyed) return;
        this.savedAcceleration = this.rocketSprite.body.acceleration.y;
        this.savedSpeed = this.rocketSprite.body.speed;
        this.savedVelocity = this.rocketSprite.body.velocity.y;
        this.savedGravity = this.rocketSprite.body.gravity.y;
        //console.log(this.rocketSprite.body.acceleration.y);
        this.rocketSprite.body.stop();
        this.rocketSprite.setGravity(0,0);
        if (this.fuelTimer<=0) this.rocketSprite.anims.pause();
        this.paused = true;

    }

    unpause() {
        if (this.destroyed) return;
        this.rocketSprite.body.setGravity(0, this.savedGravity);
        this.rocketSprite.body.setVelocityY(this.savedVelocity);
        this.rocketSprite.body.setAccelerationY(this.savedAcceleration);
        if (this.fuelTimer<=0) this.rocketSprite.anims.resume();
        this.paused = false;
    }

}