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
    this.load.image('gameTiles', 'assets/img/tiles/tiles.png');
    this.load.image('gameSprites', 'assets/img/tiles/drMarioClone.png');
    // TODO: possibly need to load individual sprite images
    // this.load.image('greencup', 'assets/images/greencup.png');
    // this.load.image('bluecup', 'assets/images/bluecup.png');
    // this.load.image('player', 'assets/images/player.png');
    // this.load.image('browndoor', 'assets/images/browndoor.png');

  },
  create: function() {
    this.state.start('Game');
  }
};
