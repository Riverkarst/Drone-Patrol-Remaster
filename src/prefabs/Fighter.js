fighterAnimsCreated = false;
function createFighterAnimation(scene) {
    if (fighterAnimsCreated) return;
    scene.anims.create({
        key: 'fighter_flying',
        frames: scene.anims.generateFrameNumbers('spaceshipAnimated', { start: 0, end: 1, }),
        repeat: -1
    })
    fighterAnimsCreated = true;
    scene.anims.create({
        key: 'fighter_explode',
        frames: scene.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30,
    })
}

class Fighter {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        createFighterAnimation(scene);

        this.sprite = this.scene.physics.add.sprite(x, y, 'spaceShipAnimated', 0);
        this.sprite.play('fighter_flying');
        this.sprite.body.setSize(game.config.width * 0.08, game.config.height * 0.06);
        this.sprite.setImmovable(true);

        //array of keywords for different explosion sounds
        this.explosionArray = ['explosion0', 'explosion1', 'explosion2', 'explosion3'];
        this.soundConfig = {volume:0.4}
        this.explosionSounds = [
            this.scene.sound.add('explosion0', this.soundConfig),
            this.scene.sound.add('explosion1', this.soundConfig),
            this.scene.sound.add('explosion2', this.soundConfig),
            this.scene.sound.add('explosion3', this.soundConfig), ]

        this.speed = game.config.width * 0.01;
        this.resetPosition = game.config.width * 1.5;
    }

    update() {
        if (this.scene.state == 3) {
            this.sprite.setX(this.sprite.x - this.speed);
            this.checkBounds();
        }
    }

    explode() {
        this.explosionSounds[Math.floor(Math.random()*4)].play();
        new ExplodingFighter(this.scene, this.sprite.x, this.sprite.y);
        this.sprite.setX(this.resetPosition);
    }

    checkBounds() {
        if (this.sprite.x < -game.config.width * 0.3) {
            this.sprite.setX(this.resetPosition)
        }
    }
}


class ExplodingFighter {
    constructor(scene, x, y) {
        this.sprite = scene.add.sprite(x, y, 'explosion');
        this.sprite.play('fighter_explode');
        this.sprite.on('animationcomplete', ()=>{
            this.sprite.destroy();
        }, [], this)
    }
}