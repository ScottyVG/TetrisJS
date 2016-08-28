var drMarioGame = drMarioGame || {};

drMarioGame.game = new Phaser.Game(160, 320, Phaser.AUTO, '');

drMarioGame.game.state.add('Boot', drMarioGame.Boot);
drMarioGame.game.state.add('Preload', drMarioGame.Preload);
drMarioGame.game.state.add('Game', drMarioGame.Game);

drMarioGame.game.state.start('Boot');
