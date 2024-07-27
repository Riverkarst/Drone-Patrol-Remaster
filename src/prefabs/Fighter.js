fighterAnimsCreated = false;
function createFighterAnimation(scene) {
    if (fighterAnimsCreated) return;
    scene.anims.create({
        key: 'fighter_flying',
        frames: scene.anims.generateFrameNumbers('spaceshipAnimated', { start: 0, end: 1, }),
        repeat: -1
    })
    fighterAnimsCreated = true;
}

class Fighter {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        createFighterAnimation(scene);
        this.sprite = this.scene.physics.add.sprite(x, y, 'spaceShipAnimated', 0);
        this.sprite.play('fighter_flying');
        this.sprite.body.setSize(game.config.width * 0.08, game.config.height * 0.06)
    }

    update() {
        if (this.scene.state == 3) {
            
        }
    }

    explode() {
        console.log("FIGHTER GO BOOM")
    }
}