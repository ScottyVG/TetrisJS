var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});



function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
  game.load.image('gamescene', 'assets/img/background.jpg');
}

function create() {
  //  Enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'assets/img/background.jpg');

}

function update() {

}
