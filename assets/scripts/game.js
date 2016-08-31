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
    // this.virusLayer = this.map.createLayer('virusLayer');

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundLayer.resizeWorld();

    //contains a list of the next pill to be displayed
    var queue = [];

    var newPill = this.pillRandomizer();



    //Make Pill combo

    //  virus group
    this.createVirus();
    //
    // virus = this.game.add.group();
    // virus.enableBody = true;
    // virus.physicsBodyType = Phaser.Physics.ARCADE;
    // virus.createMultiple(30, 'redVirus');
    // virus.setAll('anchor.x', 0.5);
    // virus.setAll('anchor.y', 1);
    // virus.setAll('outOfBoundsKill', true);
    // virus.setAll('checkWorldBounds', true);

    //Player Spawing Location
    var playerSprite = this.findObjectsByType('playerStart', this.map, 'objectsLayer')



    //Pill spawning location
    // TODO: have the game create a random pill color combo
    var result = this.findObjectsByType('playerStartLeft', this.map, 'objectsLayer')
    this.player = this.game.add.sprite(result[0].x, result[0].y, newPill[0]);
    // this.player = this.game.add.group();
    // this.player.create('rightGreen');
    this.game.physics.arcade.enable(this.player);
    // this.game.add.sprite(0, 0, 'leftGreen');
    // this.game.add.sprite(0, 0, 'rightGreen');

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
      // console.log('Whats in my object?', map.objects[layer]);
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
  },

  //
  pillRandomizer: function() {
    var left = ['leftRed', 'leftYellow', 'leftBlue'];
    var right = ['rightRed', 'rightYellow', 'rightBlue'];
    var pill = [];
    pill.push(left[Math.floor(Math.random() * 3)]);
    pill.push(right[Math.floor(Math.random() * 3)]);
    console.log(pill);
    return pill;
  },

  // spawn a new pill and the scene and update the next one
  // managePills();

  // Remove all blocks from a filled line
  // function cleanLine(line) {
  //   var delay = 0;
  //   for (var k = 0; k < numBlocksX; k++) {
  // Make a small animation to send the removed blocks flying to the top
  //     var tween = game.add.tween(sceneSprites[k][line]);
  //     tween.to({
  //       y: 0
  //     }, 500, null, false, delay);
  //     tween.onComplete.add(destroy, this);
  //     tween.start();
  //     sceneSprites[k][line] = null;
  //     scene[k][line] = 0;
  //     delay += 50; // For each block, start the tween 50ms later so they move wave-like
  //   }
  // }
  //
  // function destroy(sprite) {
  //   sprite.destroy();
  // }
  // Makes the falling tetromino fall
  // function fall(){
  //     if(pauseState || gameOverState){return;}
  //     if(canMove(slide,"down")){
  //         move(slide,slideCenter,"down",0);
  //     }else{ // If it cannot move down, it means it is touching fallen blocks ; it's time to see if a line has been completed
  //         // and to spawn a new falling tetromino
  //         var lines = [];
  //         for(var i = 0; i < tetromino.cells.length; i++){
  //             // Make a set of the y coordinates of the falling tetromino ; the lines corresponding to those y coordinates will be
  //             // checked to see if they are full
  //             if(lines.indexOf(tetromino.cells[i][1]) == -1) { // if the value is not yet in the list ...
  //                 lines.push(tetromino.cells[i][1]);
  //             }
  //             var x = tetromino.cells[i][0];
  //             var y = tetromino.cells[i][1];
  //             scene[x][y] = occupiedValue;
  //             sceneSprites[tetromino.cells[i][0]][tetromino.cells[i][1]] = tetromino.sprites[i];
  //         }
  //         checkLines(lines); // check if lines are completed
  //         manageTetrominos(); // spawn a new tetromino and update the next one
  //     }
  // }


};

// CHEERS!!! 🍻

//single pills
// this.game.add.sprite(16, 16, 'singleRed');
// this.game.add.sprite(0, 0, 'singleBlue');
// this.game.add.sprite(0, 0, 'singleYellow');
//
//left half of pills
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
