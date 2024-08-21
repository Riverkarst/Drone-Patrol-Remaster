
//Key extension.  Adds firstDown, which detects only the beginning of a key press
class Key extends Phaser.Input.Keyboard.Key {
    constructor(scene, phaserKey) {
        super(scene.input.keyboard, phaserKey)
        scene.input.keyboard.addKey(this);
        this.firstDown = false;
        this.framesDown = 0;
    }

    update() {
        if (this.isDown) {
            this.framesDown++;
            if (this.framesDown == 1) this.firstDown = true;
            else this.firstDown = false;
        } else {
            this.firstDown = false;
            this.framesDown = 0;
        }
    }
}


/**
 * Main Play scene.  Game stats are stored in its Banner object. (See Banner.js)
 */


class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.x = 600;
        this.scrollspeed = 2;
        this.foreground1speed = 0.5;
        this.foreground2speed = 0.2;
        this.readyColor = '#00c732';
        this.readyStatus = 'ready';
        this.explosionArray = ['explosion0', 'explosion1', 'explosion2', 'explosion3'];
    }

    preload() {

    }

    create() {
        this.updateArray = [];
        // define keys
        //Arcade controls
        keyLEFT = new Key(this, Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = new Key(this, Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyZ = new Key(this, Phaser.Input.Keyboard.KeyCodes.Z);
        //keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X, true, false);
        keyX = new Key(this, Phaser.Input.Keyboard.KeyCodes.X);


        this.updateArray.push(keyZ);
        this.updateArray.push(keyX);


        //WASD controls
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, true);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R, true, false);
        keySPACE = new Key(this, Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.updateArray.push(keySPACE);
        
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M, true, false);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false);


        this.gameTimer = 40000;
        this.background = this.add.tileSprite(0, 0, 640 * sizeMult, 480 * sizeMult, 'background').setOrigin(0,0);
        this.background.setScale(sizeMult);
        this.background.setTileScale(0.2);
        this.background.setDepth(-10);
        this.background.setAlpha(1)
        this.midground_clouds = this.add.tileSprite(0, 40, 640, 480, 'midground_clouds').setOrigin(0,0);
        this.midground_clouds.setScale(sizeMult);
        this.midground_clouds.setTileScale(0.2);
        this.midground_clouds.setDepth(-9);
        this.midground_ships = this.add.tileSprite(0, 40, 640, 480, 'midground_ships').setOrigin(0,0);
        this.midground_ships.setScale(sizeMult);
        this.midground_ships.setTileScale(0.2);
        this.midground_ships.setDepth(-8);
        this.midground_ships.setAlpha(1);
        this.foreground = this.add.tileSprite(0, 0, 640, 480, 'foreground').setOrigin(0,0);
        this.foreground.setTileScale(0.2);
        this.foreground.setScale(sizeMult);
        this.foreground.setDepth(-7);
        //For some reason, scenes don't start with clocks in Phaser 3.81.  Starting one manually.
        this.clock = new Phaser.Time.Clock(this);
        this.clock.start();

        //STATES
        //1: In menu, awaiting player to click PLAY
        //2: Player just clicked play, now playing anims getting ready to start game.  set by PLAY button.
        //3: Game going
        //4: Time up, Now in game over screen.
        this.state = 1;
        
        this.fighter1 = new Fighter(this, game.config.width * 1.4, game.config.height * 0.43);
        this.fighter2 = new Fighter(this, game.config.width * 1.5, game.config.height * 0.56);
        this.fighter3 = new Fighter(this, game.config.width * 1.6, game.config.height * 0.69);
        this.scout = new Scout(this, game.config.width * 1.2, game.config.height * 0.27);
        this.launcher = new Launcher(this);
        
        setup_Rocket_Animations(this); //defined in Rocket.js

        //initialize score
        this.highscore = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        let readyConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00c732',  //green: 0x00c732   red is #de2900  
            color: '#843605',  
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 150
        }

        // GAME OVER flag
        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        
        //Is it in the start menu?  If not, it should start the game.
        
        this.frameTimer = 0;

        //add title text
        //white: #FFFFFF
        //offwhite: #e6e6e6
        //black: #000000
        //orange: #ff7700
        this.startButton = new StartButton(game.config.width/2, game.config.height * 0.8, this);
        this.title = new Title(game.config.width/2, game.config.height * 0.35, 'Rocket Raider', this);
        this.hiScoreConfig = {fontFamily:'NotJamSciMono', fontSize:'24px', color:'#FFFFFF'}
        this.hiScoreText = this.add.text(game.config.width * 0.5, game.config.height * 0.5, 'HI-SCORE: 0', this.hiScoreConfig).setOrigin(0.5,0);
        this.hiScoreText.setStroke('#000000', 3);
        this.hiScoreText.setAlpha(0);

        this.score = 0;
        this.time = 40;
        this.banner = new Banner(this);
        this.gameOverScreen = new GameOverScreen(this, this.banner);

        this.musicPlayer = new MusicPlayer(this);

        //Pause code
        this.paused = false;
        this.escFirstDown = true;
        this.pauseScreen = this.add.rectangle(game.config.width/2, game.config.height/2, game.config.width*1.1, game.config.height*1.1, '0x000000');
        this.pauseScreen.setOrigin(0.5, 0.5);
        this.pauseScreen.setAlpha(0);
        this.pausedWord = this.add.text(game.config.width/2, game.config.height/2, 'PAUSED', {fontFamily: 'NotJamSciMono', fontSize:'20px', color:'0x000000'});
        this.pausedWord.setOrigin(0.5,0.5)
        this.pausedWord.setAlpha(0);
    }

    update(time, delta) {
        //cap at 60 fps (unnecessary since config object in main.js already defines target framerate at 60)
        //this.frameTimer += delta;
        //if (this.frameTimer <= 1000 / 60) {
        //    return;
        //} else this.frameTimer = 0;


        this.startButton.update();
        this.title.update();
        //update ready message
        if (this.state == 1) { //waiting for player to click play
        } else if (this.state == 2) { //player just clicked play, playing anims and getting ready
        } else if (this.state == 3) { //Preparation anims done, game is now going.
            if (keyESC.isDown) {
                if (this.escFirstDown) {
                    this.togglePause();
                    this.escFirstDown = false;
                }
            } else if (keyESC.isUp) this.escFirstDown = true;
            if (this.paused) return;  
        } else if (this.state == 4) { //time up, now doing gameover screen
        }

        //update parallax stuff
        this.midground_clouds.tilePositionX += 1;
        this.midground_ships.tilePositionX += 1;
        this.foreground.tilePositionX += 2.5;
        //update all agents
        this.musicPlayer.update();
        this.fighter1.update();
        this.fighter2.update();
        this.fighter3.update();
        this.scout.update();
        this.banner.update();
        this.launcher.update();
        this.launcher.updateRockets();
        this.gameOverScreen.update();
        for (let i=0; i<this.updateArray.length; i++) {
            this.updateArray[i].update();
        }

    }

    activateShips() {
        this.fighter1.activate();
        this.fighter2.activate();
        this.fighter3.activate();
        this.scout.activate();
    }

    deactivateShips() {
        this.fighter1.deactivate();
        this.fighter2.deactivate();
        this.fighter3.deactivate();
        this.scout.deactivate();
    }

    resetEnemies() {
        this.fighter1.resetPosition();
        this.fighter2.resetPosition();
        this.fighter3.resetPosition();
        this.scout.resetPosition();
    }

    togglePause() {
        if (!this.paused) {
            this.paused = true;
            this.pauseScreen.setAlpha(0.5);
            this.pausedWord.setAlpha(1);
            this.launcher.pauseRockets();
            this.banner.pauseTime();
        } else if (this.paused) {
            this.paused = false;
            this.pauseScreen.setAlpha(0);
            this.pausedWord.setAlpha(0);
            this.launcher.unpauseRockets();
            this.banner.unpauseTime();
        }
    }



    backToMainMenu() {
        this.resetEnemies();
        this.title.activate();
        this.startButton.activate();
        this.musicPlayer.stop();
        if (this.banner.highScore > 0) {
            this.hiScoreText.setText('HI-SCORE: ' + String(this.banner.highScore));
            this.hiScoreText.setAlpha(1);
        }
    }

}