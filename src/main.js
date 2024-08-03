//const { Phaser } = require("../library/phaser");
//now in Keeping Score  about 80% down

//let sizeMult = 1.2;
let sizePercent = '100%';

let config = {
    type: Phaser.AUTO,
    width: 640,    
    height: 480,
    scale: { 
        width: 640 * sizeMult,
        height: 480 * sizeMult,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    //antialias: false,
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    //canvas: document.getElementById("GameCanvas"),
    scene: [Menu,Play],
};

//reserve keyboard vars
let keyZ, keyX, keyLEFT, keyRIGHT,  keyA, keyD, keyR, keySPACE;


let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize/3;

