class GameOverScreen {
    constructor(scene, banner) {
        this.scene = scene;
        this.banner = banner;

        this.score = 0;
        this.highScore = false;
        this.fightersKilled = 0;
        this.fighterCounter = {val:0};  //It's an object because I want to pass it by reference
        this.fighterScoreVal = 10;
        this.scoutsKilled = 0;
        this.scoutCounter = {val:0};  //It's an object because I want to pass it by reference
        this.scoutScoreVal = 40;

        //0: Inactive, alpha 0.
        //1: 
        this.state = 0;

        this.textConfig = {
            fontFamily: 'NotJamSciMono',
            fontSize: '30px',
            color: '#000000',  
            align: 'center',
        }
        this.textConfigSmall = {
            fontFamily: 'NotJamSciMono',
            fontSize: '15px',
            color: '#000000',  
            align: 'center',
        }

        //place elements
        this.anchorPointX = game.config.width * 0.25;
        this.anchorPointY = game.config.height * 0.35;
        this.fighterSprite = this.scene.add.sprite(this.anchorPointX, this.anchorPointY, "spaceshipAnimated", 0).setOrigin(0,0);
        this.fighterSprite.play('fighter_flying');
        this.fighterCountText = scene.add.text(this.anchorPointX + game.config.width * 0.12, this.anchorPointY, 'x' + String(this.fighterCounter), this.textConfig)
        this.fighterScoreText = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY, "150", this.textConfig);
        this.scoutSprite = this.scene.add.sprite(this.anchorPointX, this.anchorPointY + game.config.height*0.1, "scout_spritesheet", 0).setOrigin(0,0);
        this.scoutSprite.play('scout_flying');
        this.scoutCountText = scene.add.text(this.anchorPointX + game.config.width * 0.12, this.anchorPointY + game.config.height*0.1, 'x' + String(this.scoutCounter), this.textConfig);
        this.scoutScoreText = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY + game.config.height*0.1, '300', this.textConfig);
        this.line = this.scene.add.rectangle(this.anchorPointX, this.anchorPointY + game.config.height*0.18, game.config.width * 0.5, game.config.height*0.006, this.textConfig.color).setOrigin(0,0)
        this.scoreWordText = this.scene.add.text(this.anchorPointX, this.anchorPointY + game.config.height*0.22, "SCORE", this.textConfig);
        this.scoreText = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY + game.config.height*0.22, "450", this.textConfig);
        this.hiScoreText = this.scene.add.text(this.anchorPointX + game.config.width * 0.51, this.anchorPointY + game.config.height * 0.3, "HI-SCORE!", this.textConfigSmall).setOrigin(1,0);
        this.hiScoreText.setAlpha(0);
        this.setAlpha(0);

        this.countupSound = this.scene.sound.add('countup', {volume:0.5});
        this.hiScoreSound = this.scene.sound.add('highscore', {volume:0.8})

        //STATES
        //1: Inactive
        //2: Just got activated.  Showing sprites and "SCORE".  Made delayed call to begin tallying fighters
        //  2.1:
        this.state = 1;


        //OPERATION STATS
        this.countSpeed = 100;  //amount of milliseconds between each count lerp step
    }

    start() {
        this._updateInfo();
        this.state = 2;
    }

    update() {
        if (this.state == 1) { //Inactive
        } else if (this.state == 2) { //Just got activated.  start fighter counter
            this.fighterSprite.setAlpha(1);
            this.scoutSprite.setAlpha(1);
            this.line.setAlpha(1);
            this.scoreWordText.setAlpha(1);
            this.scene.clock.delayedCall(800, ()=>{ //starting fighterCounter lerp
                this.fighterCountText.setAlpha(1);
                this._countLerp(this.fighterCountText, this.fighterCounter, this.fightersKilled)
            }, [], this)
            this.state = 2.1;
        } else if (this.state == 2.1) { //fighterCounter lerp started
            if (this.fighterCounter.val == this.fightersKilled) {
                this.state = 2.2;
                console.log("HAAAA")
            }
        }
    }

    //lerps at regular intervals of this.countSpeed, updating counter object as it goes. (counter is an object passed by reference)
    _countLerp(textElement, counter, target) {
        textElement.setText("x" + String(counter.val));
        this.countupSound.play();
        if (counter.val < target) {
            counter.val++;
            this.scene.clock.delayedCall(this.countSpeed, this._countLerp, [textElement, counter, target], this)
        }
    }

    _updateInfo() {
        this.score = this.banner.score;
        this.highScore = (this.banner.score >= this.banner.highScore);
        this.fightersKilled = this.banner.fightersKilled + 4;
        this.fighterCounter.val = 0;
        this.fighterScoreVal = this.scene.fighter1.scoreVal;
        this.fighterCountText.setText("x0");
        this.fighterScoreText.setText("");
        this.scoutsKilled = this.banner.scoutsKilled;
        this.scoutCounter.val = 0;
        this.scoutScoreVal = this.scene.scout.scoreVal;
        this.scoutCountText.setText("x0");
        this.scoutScoreText.setText("");
        this.scoreText.setText("");
    }

    //sets alpha of all sprites and text except hiScoreText
    setAlpha(value) {
        this.fighterSprite.setAlpha(value);
        this.fighterCountText.setAlpha(value);
        this.fighterScoreText.setAlpha(value);
        this.scoutSprite.setAlpha(value);
        this.scoutCountText.setAlpha(value);
        this.scoutScoreText.setAlpha(value);
        this.line.setAlpha(value);
        this.scoreWordText.setAlpha(value);
        this.scoreText.setAlpha(value);
    }
}