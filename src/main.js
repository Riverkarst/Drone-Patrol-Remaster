//const { Phaser } = require("../library/phaser");
//now in Keeping Score  about 80% down

//let sizeMult = 1.2;
let sizePercent = '100%';

let config = {
    //canvas: document.getElementById("GAME"),
    type: Phaser.AUTO,
    width: 640,    
    height: 480,
    scale: { 
        width: 640 * sizeMult,
        height: 480 * sizeMult,
        mode: Phaser.Scale.ScaleModes.NONE,
        autoCenter: Phaser.Scale.NO_CENTER,
    },
    //antialias: false,
    //pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    fps: {
        limit:60
    },
    scene: [Menu,Play],
};

//reserve keyboard vars
let keyZ, keyX, keyLEFT, keyRIGHT,  keyA, keyD, keyR, keySPACE, keyM, keyESC;
let _zfd_util, zFirstDown;



let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize/3;

