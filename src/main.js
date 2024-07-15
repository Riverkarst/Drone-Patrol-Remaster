//const { Phaser } = require("../library/phaser");
//now in Keeping Score  about 80% down

let config = {
    type: Phaser.AUTO,
    width: 640,    //originally 640 by 480
    height: 480,
    scene: [Menu, Play],
};

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;


let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize/3;

