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
        // define keys
        //Arcade controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, true, true);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, true, true);
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z, true, false);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X, true, false);

        //WASD controls
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, true);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R, true, false);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, true, false);
        
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M, true, false);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false);


        this.gameTimer = 40000;
        this.background = this.add.tileSprite(0, 0, 640 * sizeMult, 480 * sizeMult, 'background_enlarged').setOrigin(0,0);
        this.background.setScale(sizeMult);
        this.background.setTileScale(0.1);
        this.background.setDepth(-10);
        this.foreground1 = this.add.tileSprite(0, 40, 640, 480, 'foreground1_enlarged').setOrigin(0,0);
        this.foreground1.setScale(sizeMult);
        this.foreground1.setTileScale(0.1);
        this.foreground1.setDepth(-9);
        this.foreground2 = this.add.tileSprite(0, 0, 640, 480, 'foreground2_enlarged').setOrigin(0,0);
        this.foreground2.setTileScale(0.1);
        this.foreground2.setScale(sizeMult);
        this.foreground2.setDepth(-8);
        //I used to be able to just do this.time.delayedCall(1000, ()=>{console.log("bla")}, [], this), but
        //for some reason, this has broken in the newer version of Phaser (3.81), so this is the workaround.
        this.clock = new Phaser.Time.Clock(this);
        this.clock.start();

        //STATES
        //1: In menu, awaiting player to click PLAY
        //2: Player just clicked play, now playing anims getting ready to start game.  set by PLAY button.
        //3: Game going
        //4: Time up, Now in game over screen.
        this.state = 1;
        

        //add rocket
        //this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height*0.85, 'rocket').setOrigin(0.5, 0);
        //this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4+36, 'spaceshipAnimated', 0, 30).setOrigin(0,0);
        //this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2+22, 'spaceshipAnimated', 0, 20).setOrigin(0,0);
        //this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4+6, 'spaceshipAnimated', 0, 10).setOrigin(0,0);
        //this.sparrow01 = new Sparrow(this, -game.config.width/4, 8*borderPadding + borderUISize, 'sparrowAnimated', 0, 50).setOrigin(0, 0);

        this.fighter1 = new Fighter(this, game.config.width * 1.4, game.config.height * 0.43);
        this.fighter2 = new Fighter(this, game.config.width * 1.5, game.config.height * 0.56);
        this.fighter3 = new Fighter(this, game.config.width * 1.6, game.config.height * 0.69);
        this.scout = new Scout(this, game.config.width * 1.2, game.config.height * 0.27);
        this.launcher = new Launcher(this);
        



        // animation config for explosion
        /*this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7, first: 0}),
            frameRate: 30,
        })*/
        setup_Rocket_Animations(this);
        

        //initialize score
        this.highscore = 0;
        //this.bestplayer = '  ';
        this.p1Score = 0;
        this.p2Score = 0;

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

        // play clock. easy is 60 seconds, hard is 45
        scoreConfig.fixedWidth = 0;
        /*.clock = this.time.delayedCall(this.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5); 
            this.gameOver = true;   
            music.stop();
        }, null, this);, 
        this.clock2;*/

        
        //create border
        /*this.border = this.add.tileSprite(0, 0, 640*sizeMult, 480*sizeMult, 'border').setOrigin(0,0);
        this.border.setScale(sizeMult);
        this.UI = this.add.tileSprite(0, borderUISize+borderPadding, game.config.width, borderUISize*2, 'UI').setOrigin(0,0);

        //create text showing if firing is ready or rearming
        this.readyMessage = this.add.text(game.config.width/2-70, borderUISize + borderPadding*2, this.readyStatus, readyConfig);
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        //game timer
        this.secondApproximation = 7;
        this.timerDisplay = this.add.text(config.width - (borderUISize + borderPadding + 50), borderUISize + borderPadding*2, this.gameTimer/1000, scoreConfig);
        */

        //Is it in the start menu?  If not, it should start the game.
        this.inStartMenu = true;
        
        this.frameTimer = 0;

        //add title text
        //white: #FFFFFF
        //offwhite: #e6e6e6
        //black: #000000
        //orange: #ff7700
        /*this.title = this.add.text(game.config.width/2, game.config.height * 0.35, 'Rocket Raider', {
            fontFamily: 'GravityBold',
            fontSize: '60px',
            color: '#FFFFFF',
        }).setOrigin(0.5,0.5);
        this.title.setStroke('#000000', 4);*/

        this.startButton = new StartButton(game.config.width/2, game.config.height * 0.8, this);
        this.title = new Title(game.config.width/2, game.config.height * 0.35, 'Rocket Raider', this);
        this.hiScoreConfig = {fontFamily:'NotJamSciMono', fontSize:'24px', color:'#FFFFFF'}
        this.hiScoreText = this.add.text(game.config.width * 0.5, game.config.height * 0.5, 'HI-SCORE: 0', this.hiScoreConfig).setOrigin(0.5,0);
        this.hiScoreText.setStroke('#000000', 3);
        this.hiScoreText.setAlpha(0);
        //this.bannertest = this.add.sprite(game.config.width/2, game.config.height/2, 'banner_enlarged', );
        //this.bannertest.setScale(0.2 * sizeMult);

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
        //cap at 60 fps
        this.frameTimer += delta;
        if (this.frameTimer <= 1000 / 60) {
            return;
        } else this.frameTimer = 0;

    


        //this.testRocket.update();
        //console.log(this.clock.now);

        this.startButton.update();
        this.title.update();
        //update ready message
        if (this.state == 1) { //waiting for player to click play
        } else if (this.state == 2) { //player just clicked play, playing anims and getting ready
            //this.banner.activate();
        
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
        this.foreground1.tilePositionX += 1;
        this.foreground2.tilePositionX += 3;
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
        } else if (this.paused) {
            this.paused = false;
            this.pauseScreen.setAlpha(0);
            this.pausedWord.setAlpha(0);
            this.launcher.unpauseRockets();
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking (Axis Aligned Bounding Box)
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            } else return false;
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');   //play explode animation
        boom.on('animationcomplete', ()   => { //callback after anim completes
            ship.reset();                       //reset ship position
            ship.alpha = 1;                     //make ship visible again
            boom.destroy();                     //remove explosion sprite
        })
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        //this.sound.play(this.explosionTest);
        this.sound.play(this.explosionArray[Math.floor((Math.random()*10) % 4)]);
        //this.sound.play(this.explosionArray[1]);
        //console.log(Math.floor((Math.random()*10) % 4));
    }

    sparrowExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        //create explosion sprite at ship's position
        let littleBoom = this.add.sprite(ship.x, ship.y, 'sparrowExplosion').setOrigin(1,0);
        littleBoom.anims.play('sparrowExplode');   //play explode animation
        littleBoom.on('animationcomplete', ()   => { //callback after anim completes
            ship.reset();                       //reset ship position
            ship.alpha = 1;                     //make ship visible again
            littleBoom.destroy();                     //remove explosion sprite
        })
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sparrowExplosionSFX');
    }


    backToMainMenu() {
        this.title.activate();
        this.startButton.activate();
        //this.startButton.music.stop();
        this.musicPlayer.stop();
        if (this.banner.highScore > 0) {
            this.hiScoreText.setText('HI-SCORE: ' + String(this.banner.highScore));
            this.hiScoreText.setAlpha(1);
        }
    }

}