class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.anims.create({
            key: 'flying',
            frames: this.anims.generateFrameNumbers('spaceshipAnimated', { start: 0, end: 1, }),
            repeat: -1
        })
        this.play('flying');
    }

    update() {
        //move spaceship left
        this.x -= this.moveSpeed;

        //teleport to right side of screen when reached left side
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}