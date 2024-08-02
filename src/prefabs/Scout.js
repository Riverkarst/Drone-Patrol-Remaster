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
        this.resetPosition = this.x;
        this.y = y;
        createScoutAnimation(scene);

        this.sprite = this.scene.physics.add.sprite(x, y, 'scout_spritesheet', 0);
        this.sprite.play('scout_flying');
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

        this.activated = false;
        this.move = false;
    }

    update() {
        if (this.move) {
            this.sprite.setX(this.sprite.x + this.speed);
            this.checkBounds();
            if (!this.activated) {
                if (this.sprite.x > game.config.width * 1.1) this.move = false;
            }
        }
    }

    explode() {
        //this.sprite.play('fighter_explode');
        this.explosionSound.play();
        new ExplodingScout(this.scene, this.sprite.x, this.sprite.y);
        this.sprite.setX(game.config.width * 1.5);
        this.scene.banner.addScore(this.scoreValue, 2);
    }

    resetPosition() {
        this.sprite.setX(this.x);
    }

    checkBounds() {
        if (this.sprite.x < -game.config.width * 0.3) {
            this.sprite.setX(this.resetPosition);
        } 
    }

    activate() {
        this.activated = true;
        this.move = true;
    }

    deactivate() {
        this.activated = false;
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