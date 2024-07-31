class GameOverScreen {
    constructor(scene, banner) {
        this.scene = scene;
        this.banner = banner;

        this.score = 0;
        this.highScore = false;
        this.fighterSkilled = 0;
        this.fighterCounter = 0;
        this.scoutsKilled = 0;
        this.scoutCounter = 0;

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

        this.anchorPointX = game.config.width * 0.25;
        this.anchorPointY = game.config.height * 0.35;
        this.fighterSprite = this.scene.add.sprite(this.anchorPointX, this.anchorPointY, "spaceshipAnimated", 0).setOrigin(0,0);
        this.fighterSprite.play('fighter_flying');
        this.fighterCountText = scene.add.text(this.anchorPointX + game.config.width * 0.12, this.anchorPointY, 'x' + String(this.fighterCounter), this.textConfig)
        this.fighterScore = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY, "150", this.textConfig);
        this.scoutSprite = this.scene.add.sprite(this.anchorPointX, this.anchorPointY + game.config.height*0.1, "scout_spritesheet", 0).setOrigin(0,0);
        this.scoutSprite.play('scout_flying');
        this.scoutCountText = scene.add.text(this.anchorPointX + game.config.width * 0.12, this.anchorPointY + game.config.height*0.1, 'x' + String(this.scoutCounter), this.textConfig);
        this.scoutScore = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY + game.config.height*0.1, '300', this.textConfig);
        this.line = this.scene.add.rectangle(this.anchorPointX, this.anchorPointY + game.config.height*0.18, game.config.width * 0.5, game.config.height*0.006, this.textConfig.color).setOrigin(0,0)
        this.scoreWord = this.scene.add.text(this.anchorPointX, this.anchorPointY + game.config.height*0.22, "SCORE", this.textConfig);
        this.scoreText = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY + game.config.height*0.22, "450", this.textConfig);
        this.hiScoreText = this.scene.add.text(this.anchorPointX + game.config.width * 0.51, this.anchorPointY + game.config.height * 0.3, "HI-SCORE!", this.textConfigSmall).setOrigin(1,0);


        //STATES
        //1: Inactive
        //2: Just got activated.  Showing sprites and "SCORE".  Made delayed call to begin tallying fighters
        this.state = 1;
    }

    start() {

    }

    updateInfo() {
        this.score = this.banner.score;
        this.highScore = (this.banner.score >= this.banner.highScore);
        this.fighterSkilled = this.banner.fighterSkilled;
        this.scoutsKilled = this.banner.scoutsKilled;
    }
}