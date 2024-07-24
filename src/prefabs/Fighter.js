class Fighter {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.anims.create({
            key: 'fighter_flying',
            frames: this.anims.generateFrameNumbers('spaceshipAnimated', { start: 0, end: 1, }),
            repeat: -1
        })
        this.play('flying');
    }

    update() {
        if (this.scene.state == 3) {
            
        }
    }
}