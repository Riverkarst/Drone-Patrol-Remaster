/**
 * Back in its form as a bachelor's project before my effort to remaster it, this scene used to be a rudimentary menu scene.  
 * I've since retooled it to simply preload all assets, and immediately move to Play scene
 */


class LoadingBar {
    constructor(scene) {
        this.scene = scene;
        this.outline = this.scene.add.rectangle(game.config.width/2, game.config.height/2, game.config.width * 0.4, game.config.height * 0.065, '0x000000');
        this.outline.setStrokeStyle(4, '0xFFFFFF', 1);
        this.progressStart = game.config.width * 0.302;
        this.progressLength = game.config.width * 0.3955;
        this.progressHeight = game.config.height * 0.058;
        this.progress = this.scene.add.rectangle(this.progressStart, game.config.height/2, this.progressLength * 0.5, game.config.height * 0.058, '0xFFFFFF').setOrigin(0,0.5);
        this.progressAmount = 0;
        this.setProgress(0);
        //this.progress.setAlpha(0.5);
    }

    //pass amount as a number between 0 to 1.  0 is empty, 1 is full.
    setProgress(amount) {
        if (amount > 1) amount = 1;
        this.progressAmount = amount;
        console.log(amount);
        this.progress.setSize(this.progressLength * amount, this.progressHeight);
    }
}


class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        //loading bar
        this.loadingBar = new LoadingBar(this);

        //AUDIO
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/launch1.wav');
        this.loadingBar.setProgress(0.04);
        //this.load.audio('blastoff', './assets/blastoff.wav');
        this.load.audio('blastoff2', './assets/blastoff2.wav');
        this.loadingBar.setProgress(0.11);
        //this.load.audio('blastoff3', './assets/blastoff3.wav');
        this.load.audio('sfx_rocket', './assets/assets_rocket_shot.wav');
        this.load.audio('launch1', './assets/launch1.wav');
        this.loadingBar.setProgress(0.14);
        this.load.audio('reload', './assets/reload5_shotgun.wav');
        this.load.audio('reloadStart', './assets/reloadStart3.wav');
        this.loadingBar.setProgress(0.24);
        //this.load.audio('ready', './assets/ready.wav');
        //this.load.audio('rearming', './assets/rearming.wav');
        this.load.audio('explosion0', './assets/Explosion1.wav');
        this.load.audio('explosion1', './assets/Explosion2.wav');
        this.load.audio('explosion2', './assets/Explosion3.wav');
        this.load.audio('explosion3', './assets/Explosion4.wav');
        this.loadingBar.setProgress(0.35)
        this.load.audio('sparrowExplosion', './assets/sparrowExplosion.wav');
        this.loadingBar.setProgress(0.4);
        this.load.audio("Attack on Oritheia", "assets/Oritheia2.wav");
        this.loadingBar.setProgress(0.6);
        this.load.audio('highscore', 'assets/highscore4.wav');
        this.load.audio('countup', 'assets/countup_sound2.wav');
        this.loadingBar.setProgress(0.65);
        //IMAGES
        //this.load.image("drone", "assets/Drone.png");
        this.load.image("spaceship", "assets/spaceship.png");
        this.loadingBar.setProgress(0.66);
        //this.load.image("background", "assets/background.png");
        //this.load.image("foreground1", "assets/foreground1.png");
        //this.load.image("foreground2", "assets/foreground2.png");
        this.load.image("background_enlarged", "assets/background_enlarged.png");
        this.loadingBar.setProgress(0.7);
        this.load.image("foreground1_enlarged", "assets/foreground1_enlarged.png");
        this.loadingBar.setProgress(0.76)
        this.load.image("foreground2_enlarged", "assets/foreground2_enlarged2.png");
        this.loadingBar.setProgress(0.81);
        this.load.image("border", "assets/borders.png");
        this.load.image('banner_enlarged', 'assets/BannerScoreExtended.png');
        this.loadingBar.setProgress(0.85);
        this.load.image('UI', "assets/UI.png");
        //this.load.image('awkward_cat', './assets/awkward_cat.jpg');
        this.load.image('launcher_rack_x5', './assets/launcher_rack_x5.png');
        this.loadingBar.setProgress(0.89);
        //SPRITESHEETS
        this.load.spritesheet('explosion', './assets/ExplosionSpritemap.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('scout_explosion_spritesheet', './assets/scout_explosion_spritesheet.png', {frameWidth: 48, frameHeight: 28, startFrame: 0, endFrame: 7});
        this.load.spritesheet('drone_spritesheet', './assets/DroneSpritesheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
        this.loadingBar.setProgress(0.92);
        this.load.spritesheet('spaceshipAnimated', './assets/spaceshipSpritemap2.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('scout_spritesheet', './assets/scout_spritesheet.png', { frameWidth: 48, frameHeight: 28, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('rocket', './assets/rocket_spritesheet.png', { frameWidth:38, frameHeight:80, startFrame:0, endFrame:13 });
        this.loadingBar.setProgress(0.93);
        this.load.atlas('launcher', './assets/launcher4.png', './assets/launcher4.json');
        this.loadingBar.setProgress(0.98);

    }

    create() {
        //let menuText = this.add.text(300, 200, "menu goes here");
        //menuText.setOrigin(0.5, 0.5);
        //this.scene.start("playScene");
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, menuConfig);

        // show menu text
        //this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        //this.add.text(game.config.width/2, game.config.height/2, 'Use ← → arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        //menuConfig.backgroundColor = '#00FF00';
        //menuConfig.color = '#000';
        //this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //this.input.inputPlugin.activePointer;
        this.scene.start('playScene');
    }

    update() {
        /*
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            //easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
            */
    }
}