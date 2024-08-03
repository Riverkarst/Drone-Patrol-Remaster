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
    }

    play() {
        this.music.play(this.musicConfig);
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