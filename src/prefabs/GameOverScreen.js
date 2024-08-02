class GameOverScreen {
    constructor(scene, banner) {
        this.scene = scene;
        this.banner = banner;

        this.score = 0;
        this.highScore = false;
        this.fightersKilled = 0;
        this.fighterCounter = {val:0};  
        this.fighterScoreVal = 10;
        this.fighterScoreCounter = {val:0}
        this.scoutsKilled = 0;
        this.scoutCounter = {val:0};  
        this.scoutScoreVal = 40;
        this.scoutScoreCounter = {val:0};
        this.scoreCounter = {val:0}
        // The {val:0} variables are objects so I can pass them by reference to tally functions.

        //0: Inactive, alpha 0.
        //1: 
        this.state = 0;

        this.textConfig = {
            fontFamily: 'NotJamSciMono',
            fontSize: '30px',
            color: '#000000',  
            align: 'center',
        }
        this.textConfigSmall = {
            fontFamily: 'NotJamSciMono',
            fontSize: '15px',
            color: '#000000',  
            align: 'center',
        }

        //place elements
        this.anchorPointX = game.config.width * 0.25;
        this.anchorPointY = game.config.height * 0.35;
        this.fighterSprite = this.scene.add.sprite(this.anchorPointX, this.anchorPointY, "spaceshipAnimated", 0).setOrigin(0,0);
        this.fighterSprite.play('fighter_flying');
        this.fighterCountText = scene.add.text(this.anchorPointX + game.config.width * 0.12, this.anchorPointY, 'x' + String(this.fighterCounter), this.textConfig)
        this.fighterScoreText = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY, "0", this.textConfig);
        this.scoutSprite = this.scene.add.sprite(this.anchorPointX, this.anchorPointY + game.config.height*0.1, "scout_spritesheet", 0).setOrigin(0,0);
        this.scoutSprite.play('scout_flying');
        this.scoutCountText = scene.add.text(this.anchorPointX + game.config.width * 0.12, this.anchorPointY + game.config.height*0.1, 'x' + String(this.scoutCounter), this.textConfig);
        this.scoutScoreText = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY + game.config.height*0.1, '0', this.textConfig);
        this.line = this.scene.add.rectangle(this.anchorPointX, this.anchorPointY + game.config.height*0.18, game.config.width * 0.5, game.config.height*0.006, this.textConfig.color).setOrigin(0,0)
        this.scoreWordText = this.scene.add.text(this.anchorPointX, this.anchorPointY + game.config.height*0.22, "SCORE", this.textConfig);
        this.scoreText = this.scene.add.text(this.anchorPointX + game.config.width*0.42, this.anchorPointY + game.config.height*0.22, "0", this.textConfig);
        this.hiScoreText = this.scene.add.text(this.anchorPointX + game.config.width * 0.51, this.anchorPointY + game.config.height * 0.3, "HI-SCORE!", this.textConfigSmall).setOrigin(1,0);
        this.hiScoreText.setAlpha(0);
        this.pressZ = this.scene.add.text(this.anchorPointX + game.config.width * 0.1, this.anchorPointY + game.config.height * 0.45, "PRESS Z TO CONTINUE", this.textConfigSmall);
        this.pressZFlashing = false;
        this.setAlpha(0);

        this.countupSound = this.scene.sound.add('countup', {volume:0.5});
        this.hiScoreSound = this.scene.sound.add('highscore', {volume:0.8})

        //STATES
        //1: Inactive
        //2: FIGHTER SECTION: Just got activated.  Showing sprites and "SCORE".  Start delayed call tally fighters and proceed to 2.1
        //  2.1:  fighterCounter tallying started.  Wait for it to be done then proceed to 2.2
        this.state = 1;


        //OPERATION STATS
        this.countSpeed = 100;  //amount of milliseconds between each count lerp step
        this.fastCountSpeed = 40;

        //CONTROL VARIABLES
        this.fighterTallyDone = {val:false};
        this.scoutTallyDone = {val:false};
        this.scoreTallyDone = {val:false};
    }

    start() {
        this.state = 2;
    }

    update() {
        //STATE 1: INACTIVE =========================================================
        if (this.state == 1) {
        } 
        //STATE 2: FIGHTER ==========================================================
        //Just got activated.  start fighter counter
        else if (this.state == 2) { 
            this.fighterSprite.setAlpha(1);
            this.scoutSprite.setAlpha(1);
            this.line.setAlpha(1);
            this.scoreWordText.setAlpha(1);
            this.fighterTallyDone.val = false;
            this.scene.clock.delayedCall(800, ()=>{ //starting fighterCounter lerp
                this._updateInfo();
                this.fighterCountText.setAlpha(1);
                this._countTally(this.fighterCountText, this.fighterCounter, this.fightersKilled, this.fighterTallyDone)
            }, [], this)
            this.state = 2.1;
        } 
        //wait for fighterCounter tally to finish then proceed to state 2.2
        else if (this.state == 2.1) { 
            if (this.fighterTallyDone.val) {
                this.state = 2.2
            }
        } 
        //start delayed call for fighter scoreval to setalpha to 1 and proceed
        else if (this.state == 2.2) { 
            this.scene.clock.delayedCall(1000, ()=>{
                this.fighterScoreText.setAlpha(1);
                this.countupSound.play();
                this.fighterScoreText.setText(String(this.fightersKilled*this.fighterScoreVal));
            }, [], this)
            this.state = 2.3
        } 
        //wait for 2.2's delayedcall to trigger then proceed
        else if (this.state == 2.3) { 
            if (this.fighterScoreText.alpha == 1) {
                this.state = 3;
            }
        }
        //STATE 3: SCOUT =====================================================================
        // Start Scout count tally
        else if (this.state == 3) {            
            this.scene.clock.delayedCall(800, ()=>{ //starting scoutCounterTally
            this.scoutCountText.setAlpha(1);
            this._countTally(this.scoutCountText, this.scoutCounter, this.scoutsKilled, this.scoutTallyDone)
        }, [], this)
        this.state = 3.1;
        }
        //State 3.1:  Wait for Scout tally to finish then proceed to state 3.2
        else if (this.state == 3.1) {
            if (this.scoutTallyDone.val) this.state = 3.2;
        }
        //State 3.2:  Start delayed call to set Scout score text to 1
        else if (this.state == 3.2) {
            this.scene.clock.delayedCall(800, ()=>{
                this.scoutScoreText.setAlpha(1);
                this.countupSound.play();
                this.scoutScoreText.setText(String(this.scoutsKilled*this.scoutScoreVal));
            })
            this.state = 3.3
        }
        //State 3.3:  Wait for scoutScoreText to setAlpha to 1 then proceed
        else if (this.state == 3.3) {
            if (this.scoutScoreText.alpha == 1) this.state = 4;
        }
        //STATE 4: FINAL SCORE ======================================================================
        //start delayed call to start score tallying
        else if (this.state == 4) {
            this.scene.clock.delayedCall(800, ()=>{
                this.scoreText.setAlpha(1);
                this._scoreTally(this.scoreText, this.scoreCounter, this.score, this.scoreTallyDone)
            }, [], this)
            this.state = 4.1;
        } 
        //wait for score tallying to be done then proceed to state 5
        else if (this.state == 4.1) {
            if (this.scoreTallyDone.val) {
                if (this.score > this.highScore) {
                    this.hiScoreText.setAlpha(1);
                    this.hiScoreSound.play();
                    this.state = 5;
                } else this.state = 5;
            }
        }
        //STATE 5: WAIT FOR INPUT ============================================================================
        //wait for player to press z or x then go back to main menu screen 
        else if (this.state == 5) {
            if (keyZ.isDown || keyX.isDown) {
                this.backToMainMenu();
            }
            this.scene.clock.delayedCall(5000, ()=>{
                if (this.state < 5) return;
                this.pressZFlashing = true;
                this._pressZFlash();
            }, [], this)
            this.state = 5.1
        }
        //State 5.1: waiting for input, but pressZ is now flashing
        else if (this.state == 5.1) {
            if (keyZ.isDown || keyX.isDown) {
                this.backToMainMenu();
            } 
        }
    }

    //lerps at regular intervals of this.countSpeed, updating counter object as it goes. (counter is an object passed by reference)
    _countTally(textElement, counter, target, endSignal) {
        textElement.setText("x" + String(counter.val));
        this.countupSound.play();
        if (counter.val < target) {
            counter.val++;
            this.scene.clock.delayedCall(this.countSpeed, this._countTally, [textElement, counter, target, endSignal], this)
        } else endSignal.val = true;
    }

    //quickly tallies up score.  counter and endSignal are {val:--} objects
    _scoreTally(textElement, counter, target, endSignal) {
        textElement.setText(String(counter.val));
        this.countupSound.play();
        if (counter.val < target) {
            counter.val += 10;
            this.scene.clock.delayedCall(this.fastCountSpeed, this._scoreTally, [textElement, counter, target, endSignal], this)
        } else endSignal.val = true;
    }

    _updateInfo() {
        this.score = this.banner.score + 500;
        this.highScore = (this.banner.score >= this.banner.highScore);
        this.fightersKilled = this.banner.fightersKilled + 14;
        this.fighterCounter.val = 0;
        this.fighterScoreCounter.val = 0;
        this.fighterScoreVal = this.scene.fighter1.scoreValue;
        this.fighterCountText.setText("x0");
        this.fighterScoreText.setText("");
        this.scoutsKilled = this.banner.scoutsKilled + 5;
        this.scoutCounter.val = 0;
        this.scoutScoreCounter.val = 0;
        this.scoutScoreVal = this.scene.scout.scoreValue;
        this.scoutCountText.setText("x0");
        this.scoutScoreText.setText("");
        this.scoreText.setText("");
    }

    //recursively calls itself every time interval to flash pressZ
    _pressZFlash() {
        if (!this.pressZFlashing) {
            this.pressZ.setAlpha(0);
            return;
        } else {
            if (this.pressZ.alpha == 0) {
                this.scene.clock.delayedCall(800, ()=>{
                    this.pressZ.setAlpha(1);
                    this._pressZFlash();
                }, [], this)
            } else if (this.pressZ.alpha == 1) {
                this.scene.clock.delayedCall(800, ()=>{
                    this.pressZ.setAlpha(0);
                    this._pressZFlash();
                }, [], this)
            }
        }
    }

    //sets alpha of all sprites and text except hiScoreText
    setAlpha(value) {
        this.fighterSprite.setAlpha(value);
        this.fighterCountText.setAlpha(value);
        this.fighterScoreText.setAlpha(value);
        this.scoutSprite.setAlpha(value);
        this.scoutCountText.setAlpha(value);
        this.scoutScoreText.setAlpha(value);
        this.line.setAlpha(value);
        this.scoreWordText.setAlpha(value);
        this.scoreText.setAlpha(value);
        this.pressZ.setAlpha(value);
    }

    backToMainMenu() {
        this.pressZ.setAlpha(0);
        this.pressZFlashing = false;
        this.hiScoreText.setAlpha(0);
        this.state = 1;
        this.setAlpha(0);
        this.scene.backToMainMenu();
    }
}