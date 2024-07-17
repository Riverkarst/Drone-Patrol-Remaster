class Sparrow extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.baseSpeed = 4.5;
        this.moveSpeed = 0;
        this.anims.create({
            key: 'sparrowFlying',
            frames: this.anims.generateFrameNumbers('sparrowAnimated', { start: 0, end: 3, }),
            repeat: -1
        })
        this.active = true;
        this.play('sparrowFlying');
    }

    update() {
        
        //move spaceship left
        this.x += this.moveSpeed;

        //teleport 
        if(this.x >= 2*game.config.width) {
            this.x = 0;
            if (!this.active == false) this.moveSpeed = 0;
        }
    }

    activate() {
        this.moveSpeed = this.baseSpeed;
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

}