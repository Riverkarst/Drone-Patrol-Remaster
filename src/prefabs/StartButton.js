class StartButton {
    constructor(x, y, scene) {
        this.scene = scene;
        //STATES
        //1: On start screen awaiting click
        //2: clicked, fade out animation playing
        //3: fade out animation done, waiting for game to be over
        //4: game over screen done, doing fade in animation
        this.state = 1;

        //white: #FFFFFF
        //offwhite: #e6e6e6
        //black: #000000
        //orange: #ff7700
        this.textConfig = {
            fontFamily: 'NotJamSciMono',
            fontSize: '34px',
            color: '#FFFFFF',  
            align: 'center',
            //padding: { top: 5, bottom: 5 },
            //fixedWidth: 150
        }

        
        this.strokeWidth = 3;
        this.baseScale = 1;
        this.onMouseScale = 1.1;

        this.start = scene.add.text(x, y, '[ START ]', this.textConfig).setOrigin(0.5,0.5);
        this.start.setStroke('#000000', this.strokeWidth);
        this.start.setScale(this.baseScale);
        this.start.setInteractive();

        this.leftBracketX = x-game.config.width * 0.137;
        this.Lbracket = scene.add.text(this.leftBracketX, y, '[', this.textConfig).setOrigin(0.5,0.5);
        this.Lbracket.setStroke('#000000', this.strokeWidth);
        this.Lbracket.setScale(this.onMouseScale);
        this.Lbracket.setAlpha(0);
        this.rightBracketX = x+game.config.width * 0.137
        this.Rbracket = scene.add.text(this.rightBracketX, y, ']', this.textConfig).setOrigin(0.5,0.5);
        this.Rbracket.setStroke('#000000', this.strokeWidth);
        this.Rbracket.setScale(this.onMouseScale);
        this.Rbracket.setAlpha(0);

        this.start.on('pointerover', ()=>{
            if (this.state != 1) return;
            this.start.setScale(this.onMouseScale);
        })
        this.start.on('pointerout', ()=>{
            if (this.state != 1) return;
            this.start.setScale(this.baseScale);
        })
        this.start.on('pointerdown', ()=>{
            this.state = 2;
            this.start.setText('START');
            this.Lbracket.setAlpha(1);
            this.Rbracket.setAlpha(1);
        });
    }


    update() {
        if (this.state == 1) {  //on start menu, not clicked start
        } else if (this.state == 2) {  //on start menu, just clicked start, playing anim
            let increment = this.Lbracket.x / 10;
            this.Lbracket.setX(this.Lbracket.x - increment);
            this.Rbracket.setX(this.Rbracket.x + increment);
            this.Lbracket.setAlpha(this.Lbracket.alpha * 0.9);
            this.Rbracket.setAlpha(this.Rbracket.alpha * 0.9);
            this.start.setAlpha(this.start.alpha * 0.9);
            
        } else if (this.state == 3) {  //in active game or game over screen, waiting for start menu to fade back in
        } else if (this.state == 4) {  //just finished game over screen, now playing fade back in anim
        }
        

    }

}