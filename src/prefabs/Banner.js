/**
 * The banner object for the game.  STORES ESSENTIAL GAME DATA
 */

class Banner {
    constructor(scene) {
        this.scene = scene;

        //GAME DATA
        //======================================================
        this.maxTime = 60; // in seconds
        this.time = this.maxTime;
        this.score = 0;
        this.highScore = 0;
        this.fightersKilled = 0;
        this.scoutsKilled = 0;
        this.hits = 0;
        this.shots = 0;
        this.carpalTunnelMax = 200; //200 frames, so 200/60 = 3.3 seconds
        this.rocketCPVal = 2*(60 / 6) // 60 frames for 1 second.  60 / max rockets per second.  
        this.carpalTunnel = 0;
        this.carpalTunnelCountermeasure = false;
        //======================================================

        this.carpalTunnelFlashTimer = 0;
        this.carpalTunnelFlashSpeed = 20;

        this.CTCSBeep = this.scene.sound.add('CTCSBeep');
        this.CTCSFrying = this.scene.sound.add('CTCSSteam');
        this.carpalTunnelBar = this.scene.add.rectangle(0, game.config.height * 0.118, 0, game.config.height * 0.05, '0xc90700');
        this.carpalTunnelBarSettings = {off:0, semi:0.1, full:0.5}  //off, semi-on, fully on
        this.carpalTunnelBar.setAlpha(0);
        this.carpalTunnelBar.setOrigin(0,0);
        let cttConfig = {fontFamily:'NotJamSciMono', fontSize: '20px', color: '0x000000'}
        this.carpalTunnelText = this.scene.add.text(game.config.width * 0.16, game.config.height * 0.127, '<<< CARPAL TUNNEL COUNTERMEASURE >>>', cttConfig);
        this.carpalTunnelText.setAlpha(0);
        this.carpalTunnelText.setOrigin(0,0);

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
            this._checkCarpalTunnel();
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

    pauseTime() {
        this.paused = true;
        this.CTCSBeep.pause();
        this.CTCSFrying.pause();
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
        this.CTCSBeep.pause();
        this.CTCSFrying.resume();
    }

    //MAIN GAMEOVER HOOKUP POINT
    gameOver() {
        this.scene.state = 4; //time up
        this.deactivate(); //just sets this.state to 4
        this.scene.gameOverScreen.start();
        this.scene.deactivateShips();
        this.scene.launcher.stow();
        this.carpalTunnelBar.setSize(0,this.carpalTunnelBar.height)
        this.carpalTunnelBar.setAlpha(0);
        this.carpalTunnelText.setAlpha(0);
        this.CTCSBeep.stop();
        this.CTCSFrying.stop();
    }

    move(increment) {
        this.banner.setY(this.banner.y + increment);
        this.scoreText.setY(this.scoreText.y + increment);
        this.timeText.setY(this.timeText.y + increment);
    }

    setActivePosition() {
        this.banner.setY(0);
        this.scoreText.setY(this.textY);
        this.timeText.setY(this.textY);

    }

    //Activate banner slide in and reset score counters.  Called by start button.
    activate() {
        this.state = 2;
        this.score = 0;
        this.fightersKilled = 0;
        this.scoutsKilled = 0;
        this.hits = 0;
        this.shots = 0;
        this.timer = this.maxTime * 60;
        this.scoreText.setText(String(0));
        this.carpalTunnel = 0;
        this.carpalTunnelBar.setAlpha(this.carpalTunnelBarSettings.semi);
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
    }

    //score amount to add, and the type of craft that was killed. 1 is fighter, 2 is scout.
    addScore(amount, type=1) {
        if (this.score == 999) return;
        this.score += amount;
        if (this.score > 9999) this.score = 9999;
        this.scoreText.setText(String(this.score))
        if (type==1) this.fightersKilled++
        else if (type==2) this.scoutsKilled++
    }

    _checkCarpalTunnel() {
        if (this.carpalTunnel > 0) this.carpalTunnel--;
        
        this.carpalTunnelBar.setSize((game.config.width*this.carpalTunnel)/this.carpalTunnelMax, this.carpalTunnelBar.height);
        if (!this.carpalTunnelCountermeasure) {
            if (this.carpalTunnel >= this.carpalTunnelMax) {
                this._activateCarpalTunnelCountermeasure();
                
            } 
        } else if (this.carpalTunnelCountermeasure) {
            if (this.carpalTunnel == 0 ) this._deactivateCarpalTunnelCountermeasure();
            else {
                this._flashCarpalTunnelText();
                if (this.carpalTunnel < this.carpalTunnelMax*0.05) {
                    this.CTCSBeep.setVolume(this.CTCSBeep.volume * 0.9);
                }
                if (this.carpalTunnel < this.carpalTunnelMax * 0.15) {
                    this.CTCSFrying.setVolume(this.CTCSFrying.volume * 0.95);
                }
            }
        }
    }

    _activateCarpalTunnelCountermeasure() {
        this.carpalTunnelCountermeasure = true;
        this.carpalTunnelBar.setAlpha(0.5);
        this.CTCSBeep.play({volume:0.2, loop:-1})
        //this.CTCSFrying.play({volume:0.3, loop:-1})
    }

    _deactivateCarpalTunnelCountermeasure() {
        this.carpalTunnelCountermeasure = false;
        this.carpalTunnelBar.setAlpha(0.1);
        this.carpalTunnelText.setAlpha(0);
        this.CTCSBeep.stop();
        this.CTCSFrying.stop();
    }

    _flashCarpalTunnelText() {
        let nextAlpha = 0;
        if (this.carpalTunnelText.alpha == 0) nextAlpha = 0.5;
        if (this.carpalTunnelFlashTimer == 0) {
            this.carpalTunnelFlashTimer = this.carpalTunnelFlashSpeed;
            this.carpalTunnelText.setAlpha(nextAlpha);
        } else this.carpalTunnelFlashTimer--;
    }

    addCarpalTunnel() {
        this.carpalTunnel += this.rocketCPVal;
    }
}