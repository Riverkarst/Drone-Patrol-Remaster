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
    constructor(scene, x, y) {
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
        this.colliderWidth = game.config.width * 0.008;
        this.colliderHeight = game.config.height * 0.05;
        this.collider = this.scene.physics.add.body(this.x, this.y, this.colliderWidth, this.colliderHeight);
        this.xOffset = this.collider.width * 2.6;
        this.yOffset = this.collider.height * 0.05;
        this.rocketSprite = this.scene.add.sprite(this.x - this.xOffset, this.y - this.yOffset, 'rocket').setOrigin(0,0);
        //this.collider.setGravity(0, 700);
        //this.collider.setVelocityY(-300);
        this.rocketSprite.anims.play('rocket_blastoff')
        /*this.rocketSprite.on('animationcomplete', ()=>{
            if (this.startedBlastingAnimation) return;
            this.blastingOffFinished = true;
        });*/

        /*littleBoom.anims.play('sparrowExplode');   //play explode animation
        littleBoom.on('animationcomplete', ()   => { //callback after anim completes
            ship.reset();                       //reset ship position
            ship.alpha = 1;                     //make ship visible again
            littleBoom.destroy();                     //remove explosion sprite
        })*/

        //this.rocketSprite = this.scene.physics.add.image(this.x, this.y, 'rocket')
        //this.rocketSprite.anims.play('rocket_blastoff')
    }

    update() {
        this.rocketSprite.setX(this.collider.x - this.xOffset);
        this.rocketSprite.setY(this.collider.y - this.yOffset);
        //if (this.blastingOffFinished && !this.startedBlastingAnimation) {
        //    this.rocketSprite.anims.play('rocket_blasting');
        //    this.startedBlastingAnimation = true;
        //}
    }
}