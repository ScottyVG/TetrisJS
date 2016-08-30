var drMarioGame = drMarioGame || {};

//title screen
drMarioGame.Game = function() {};
console.log('Game state loaded');

drMarioGame.Game.prototype = {
  create: function() {
    this.map = this.game.add.tilemap('drMarioLevel');
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tiles', 'gameTiles');

    //create layer
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.virusLayer = this.map.createLayer('virusLayer');
    // this.virusLayer = this.map.createLayer('virusLayer');


    //collision on blockedLayer
    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundLayer.resizeWorld();


    //Make Pill combo
    this.createVirus();
    // this.createPills();

    var playerSprite = this.findObjectsByType('playerStart', this.map, 'objectsLayer')


    //Pill spawning location
    // TODO: have the game create a random pill color combo
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'leftGreen');
    this.game.physics.arcade.enable(this.player);

    //Virus spawning
    // var result = this.findObjectsByType('virus', this.map, 'virusLayer')
    // this.player = this.game.add.sprite(result[0].x, result[0].y, 'redVirus');
    // this.game.physics.arcade.enable(this.player);

    // move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

  },

  update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.collide(this.player, this.virus);

    //player movement
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 12;


    if (this.cursors.down.isDown) {
      this.player.body.velocity.y += 100;
      console.log('down');
    } else if (this.cursors.left.isDown) {
      this.player.body.velocity.x -= 100;
      console.log('left');
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x += 100;
      console.log('right');
    }


  },

  //======================================//
  // Hoisted Functions for Create & Update//
  //======================================//

  // find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element) {
      console.log('Whats in my object, Bro?', map.objects[layer]);
      if (element.type === type) {
        // Phaser uses top left, Tiled bottom left so we have to adjust
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },

  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key) {
      sprite[key] = element.properties[key];
    });
  },

  createVirus: function() {
    //create virus
    this.virus = this.game.add.group();
    this.virus.enableBody = true;
    // var item;
    result = this.findObjectsByType('virus', this.map, 'virusLayer');
    result.forEach(function(element) {
      this.createFromTiledObject(element, this.virus);
    }, this);
  }

  // createPill: function() {
  // var pillColorLeft = Math.floor(Math.random() * 3);
  // var pillColorRight = Math.floor(Math.random() * 3);

  //   var pill = {
  //     if (pillColorLeft === 1) {
  //
  //     }
  //     thePlayer: true,
  //     stopped: false,
  //     pillRotation: 0,
  //     pos1Index: startPill,
  //     position: virusPositions[startPill],
  //     pillColor1: pieceColors[pillColor1],
  //
  //     pos2Index: startPill + 1,
  //     position2: virusPositions[startPill + 1],
  //     pillColor2: pieceColors[pillColor2]
  //   }
  //
  //   return pill;
  //
  // }
};

// CHEERS!!! 🍻

//single pills
// this.game.add.sprite(16, 16, 'singleRed');
// this.game.add.sprite(0, 0, 'singleBlue');
// this.game.add.sprite(0, 0, 'singleYellow');
//
// //left half of pills
// this.game.add.sprite(0, 0, 'leftGreen');
// this.game.add.sprite(0, 0, 'leftRed');
// this.game.add.sprite(0, 0, 'leftBlue');
// this.game.add.sprite(0, 0, 'leftYellow');
//
// //right half of pills
// this.game.add.sprite(0, 0, 'rightGreen');
// this.game.add.sprite(0, 0, 'rightRed');
// this.game.add.sprite(0, 0, 'rightBlue');
// this.game.add.sprite(0, 0, 'rightYellow');
