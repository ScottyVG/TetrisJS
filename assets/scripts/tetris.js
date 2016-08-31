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

    var blocksPerTetromino = 6;
    // 7 possible pills
    var nbBlockTypes = 7;
    // px per grid space
    var blockSize = 16;
    // make the grid 18 blocks high
    var numBlocksY = 17;
    // make the grid 8 blocks wide
    var numBlocksX = 8;

    // width of the grid in pixels
    var gameWidth = numBlocksX * blockSize;
    var menuWidth = 300;

    // Delay in ms below which two consecutive key presses are counted as the same one (to avoid super fast movement)
    var movementLag = 100;

    // x position of the score text
    var scoreX = gameWidth + 90;

    // number of next tetrominoes to display on the right
    var nbNext = 1;
    // value in the grid of a cell occupied by a block of a fallen pill
    var blockValue = 1;
    // value in the grid of a cell occupied by a block of the currently fallking tetromino
    var occupiedValue = 2;

    // player score
    var score = 0;
    // by how much the score increases with each completed line
    var scoreIncrement = 50;
    var completedLines = 0;
    // number of lines to complete before the falling speed and points reward increase
    var linesThreshold = 3;
    // by how much (in ms) does the falling speed increase every linesThreshold lines completed
    var speedUp = 100;
    // by how much does the points reward increase every linesThreshold lines completed
    // AKA combo points
    var scorePlus = 25;
    // Falling speed of the falling tetromino (one block per second initially)
    var timeOut = Phaser.Timer.SECOND;

    // contains the list the nbNext next pill to display
    var queue = [];

    // GameStates
    var pauseState = false;
    var gameOverState = false;

    // the positions of each block of a tetromino with respect to its center (in cell coordinates)
    var offsets = {
    0 : [[0,-1],[0,0],[0,1],[1,1]], // L
    1 : [[0,-1],[0,0],[0,1],[-1,1]], // J
    2 : [[-1,0],[0,0],[1,0],[2,0]], // I
    3 : [[-1,-1],[0,-1],[0,0],[-1,0]], // 0
    4 : [[-1,0],[0,0],[0,-1],[1,-1]],// S
    5 : [[-1,0],[0,0],[1,0],[0,1]], // T
    6 : [[-1,-1],[0,-1],[0,0],[1,0]] // Z
};

    // the y position of each pill (in cell coordinates)
    var y_start = {
      0: 1,
      1: 1,
      2: 0,
      3: 1,
      4: 1,
      5: 0,
      6: 1
    };

    // The amount of cells ([x,y]) by which the pills move in each direction
    var move_offsets = {
      "left": [-1, 0],
      "down": [0, 1],
      "right": [1, 0]
    };
    var tetromino, cursors, rotates, pause, pauseText, scoreTitle, scoreText, linesText, scene, sceneSprites, timer, loop, shade;
    // counter to prevent excessive movements when key press or multiple key downs
    var currentMovementTimer = 0;

    var newPillValue = this.pillRandomizer();

    //Make Pill combo

    // 2D array of numBlocksX*numBlocksY cells corresponding to the playable scene; will contains 0 for empty, 1 if there is already
    // a block from the current pill, and 2 if there is a block from a fallen pill
    scene = [];
    // same but stores sprites instead
    sceneSprites = [];

    // Fills the two arrays with empty cells
    for (var i = 0; i < numBlocksX; i++) {
      var col = [];
      var spriteCol = [];
      for (var j = 0; j < numBlocksY; j++) {
        col.push(0);
        spriteCol.push(null);
      }
      scene.push(col);
      sceneSprites.push(spriteCol);
    }
    console.log(scene);

    // create ground
    this.game.add.tileSprite(0, this.game.world.height - blockSize, gameWidth, blockSize, 'wall', 0);
    // create walls
    // this.game.add.tileSprite()

    // TODO: Scoring

    // spawn a new pill and the scene and update to next scene
    // TODO: write manageTetrominos();

    // Keyboard input
    // TODO: Mapkeyboard
    this.game.input.keyboard.enabled = true;
    // Movement keys
    //   this.cursors = {
    //     right: this.input.keyboard.addKey(Phaser.Keyboard[RIGHT]).value]),
    // left: this.input.keyboard.addKey(Phaser.Keyboard[LEFT]).value]),
    // down: this.input.keyboard.addKey(Phaser.Keyboard[DOWN]).value])
    // },
    // Rotation keys
    // this.rotates = {
    // counterClockwise: game.input.keyboard.addKey(Phaser.Keyboard[]).value]),
    // clockwise: game.input.keyboard.addKey(Phaser.Keyboard[])
    // },
    // pause = game.input.keyboard.addKey(Phaser.Keyboard[document.getElementById("pause").value]);

    // Timer to make the the falling pill fall
    // TODO: hoist fall function to enable this timer
    // timer = this.game.time.events;
    // loop = timer.loop(timeOut, fall, this);
    // timer.start();

    // Sound effects
    // TODO: sound effects

    // update score
    // TODO: write function to update score

    // update timer
    // TODO:
    function updateTimer() {
      if (completedLines % linesThreshold == 0) {
        loop.delay -= speedUp; // Accelerates the fall speed
        scoreIncrement += scorePlus; // Make lines more rewarding
      }
    }

    // text align function
    function alignText() {
      var center = scoreTitle.x + scoreTitle.textWidth / 2;
      scoreText.x = center - (scoreText.textWidth * 0.5);
      linesText.x = center - (linesText.textWidth * 0.5);
    }

    //manage pills
    function manageTetrominos() {
      // Keep the queue filled with as many tetrominos as needed
      while (queue.length < nbNext + 1) {
        queue.unshift(new Tetromino()); // adds at beginning of array
      }
      tetromino = queue.pop(); // the last one will be put on the stage
      var start_x = Math.floor(numBlocksX / 2);
      var start_y = y_start[tetromino.shape];
      var conflict = tetromino.materialize(start_x, start_y, true);
      if (conflict) {
        gameOver();
      } else {
        // display the next tetromino(s)
        for (var i = 0; i < queue.length; i++) {
          var s_x = Math.floor((scoreTitle.x + scoreTitle.textWidth / 2) / 32);
          var s_y = 14;
          queue[i].materialize(s_x, s_y, false);
        }
      }
    }

    // Move a block of the falling tetromino left, right or down
    function slide(block, dir) {
      var new_x = tetromino.cells[block][0] + move_offsets[dir][0];
      var new_y = tetromino.cells[block][1] + move_offsets[dir][1];
      return [new_x, new_y];
    }

    // Move the center of the falling tetromino left, right or down
    function slideCenter(dir) {
      var new_center_x = tetromino.center[0] + move_offsets[dir][0];
      var new_center_y = tetromino.center[1] + move_offsets[dir][1];
      return [new_center_x, new_center_y];
    }

    // Rotate a block of the falling tetromino (counter)clockwise
    function rotate(block, dir) {
      var c_x = tetromino.center[0];
      var c_y = tetromino.center[1];
      var offset_x = tetromino.cells[block][0] - c_x;
      var offset_y = tetromino.cells[block][1] - c_y;
      offset_y = -offset_y; // Adjust for the JS coordinates system instead of Cartesian
      var new_offset_x = ((dir == "clockwise")) ? offset_y : -offset_y;
      var new_offset_y = ((dir == "clockwise")) ? -offset_x : offset_x;
      new_offset_y = -new_offset_y;
      var new_x = c_x + new_offset_x;
      var new_y = c_y + new_offset_y;
      return [new_x, new_y];
    }

    // Uses the passed callback to check if the desired move (slide or rotate) doesn't conflict with another block from the array
    function canMove(coordinatesCallback, dir) {
      if (pauseState) {
        return false;
      }
      for (var i = 0; i < tetromino.cells.length; i++) {
        var new_coord = coordinatesCallback(i, dir); // return coords in terms of cells, not pixels
        var new_x = new_coord[0];
        var new_y = new_coord[1];
        if (!validateCoordinates(new_x, new_y)) {
          return false;
        }
      }
      return true;
    }

    function validateCoordinates(new_x, new_y) {
      if (new_x < 0 || new_x > numBlocksX - 1) {
        //console.log('Out of X bounds');
        return false;
      }
      if (new_y < 0 || new_y > numBlocksY - 1) {
        //console.log('Out of Y bounds');
        return false;
      }
      if (scene[new_x][new_y] == occupiedValue) {
        //console.log('Cell is occupied');
        return false;
      }
      return true;
    }

    // Move (slide or rotate) a tetromino according to the provided callback
    function move(coordinatesCallback, centerCallback, dir, soundOnMove) {
      for (var i = 0; i < tetromino.cells.length; i++) {
        var old_x = tetromino.cells[i][0];
        var old_y = tetromino.cells[i][1];
        var new_coord = coordinatesCallback(i, dir);
        var new_x = new_coord[0];
        var new_y = new_coord[1];
        tetromino.cells[i][0] = new_x;
        tetromino.cells[i][1] = new_y;
        tetromino.sprites[i].x = new_x * blockSize;
        tetromino.sprites[i].y = new_y * blockSize;
        scene[old_x][old_y] = 0;
        scene[new_x][new_y] = blockValue;
      }
      if (centerCallback) {
        var center_coord = centerCallback(dir);
        tetromino.center = [center_coord[0], center_coord[1]];
      }
      if (soundOnMove) {
        Game.radio.playSound(Game.radio.moveSound);
      }
    }

    // TODO: Check to see if this is needed???
    function lineSum(l) {
      var sum = 0;
      for (var k = 0; k < numBlocksX; k++) {
        sum += scene[k][l];
      }
      return sum
    }

    // check if the lines corresponding to the y coordinates in lines are full ; if yes, clear them and collapse the lines above
    function checkLines(lines) {
      var collapsedLines = [];
      for (var j = 0; j < lines.length; j++) {
        var sum = lineSum(lines[j]);
        // A line is completed if all the cells of that line are marked as occupied
        if (sum == (numBlocksX * occupiedValue)) { // the line is full
          updateScore();
          collapsedLines.push(lines[j]);
          Game.radio.playSound(Game.radio.winSound);
          cleanLine(lines[j]);
        }
      }
      if (collapsedLines.length) {
        collapse(collapsedLines);
      }
    }

    // Remove all blocks from a filled line
    function cleanLine(line) {
      var delay = 0;
      for (var k = 0; k < numBlocksX; k++) {
        // Make a small animation to send the removed blocks flying to the top
        var tween = game.add.tween(sceneSprites[k][line]);
        tween.to({
          y: 0
        }, 500, null, false, delay);
        tween.onComplete.add(destroy, this);
        tween.start();
        sceneSprites[k][line] = null;
        scene[k][line] = 0;
        delay += 50; // For each block, start the tween 50ms later so they move wave-like
      }
    }

    function destroy(sprite) {
      sprite.destroy();
    }

    // Once a lone has been cleared, make the lines above it fall down ; the argument lines is a list of the y coordinates of the
    // lines that have been cleared
    function collapse(lines) {
      // Find the min y value of the cleared lines, i.e. the highermost cleared line ; only lines above that one have to collapse
      var min = 999;
      for (var k = 0; k < lines.length; k++) {
        if (lines[k] < min) {
          min = lines[k];
        }
      }
      // From the highermost cleared line - 1 to the top, collapse the lines
      for (var i = min - 1; i >= 0; i--) {
        for (var j = 0; j < numBlocksX; j++) {
          if (sceneSprites[j][i]) {
            // lines.length = the number of lines that have been cleared simultaneously
            sceneSprites[j][i + lines.length] = sceneSprites[j][i];
            sceneSprites[j][i] = null;
            scene[j][i + lines.length] = occupiedValue;
            scene[j][i] = 0;
            // Make some animation to collapse the lines
            var tween = game.add.tween(sceneSprites[j][i + lines.length]);
            var new_y = sceneSprites[j][i + lines.length].y + (lines.length * blockSize);
            tween.to({
              y: new_y
            }, 500, null, false);
            tween.start();
          }
        }
      }
    }

    function displayScene() {
      console.log('Scene length' + scene.length);
      for (var i = 0; i < scene.length; i++) {
        for (var j = 0; j < scene[i].length; j++) {
          console.log(scene[i][j]);
        }
      }
    }

    // Makes the falling tetromino fall
    function fall() {
      if (pauseState || gameOverState) {
        return;
      }
      if (canMove(slide, "down")) {
        move(slide, slideCenter, "down", 0);
      } else { // If it cannot move down, it means it is touching fallen blocks ; it's time to see if a line has been completed
        // and to spawn a new falling tetromino
        var lines = [];
        for (var i = 0; i < tetromino.cells.length; i++) {
          // Make a set of the y coordinates of the falling tetromino ; the lines corresponding to those y coordinates will be
          // checked to see if they are full
          if (lines.indexOf(tetromino.cells[i][1]) == -1) { // if the value is not yet in the list ...
            lines.push(tetromino.cells[i][1]);
          }
          var x = tetromino.cells[i][0];
          var y = tetromino.cells[i][1];
          scene[x][y] = occupiedValue;
          sceneSprites[tetromino.cells[i][0]][tetromino.cells[i][1]] = tetromino.sprites[i];
        }
        checkLines(lines); // check if lines are completed
        manageTetrominos(); // spawn a new tetromino and update the next one
      }
    }

    // Puts a shade on the stage for the game over and pause screens
    function makeShade() {
      shade = game.add.graphics(0, 0);
      shade.beginFill(0x000000, 0.6);
      shade.drawRect(0, 0, game.world.width, game.world.height);
      shade.endFill();
    }

    function managePauseScreen() {
      pauseState = !pauseState;
      if (pauseState) {
        Game.radio.music.pause();
        makeShade();
        pauseText = game.add.bitmapText(game.world.centerX, game.world.centerY, 'videogame', 'PAUSE', 64);
        pauseText.anchor.setTo(0.5);

      } else {
        timer.resume();
        Game.radio.playMusic();
        shade.clear();
        pauseText.destroy();
      }
    }

    function gameOver() {
      gameOverState = true;
      game.input.keyboard.enabled = false;
      Game.radio.music.pause();
      Game.radio.playSound(Game.radio.gameOverSound);
      makeShade();
      var gameover = game.add.bitmapText(game.world.centerX, game.world.centerY, 'gameover', 'GAME OVER', 64);
      gameover.anchor.setTo(0.5);
      // Display the form to input your name for the leaderboard
      document.getElementById("name").style.display = "block";
    }








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

    var newPill = this.game.add.group();
    for (var i = 0; i < 2; i++) {
      newPill.create(0 + (i * 16), 0, newPillValue[i]);
    }
    // this.newPill.create(0, 0, newPillValue[0]);
    // this.newPill.create(16, 0, newPillValue[1]);

    // Spawn a new pill
    this.player = this.game.add.group();
    var result = this.findObjectsByType('playerStartLeft', this.map, 'objectsLayer')
    this.player = this.game.add.sprite(result[0].x, result[0].y, newPillValue[0]);
    this.player = this.game.add.sprite(result[0].x + 16, result[0].y, newPillValue[1]);
    this.game.physics.arcade.enable(this.player);

    //Virus spawning
    // var result = this.findObjectsByType('virus', this.map, 'virusLayer')
    // this.player = this.game.add.sprite(result[0].x, result[0].y, 'redVirus');
    // this.game.physics.arcade.enable(this.player);

    // move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

  },

  update: function() {
    this.currentMovementTimer += this.time.elapsed;

    // Too prevent rapid firing
    //   if (currentMovementTimer > movementLag) {
    //     if (pause.isDown) {
    //       managePauseScreen();
    //     }
    //     if (cursors.left.isDown) {
    //       if (canMove(slide, "left")) {
    //         move(slide, slideCenter, "left", 1);
    //       }
    //     } else if (cursors.right.isDown) {
    //       if (canMove(slide, "right")) {
    //         move(slide, slideCenter, "right", 1);
    //       }
    //     } else if (cursors.down.isDown) {
    //       if (canMove(slide, "down")) {
    //         move(slide, slideCenter, "down", 1);
    //       }
    //     } else if (rotates.clockwise.isDown) {
    //       if (canMove(rotate, "clockwise")) {
    //         move(rotate, null, "clockwise", 1);
    //       } else {
    //         console.log('Cannot rotate');
    //       }
    //     } else if (rotates.counterClockwise.isDown) {
    //       if (canMove(rotate, "counterclockwise")) {
    //         move(rotate, null, "counterclockwise", 1);
    //       } else {
    //         console.log('Cannot rotate');
    //       }
    //     }
    //     currentMovementTimer = 0;
    //   }
    // };
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

  // generate an array with a two randomized values
  pillRandomizer: function() {
    var left = ['leftRed', 'leftYellow', 'leftBlue'];
    var right = ['rightRed', 'rightYellow', 'rightBlue'];
    var pill = [];
    pill.push(left[Math.floor(Math.random() * 3)]);
    pill.push(right[Math.floor(Math.random() * 3)]);
    console.log(pill);
    return pill;
  },

  destroy: function(sprite) {
    sprite.destroy();
  },

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
