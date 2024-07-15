class Sparrow extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.anims.create({
            key: 'sparrowFlying',
            frames: this.anims.generateFrameNumbers('sparrowAnimated', { start: 0, end: 3, }),
            repeat: -1
        })
        this.play('sparrowFlying');
    }

    update() {
        //move spaceship left
        this.x += this.moveSpeed+1;

        //teleport 
        if(this.x >= 2*game.config.width) {
            this.x = 0;
        }
    }

    reset() {
        this.x = -game.config.width;
    }
}