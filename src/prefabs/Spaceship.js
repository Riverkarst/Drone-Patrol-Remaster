/**
 * Old Fighter enemy class
 */

class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;
        this.points = pointValue;
        this.baseSpeed = 3.5;
        this.moveSpeed = 0;
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

    activate() {
        this.moveSpeed = this.baseSpeed;
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }
}