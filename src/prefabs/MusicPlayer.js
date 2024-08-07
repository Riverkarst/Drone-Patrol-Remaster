class MusicPlayer {
    constructor(scene) {
        this.scene = scene;
        this.music = this.scene.sound.add('Attack on Oritheia');
        this.volume = 0.8;
        this.musicConfig = { loop:true, volume:this.volume };
        this.muted = false;

        this.button = this.scene.add.sprite(game.config.width * 0.95, game.config.height * 0.05, 'music_active');
        this.button.setAlpha(0.4);
        this.button.setInteractive();
        this.button.on('pointerdown', ()=>{
            this.toggleMute();
        }, this)

        //NOW HOOK UP MUTE UNMUTE TO M BUTTON  ALSO HOOK UP WASD CONTROLS
        this.mFirstDown = true;
    }

    update() {
        if (keyM.isDown) {
            if (this.mFirstDown) {
                this.toggleMute();
                this.mFirstDown = false;
            } else if (!this.mFirstDown) {}
        } else if (keyM.isUp) this.mFirstDown = true;
    }

    play() {
        this.music.play(this.musicConfig);
        if (this.muted) this.music.setVolume(0);
    }

    stop() {
        this.music.stop();
    }

    toggleMute() {
        if (this.muted) this.unMute();
        else this.mute();
    }

    mute() {
        this.muted = true;
        this.button.setTexture('music_inactive');
        this.music.setVolume(0);
    }

    unMute() {
        this.muted = false;
        this.button.setTexture('music_active');
        this.music.setVolume(this.volume);
    }
}