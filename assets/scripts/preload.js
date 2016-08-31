var drMarioGame = drMarioGame || {};

//loading the game assets
drMarioGame.Preload = function() {};

drMarioGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.bitmapFont('gameover', 'assets/fonts/gameover.png', 'assets/fonts/gameover.fnt');
    this.load.bitmapFont('videogame', 'assets/fonts/videogame.png', 'assets/fonts/videogame.fnt'); // converted from ttf using http://kvazars.com/littera/
    this.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');

    //load game assets
    this.load.tilemap('drMarioLevel', 'assets/json/drMarioLevel.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/img/tiles.png');
    this.load.image('wall', 'assets/img/wall.png');
    //load virus
    this.load.image('redVirus', 'assets/img/redVirus.png');
    this.load.image('blueVirus', 'assets/img/blueVirus.png');
    this.load.image('yellowVirus', 'assets/img/yellowVirus.png');
    //load single pills
    this.load.image('singleRed', 'assets/img/singleRed.png');
    this.load.image('singleBlue', 'assets/img/singleBlue.png');
    this.load.image('singleYellow', 'assets/img/singleYellow.png');
    //load left half of pills
    this.load.image('leftRed', 'assets/img/leftRed.png');
    this.load.image('leftBlue', 'assets/img/leftBlue.png');
    this.load.image('leftYellow', 'assets/img/leftYellow.png');
    //load right half of pills
    this.load.image('rightRed', 'assets/img/rightRed.png');
    this.load.image('rightBlue', 'assets/img/rightBlue.png');
    this.load.image('rightYellow', 'assets/img/rightYellow.png');
    //audio
    this.load.audio('move', 'assets/sound/move.mp3', 'assets/sound/move.ogg');
    this.load.audio('win', 'assets/sound/win.mp3', 'assets/sound/win.ogg');
    this.load.audio('gameover', 'assets/sound/gameover.mp3', 'assets/sound/gameover.ogg');

    console.log('Game Preloaded');
  },
  create: function() {
    this.state.start('Game');
  }
};
