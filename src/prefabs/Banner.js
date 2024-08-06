/**
 * The banner object for the game.  STORES ESSENTIAL GAME DATA
 */

class Banner {
    constructor(scene) {
        this.scene = scene;

        //GAME DATA
        //======================================================
        this.maxTime = 60;
        this.time = this.maxTime;
        this.score = 0;
        this.highScore = 0;
        this.fightersKilled = 0;
        this.scoutsKilled = 0;
        this.hits = 0;
        this.shots = 0;
        //======================================================

        this.stowedY = - game.config.height * 0.15; //stowed position for banner sprite
        this.slideSpeed = game.config.height * 0.009;
        this.banner = this.scene.add.sprite(0, this.stowedY, 'banner_enlarged').setOrigin(0,0);
        this.banner.setScale(sizeMult * 0.2); //The sprite is 5x bigger than canvas, and canvas was adjusted by sizeMult

        this.textConfig = {
            fontFamily: 'NotJamSciMono',
            fontSize: '25px',
            color: '#faf6e3',
        }
        this.textY = game.config.height * 0.0335;
        this.scoreX = game.config.width * 0.26;
        this.scoreTextStowedY = this.textY + this.stowedY;
        this.scoreText = this.scene.add.text(this.scoreX, this.scoreTextStowedY, this.score, this.textConfig);
        this.scoreText.postFX.addGlow('0xbc451f', 1, 0.3, 0.1);

        this.timeX = game.config.width * 0.796;
        this.timeTextStowedY = this.textY + this.stowedY;
        this.timeText = this.scene.add.text(this.timeX, this.textY + this.stowedY, this.time, this.textConfig);
        this.timeText.postFX.addGlow('0xbc451f', 1, 0.3, 0.1);
        this.timeSinceLastTimeUpdate = 0; //Framerate is 60, so 60 is 1 second.
        this.savedTimeForPause = 0;

        this.remainingRockets = new Array();
        this.rocketY = game.config.height * 0.12;
        this.rocketStowedY = - game.config.height * 0.03
        this.rocketX = game.config.width * 0.45;
        this.rocketSeparation = game.config.width * 0.05;
        this.rocketsBoundRight = game.config.width * 0.6;
        this.rocketSeparation = (this.rocketsBoundRight - this.rocketX) / 4
        this.rocketScale = 1.5
        this.remainingRockets.push(this.scene.add.sprite(this.rocketX, this.rocketStowedY, 'rocket').setScale(this.rocketScale,this.rocketScale).setTint('0xd1d1d1'))
        this.remainingRockets.push(this.scene.add.sprite(this.rocketX + this.rocketSeparation, this.rocketStowedY, 'rocket').setScale(this.rocketScale,this.rocketScale).setTint('0xd1d1d1'))
        this.remainingRockets.push(this.scene.add.sprite(this.rocketX + 2*this.rocketSeparation, this.rocketStowedY, 'rocket').setScale(this.rocketScale,this.rocketScale).setTint('0xd1d1d1'))
        this.remainingRockets.push(this.scene.add.sprite(this.rocketX + 3*this.rocketSeparation, this.rocketStowedY, 'rocket').setScale(this.rocketScale,this.rocketScale).setTint('0xd1d1d1'))

        //this.move(game.config.height * 0.18)
        //STATES
        //1: Stowed.  In start menu, player hasn't clicked play
        //2: player just clicked play, playing slide in animation
        //3: slide in animation done, game active
        //4: game done, slide out animation playing.
        this.state = 1;
        this.timer = this.maxTime * 60
    }

