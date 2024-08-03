class MusicPlayer {
    constructor(scene) {
        this.scene = scene;
        this.music = this.scene.sound.add('Attack on Oritheia');
        this.volume = 0.8;
        this.musicConfig = { loop:true, volume:this.volume };
    }

    play() {
        this.music.play(this.musicConfig);
    }

    stop() {
        this.music.stop();
    }

    mute() {
        this.music.setVolume(0);
    }

    unMute() {
        this.music.setVolume(this.volume);
    }
}