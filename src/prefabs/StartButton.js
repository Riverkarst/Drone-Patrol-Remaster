class StartButton {
    constructor(x, y, scene) {
        this.scene = scene;
        //STATES
        //1: On start screen awaiting click
        //2: clicked, fading out
        //3: game over, fading in
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
        this.start = scene.add.text(x, y, 'START', this.textConfig).setOrigin(0.5,0.5);
        this.start.setStroke('#000000', this.strokeWidth);
        this.Lbracket = scene.add.text(x-game.config.width/8, y, '[', this.textConfig).setOrigin(0.5,0.5);
        this.Lbracket.setStroke('#000000', this.strokeWidth);
        this.Rbracket = scene.add.text(x+game.config.width/8, y, ']', this.textConfig).setOrigin(0.5,0.5);
        this.Rbracket.setStroke('#000000', this.strokeWidth);
    }


    update() {

    }

}