    update() {
        if (this.state == 1) {
        }
        else if (this.state == 2) { //moving into place
            if (this.banner.y < 0) { //moving down
                this.move(this.slideSpeed);
            } else { //lock into place, set score and time text.
                this.setActivePosition();
                this.state = 3;
                this.time = this.maxTime;
                this.timeText.setText(String(this.time));
                this.timeUpdate(); //start timer
            }
        } else if (this.state == 3) {   //game active
            if (!this.paused) {
                this.timer--;
                this.timeUpdate();
                if (this.timer <= 0) {
                    this.state = 4;
                    this.gameOver();
                }
            }
        } else if (this.state == 4) {
            if (this.banner.y > this.stowedY) {
                this.move(-this.slideSpeed);
            } else { //lock into stowed position
                this.setInactivePosition();
                this.state = 1;
            }
        }

    }

    timeUpdate() {
        let macroTime = Math.ceil(this.timer/60);
        this.timeText.setText(String(macroTime));
    }

    //old time update function based on delayedCall
    timeUpdateObsolete(interval=1000) {
        if (this.paused) return;
        this.scene.clock.delayedCall(interval, ()=>{
            if (this.paused) return;
            this.timeSinceLastTimeUpdate = 0;
            this.time--;
            if (this.time >= 0) this.timeText.setText(String(this.time))
            if (this.time <= -1) { //time up.  start game over screen.
                this.gameOver();
            } else if (!this.paused) this.timeUpdate();
        }, [], this)
    }

    pauseTime() {
        this.paused = true;
    }

    unpauseTime() {
        this.paused = false;
        //this.savedTimeForPause gets ++ every frame.  Framerate is 60 fps.  
        //Therefore this.savedTimeForPause is in fractions of 60, where 60/60 is 1 second.
        //this.scene.clock.delayedCall requires milliseconds.
        //Therefore, I must convert fractions of 60ths of a second into milliseconds.
        //Let y = milliseconds until next delayedCall, and x = 60ths of a second (this.savedTimeForPause)
        //  y/1000=x/60      y=1000x/60
        //Therefore milliseconds until next update is:
        let millisecondsUntilDelayedCall = (1000 * this.savedTimeForPause) / 60  
        this.timeUpdate(millisecondsUntilDelayedCall);
    }

    //MAIN GAMEOVER HOOKUP POINT
    gameOver() {
        this.scene.state = 4; //time up
        this.deactivate(); //just sets this.state to 4
        this.scene.gameOverScreen.start();
        this.scene.deactivateShips();
        this.scene.launcher.stow();
    }

    move(increment) {
        this.banner.setY(this.banner.y + increment);
        this.scoreText.setY(this.scoreText.y + increment);
        this.timeText.setY(this.timeText.y + increment);
        for (let i=0; i<this.remainingRockets.length; i++) {
            this.remainingRockets[i].setY(this.remainingRockets[i].y + increment)
        }
    }

    setActivePosition() {
        this.banner.setY(0);
        this.scoreText.setY(this.textY);
        this.timeText.setY(this.textY);
        for (let i=0; i<this.remainingRockets.length; i++) {
            this.remainingRockets[i].setY(this.rocketY)
        }
    }

    //Activate banner slide in and reset score counters.  Called by start button.
    activate() {
        this.state = 2;
        this.score = 0;
        this.fightersKilled = 0;
        this.scoutsKilled = 0;
        this.hits = 0;
        this.misses = 0;
        this.timer = this.maxTime * 60;
        this.scoreText.setText(String(0));
    }

    //Set to inactive position out of screen.  Called by its own timeUpdate function
    deactivate() {
        this.state = 4;
    }

    //teleport to inactive stowed position out of screen
    setInactivePosition() {
        this.banner.setY(this.stowedY);
        this.scoreText.setY(this.scoreTextStowedY);
        this.timeText.setY(this.timeTextStowedY);
        for (let i=0; i<this.remainingRockets.length; i++) {
            this.remainingRockets[i].setY(this.rocketStowedY)
        }
    }

    //score amount to add, and the type of craft that was killed. 1 is fighter, 2 is scout.
    addScore(amount, type=1) {
        if (this.score == 999) return;
        this.score += amount;
        if (this.score > 999) this.score = 999;
        this.scoreText.setText(String(this.score))
        if (type==1) this.fightersKilled++
        else if (type==2) this.scoutsKilled++
    }
}