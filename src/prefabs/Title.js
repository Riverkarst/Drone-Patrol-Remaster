class Title {
    constructor(x, y, content, scene) {
        this.scene = scene;
        this.text = this.scene.add.text(x, y, content, {
            fontFamily: 'GravityBold',
            fontSize: '60px',
            color: '#FFFFFF',
        }).setOrigin(0.5,0.5);
        //this.text.setResolution(5);
        this.text.setStroke('#000000', 4);

        //STATES
        //1: On title screen, waiting for player to click PLAY
        //2: Player just clicked PLAY, now fading out
        //3: Game going, awaiting transition back to menu screen
        //4: Transitioning to menu screen, now fading back in.
        this.state = 1;
        this.text.setAlpha(0);
    }

    update() {
        if (this.state == 1) {
            //if (this.scene.state == 2) this.state = 2;
        } else if (this.state == 2) {
            this.text.setAlpha(this.text.alpha * 0.9);
            if (this.text.alpha < 0.1) {
                this.text.setAlpha(0);
                this.state = 3;
            }
        } else if (this.state == 3) { //UNDER CONSTRUCTION
        } else if (this.state == 4) {
            this.text.setAlpha(this.text.alpha + 0.03);
            if (this.text.alpha >= 0.95) {
                this.text.setAlpha(1);
                this.state = 1;
            }
        }
    }

    deactivate() {
        this.state = 2;
    }
}