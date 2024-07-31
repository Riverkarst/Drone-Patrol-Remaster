class GameOverScreen {
    constructor(scene, banner) {
        this.scene = scene;
        this.banner = banner;

        this.score = 0;
        this.highScore = false;
        this.fighterSkilled = 0;
        this.scoutsKilled = 0;

        //0: Inactive, alpha 0.
        //1: 
        this.state = 0;

        this.textConfig = {
            fontFamily: 'NotJamSciMono',
            fontSize: '34px',
            color: '#FFFFFF',  
            align: 'center',
        }

        this.anchorPointX = game.config.width * 0.25;
        this.anchorPointY = game.config.height * 0.35;
        this.fighterSprite = this.scene.add.sprite(this.anchorPointX, this.anchorPointY, "spaceshipAnimated", 0);
        //this.start = scene.add.text(x, y, '[ START ]', this.textConfig).setOrigin(0.5,0.5);
        this.scoutSprite = this.scene.add.sprite(this.anchorPointX, this.anchorPointY + game.config.height*0.13, "scout_spritesheet", 0)


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