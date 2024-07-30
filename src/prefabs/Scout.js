scoutAnimsCreated = false;
function createScoutAnimation(scene) {
    if (scoutAnimsCreated) return;
    scene.anims.create({
        key: 'scout_flying',
        frames: scene.anims.generateFrameNumbers('scout_spritesheet', { start: 0, end: 3, }),
        repeat: -1
    })
    fighterAnimsCreated = true;
    scene.anims.create({
        key: 'scout_explode',
        frames: scene.anims.generateFrameNumbers('scout_explosion_spritesheet', { start: 0, end: 7, first: 0}),
        frameRate: 30,
    })
}

class Scout {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        createScoutAnimation(scene);

        this.sprite = this.scene.physics.add.sprite(x, y, 'scout_spritesheet', 0);
        this.sprite.play('scout_flying');
        console.log(this.sprite);
        this.sprite.setSize(game.config.width * 0.04, game.config.height * 0.055);
        this.sprite.setOffset(-game.config.width * 0.001, -game.config.height * 0.003);
        this.sprite.setImmovable(true);

        //array of keywords for different explosion sounds
        this.soundConfig = {volume:0.4}
        this.explosionSound = this.scene.sound.add('sparrowExplosion', this.soundConfig)

        //Fighters go at game.config.width * 0.1 speed
        this.speed = -game.config.width * 0.011;
        this.resetPosition = x;
        this.scoreValue = 40;
    }

    update() {
        if (this.scene.state == 3) {
            this.sprite.setX(this.sprite.x + this.speed);
            this.checkBounds();
        }
    }

    explode() {
        //this.sprite.play('fighter_explode');
        this.explosionSound.play();
        new ExplodingScout(this.scene, this.sprite.x, this.sprite.y);
        this.sprite.setX(game.config.width * 1.5);
        this.scene.banner.addScore(this.scoreValue);
    }

    resetPosition() {
        this.sprite.setX(game.config.width * 1.8);
    }

    checkBounds() {
        if (this.sprite.x > game.config.width * 1.7) {
            this.sprite.setX(-game.config.width * 0.5)
        } else if (this.sprite.x < -game.config.width * 0.7) {
            this.sprite.setX(game.config.width * 1.5)
        }
    }
}


class ExplodingScout {
    constructor(scene, x, y) {
        this.sprite = scene.add.sprite(x, y, 'scout_explosion_spritesheet');
        this.sprite.play('scout_explode');
        this.sprite.on('animationcomplete', ()=>{
            this.sprite.destroy();
        }, [], this)
    }
}