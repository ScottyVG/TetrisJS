var drMarioGame = drMarioGame || {};

//loading the game assets
drMarioGame.Preload = function() {};

drMarioGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('drMarioLevel', 'assets/img/drMarioLevel.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/img/tiles.png');
    //virus
    this.load.image('redVirus', 'assets/img/redVirus.png');
    this.load.image('blueVirus', 'assets/img/blueVirus.png');
    this.load.image('yellowVirus', 'assets/img/yellowVirus.png');
    //single pills
    this.load.image('singleRed', 'assets/img/singleRed.png');
    this.load.image('singleBlue', 'assets/img/singleBlue.png');
    this.load.image('singleYellow', 'assets/img/singleYellow.png');
    //left half of pills
    this.load.image('leftGreen', 'assets/img/leftGreen.png');
    this.load.image('leftRed', 'assets/img/leftRed.png');
    this.load.image('leftBlue', 'assets/img/leftBlue.png');
    this.load.image('leftYellow', 'assets/img/leftYellow.png');
    //right half of pills
    this.load.image('rightGreen', 'assets/img/rightGreen.png');
    this.load.image('rightRed', 'assets/img/rightRed.png');
    this.load.image('rightBlue', 'assets/img/rightBlue.png');
    this.load.image('rightYellow', 'assets/img/rightYellow.png');

    console.log('Game Preloaded');
  },
  create: function() {
    this.state.start('Game');
  }
};
