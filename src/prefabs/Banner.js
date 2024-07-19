class Banner {
    constructor(scene) {
        this.scene = scene;
        this.time = 0;
        this.score = 0;
        this.stowedY = - game.config.height * 0.3;
        this.slideSpeed = game.config.height * 0.007;
        this.banner = this.scene.add.sprite(0, this.stowedY, 'banner_enlarged').setOrigin(0,0);
        this.banner.setScale(sizeMult * 0.2); //The sprite is 5x bigger than canvas, and canvas was adjusted by sizeMult

        this.textConfig = {
            fontFamily: 'NotJamSciMono',
            fontSize: '25px',
            color: '#faf6e3',
        }
        this.textY = game.config.height * 0.0335;
        this.scoreX = game.config.width * 0.26;
        this.scoreText = this.scene.add.text(this.scoreX, this.textY + this.stowedY, this.score, this.textConfig);
        this.scoreText.postFX.addGlow('0xbc451f', 1, 0.3, 0.1);

        this.timeX = game.config.width * 0.86;
        this.timeText = this.scene.add.text(this.timeX, this.textY + this.stowedY, this.time, this.textConfig);
        this.timeText.postFX.addGlow('0xbc451f', 1, 0.3, 0.1);

        this.move(game.config.height * 0.18)

        //STATES
        //1: Stowed.  In start menu, player hasn't clicked play
        //2: player just clicked play, playing slide in animation
        //3: slide in animation done, game active
        //4: game done, slide out animation playing.
        this.state = 1;
    }

    update() {
        if (this.state == 1) {
        }
        else if (this.state == 2) {
            if (this.banner.y < 0) {
                this.move(this.slideSpeed);
            } else {
                this.setActivePosition();
                this.state = 3;
            }
        } else if (this.state == 3) {
            this.scoreText.setText(String(this.scene.score));
            this.timeText.setText(String(this.scene.time));
        }

    }

    move(increment) {
        this.banner.setY(this.banner.y + increment);
        this.scoreText.setY(this.scoreText.y + increment);
        this.timeText.setY(this.timeText.y + increment);
    }

    setActivePosition() {
        this.banner.setY(0);
        this.scoreText.setY(this.textY);
        this.timeText.setY(this.textY);
    }

    activate() {
        this.state = 2;
    }
}