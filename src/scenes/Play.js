
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
        //this.load.imag('imagename', 'image filepath');
        this.load.image("rocket", "assets/Drone.png");
        this.load.image("spaceship", "assets/spaceship.png");
        this.load.image("background", "assets/background.png");
        this.load.image("foreground1", "assets/foreground1.png");
        this.load.image("foreground2", "assets/foreground2.png");
        this.load.image("border", "assets/borders.png");
        this.load.image('UI', "assets/UI.png");
        this.load.audio("Attack on Oritheia", "assets/Oritheia2.wav");
        //load spritesheet
        this.load.spritesheet('explosion', './assets/ExplosionSpritemap.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('sparrowExplosion', './assets/sparrowExplosion.png', {frameWidth: 48, frameHeight: 28, startFrame: 0, endFrame: 7});
        this.load.spritesheet('drone', './assets/DroneSpritesheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceshipAnimated', './assets/spaceshipSpritemap.png', {frameWidth: 63, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('sparrowAnimated', './assets/sparrowSpritesheet.png', { frameWidth: 48, frameHeight: 28, startFrame: 0, endFrame: 3 });
    }

    create() {
        //this.explosionArray = ['explosion0', 'explosion1', 'explosion2', 'explosion3'];

        this.add.text(50, 200, "Rocket Patrol Play");
        //this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0,0);
        this.foreground1 = this.add.tileSprite(0, 40, 640, 480, 'foreground1').setOrigin(0,0);
        this.foreground2 = this.add.tileSprite(0, 0, 640, 480, 'foreground2').setOrigin(0,0);
        //this.border = this.add.tileSprite(0, 0, 640, 480, 'border').setOrigin(0,0);
        let music = this.sound.add('Attack on Oritheia');
        let musicConfig = { loop:true };
        music.play(musicConfig);
        

        //add rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height-borderUISize-borderPadding-20, 'rocket').setOrigin(0.5, 0);
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4+36, 'spaceshipAnimated', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2+22, 'spaceshipAnimated', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4+6, 'spaceshipAnimated', 0, 10).setOrigin(0,0);
        this.sparrow01 = new Sparrow(this, 0, 8*borderPadding + borderUISize, 'sparrowAnimated', 0, 50).setOrigin(0, 0);
        

        //defining keys created in main.js
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        // animation config for explosion
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30,
        })
        this.anims.create({
            key: 'sparrowExplode',
            frames: this.anims.generateFrameNumbers('sparrowExplosion', { start: 0, end: 7}),
            frameRate: 30
        })
        /*this.anims.create({
            key: 'flying',
            frames: this.anims.generateFrameNumbers('spaceshipAnimated', { start: 0, end: 1, }),
            repeat: -1
        })*/
        

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
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5); 
            this.gameOver = true;   
            music.stop();
        }, null, this);
        this.clock2;

        //Green background for UI info
        //this.add.rectangle(0, borderUISize+borderPadding, game.config.width, borderUISize*2, 0x03C6FC).setOrigin(0,0);
        this.border = this.add.tileSprite(0, 0, 640, 480, 'border').setOrigin(0,0);
        this.UI = this.add.tileSprite(0, borderUISize+borderPadding, game.config.width, borderUISize*2, 'UI').setOrigin(0,0);
        
        //white borders
        let bordercolor = 0x424242;
        //dark blue: 0x3f6570;
        //red: c73500
        /*this.add.rectangle(0, 0, game.config.width, borderUISize, bordercolor).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, bordercolor).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, bordercolor).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, bordercolor).setOrigin(0, 0);*/

        
        this.readyMessage = this.add.text(game.config.width/2-70, borderUISize + borderPadding*2, this.readyStatus, readyConfig);
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        this.gameTimerCopy = game.settings.gameTimer;
        this.secondApproximation = 7;
        this.timerDisplay = this.add.text(config.width - (borderUISize + borderPadding + 50), borderUISize + borderPadding*2, this.gameTimerCopy/1000, scoreConfig);
        //console.log(this.clock.now);//why is this undefined?  According to the Phaser documentation, it should have current time
        /*this.clock.addEvent(() => {  //timer attempt: failed
            gameTimerCopy -= 1000;
            this.timerDisplay.text = gameTimerCopy
        }, {
            delay: 1000,
            repeat: game.settings.gameTimer/1000,
        });*/  //according to the documentation, this should work.  I am following the documentation exactly as it's described.
        /*this.clock.addEvent( {  //timer attempt: failed.
            delay: 1000,
            repeat: game.settings.gameTimer/1000,
            updateTimer() {
                gameTimerCopy -= 1000;
                this.timerDisplay.text = gameTimerCopy;
            }
        };*/  
    }

    update() {
        this.readyStatus = this.p1Rocket.getStatus();
        if (this.readyStatus == 'ready') {
            this.readyColor = '#00c732';
        }
        else if (this.readyStatus == 'rearming') {
            this.readyColor = '#de2900';
        }
        this.readyMessage.text = this.readyStatus;
        this.readyMessage.setBackgroundColor(this.readyColor);
        
        //this.gameTimerCopy -= (1000/60)  //ratio of milliseconds per tic rate.  somehow, it's too fast. timer attempt failed
        this.gameTimerCopy -= this.secondApproximation;  //manually found 7 as approximating the length of 1 second.  I know this is a terrible solution, but I've tried absolutely every other possible solution and nothing else worked.
        if (this.gameTimerCopy >= 0) this.timerDisplay.text = Math.round(this.gameTimerCopy/1000);
        /*if (!this.gameOver) { //timer attempt failed
            this.gameTimerCopy = (this.game.gameTimer/1000) - Math.round((this.game.gameTimer/1000)*this.clock.getProgress());
            this.timerDisplay.text = this.gameTimerCopy;
        }*/ 
        //if (Math.round(this.gameTimerCopy) >= 0) this.timerDisplay.text = Math.round(this.gameTimerCopy);
        /*if (!this.gameOver) { //timer attempt failed
            this.gameTimerCopy = this.clock.now;
            this.timerDisplay.text = this.gameTimerCopy;
        }*/

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        if (!this.gameOver) {
            this.foreground1.tilePositionX -= 0.1;
            this.foreground2.tilePositionX -= 0.3;
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.sparrow01.update();
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {  //lowest ship
            //console.log('kaboom ship 03');
            //this.p1Rocket.reset();
            //this.clock2 = this.time.delayedCall(1000, this.p1Rocket.reset(), null, this);
            this.time.delayedCall(1000, this.p1Rocket.reset(), null, this);  //why don't these work? 
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            //console.log('kaboom ship 02');
            //this.p1Rocket.reset();
            this.time.delayedCall(1000, this.p1Rocket.reset(), null, this);
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            //console.log('kaboom ship 01');
            //this.p1Rocket.reset();
            this.time.delayedCall(1000, this.p1Rocket.reset(), null, this); 
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.sparrow01)) {
            this.p1Rocket.reset();
            this.sparrowExplode(this.sparrow01);
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

}