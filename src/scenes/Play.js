
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
        this.gameTimer = 40000;
        this.add.text(50, 200, "Rocket Patrol Play");
        this.background = this.add.tileSprite(0, 0, 640 * sizeMult, 480 * sizeMult, 'background').setOrigin(0,0);
        this.background.setScale(sizeMult);
        this.foreground1 = this.add.tileSprite(0, 40, 640, 480, 'foreground1').setOrigin(0,0);
        this.foreground1.setScale(sizeMult);
        this.foreground2 = this.add.tileSprite(0, 0, 640, 480, 'foreground2').setOrigin(0,0);
        this.foreground2.setScale(sizeMult);
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
        this.clock = this.time.delayedCall(this.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5); 
            this.gameOver = true;   
            music.stop();
        }, null, this);
        this.clock2;

        
        //create border
        this.border = this.add.tileSprite(0, 0, 640*sizeMult, 480*sizeMult, 'border').setOrigin(0,0);
        this.border.setScale(sizeMult);
        this.UI = this.add.tileSprite(0, borderUISize+borderPadding, game.config.width, borderUISize*2, 'UI').setOrigin(0,0);

        //create text showing if firing is ready or rearming
        this.readyMessage = this.add.text(game.config.width/2-70, borderUISize + borderPadding*2, this.readyStatus, readyConfig);
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        //game timer
        this.secondApproximation = 7;
        this.timerDisplay = this.add.text(config.width - (borderUISize + borderPadding + 50), borderUISize + borderPadding*2, this.gameTimer/1000, scoreConfig);

        //Is it in the start menu?  If not, it should start the game.
        this.inStartMenu = true;
        
        this.frameTimer = 0;
    }

    update(time, delta) {
        //cap at 60 fps
        this.frameTimer += delta;
        if (this.frameTimer >= 1000 / 60) {
            this.frameTimer = 0;
            return;
        }


        
        //update ready message
        this.readyStatus = this.p1Rocket.getStatus();
        if (this.readyStatus == 'ready') {
            this.readyColor = '#00c732';
        }
        else if (this.readyStatus == 'rearming') {
            this.readyColor = '#de2900';
        }
        this.readyMessage.text = this.readyStatus;
        this.readyMessage.setBackgroundColor(this.readyColor);
        
        
        
        //update game timer
        this.gameTimerCopy -= this.secondApproximation;  //manually found 7 as approximating the length of 1 second.  I know this is a terrible solution, but I've tried absolutely every other possible solution and nothing else worked.
        if (this.gameTimerCopy >= 0) this.timerDisplay.text = Math.round(this.gameTimer/1000);
        

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //update parallax stuff
        this.foreground1.tilePositionX -= 0.1;
        this.foreground2.tilePositionX -= 0.3;

        //update all agents
        this.p1Rocket.update();
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();
        this.sparrow01.update();
        
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