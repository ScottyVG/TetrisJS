var drMarioGame = drMarioGame || {};

drMarioGame.Boot = function() {};

//settings for game configuration and loading the assets for the loading screen
drMarioGame.Boot.prototype = {
  preload: function() {
    //assets for the loading screen
    this.load.image('preloadbar', 'assets/img/preloaderBar.png');
  },
  create: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#eee';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignVertically = true;
    this.scale.pageAlignHorizontally = true;


    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
  }
};
