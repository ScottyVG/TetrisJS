var game = new Phaser.Game(375, 667, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

var walls;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  // TODO: Change Background to Black
  game.stage.backgroundColor = '#eee';
  // game.load.image('gamescene', 'assets/img/background.jpg');


  game.load.image('bottom', 'assets/img/elements/bottom.png');
  game.load.image('right', 'assets/img/elements/right.png');
  game.load.image('left', 'assets/img/elements/left.png');
  game.load.image('top', 'assets/img/elements/top.png');
  game.load.image('pill', 'assets/img/sprites/pills/horizontal - blue=blue pill.png');

  // game.load.spritesheet('dude', 'assets/dude.png', 32, 48);


}

function create() {
  //  Enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //  Load background for the game
  // game.add.sprite(0, 0, 'assets/img/scenes/background.jpg');
  //  The platforms group contains the ground and the 2 ledges we can jump on
  walls = game.add.group();
  //  Enable physics for any object that is created in this group
  walls.enableBody = true;
  // Here we create the ground.
  var bottom = walls.create(0, game.world.height - 64, 'bottom');
  //  Scale it to fit the width of the game
  bottom.scale.setTo(.82, .82);
  //  This stops it from falling away when you jump on it
  bottom.body.immovable = true;

  //  Create walls
  var leftWall = walls.create(0, 220, 'left');
  leftWall.scale.setTo(.82, .82);

  leftWall.body.immovable = true;

  var rightWall = walls.create(670, 220, 'right');
  rightWall.scale.setTo(.82, .82);

  rightWall.body.immovable = true;

  // The pill and its settings
  pill = game.add.sprite(32, game.world.height - 150, 'pill');

  //  We need to enable physics on the player
  game.physics.arcade.enable(pill);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);


}

function update() {

}
