class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/launch1.wav');
        this.load.audio('sfx_rocket', './assets/assets_rocket_shot.wav');
        this.load.audio('ready', './assets/ready.wav');
        this.load.audio('rearming', './assets/rearming.wav');
        this.load.audio('explosion0', './assets/Explosion1.wav');
        this.load.audio('explosion1', './assets/Explosion2.wav');
        this.load.audio('explosion2', './assets/Explosion3.wav');
        this.load.audio('explosion3', './assets/Explosion4.wav');
        this.load.audio('sparrowExplosionSFX', './assets/sparrowExplosion.wav');
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

        //loading fonts with webfont
        /*const element = document.createElement('style');
        document.head.appendChild(element);
        const sheet = element.sheet;
        let styles = '@font-face { font-family: "Gravity Bold"; src: "./assets/Fonts/GravityBold8.ttf"; }\n';
        sheet.insertRule(styles, 0);
        //styles = '@font-face { font-family: "Caroni"; src: url("assets/fonts/ttf/caroni.otf") format("opentype"); }';
        //sheet.insertRule(styles, 0);
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');*/
        
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
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ← → arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

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