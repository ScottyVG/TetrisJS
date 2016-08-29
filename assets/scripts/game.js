var drMarioGame = drMarioGame || {};

//title screen
drMarioGame.Game = function() {};

drMarioGame.Game.prototype = {
  create: function() {
    this.map = this.game.add.tilemap('drMarioLevel');
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tiles', 'gameTiles');

    //create layer
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    // TODO: FIGURE OUT WHERE THE CODE IS BREAKING!!!
    // TODO: CODE BREAKS BELOW THIS LINE

    this.createVirus();
    this.createPills();

    //create pill
    // TODO: have the game create a random pill color combo
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'playerStart');
    this.player = this.game.add.sprite('playerStart');
    this.game.physics.arcade.enable(this.player);


    // move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

  },

  createVirus: function() {
    //   create virus's
    this.virus = this.game.add.group();
    this.virus.enableBody = true;
    var item;
    result = this.findObjectsByType('virus', this.map, 'objectsLayer');
    result.forEach(function(element) {
      this.createFromTiledObject(element, this.virus);
    }, this);
  },
  createPills: function() {
    // create pills
    this.pills = this.game.add.group();
    this.pills.enableBody = true;
    result = this.findObjectsByType('pill', this.map, 'objectsLayer');

    result.forEach(function(element) {
      this.createFromTiledObject(element, this.pills);
    }, this);
  },

  // find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element) {
      if (element.properties.type === type) {
        // Phaser uses top left, Tiled bottom left so we have to adjust
        // also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        // so they might not be placed in the exact position as in Tiled
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

  update: function() {
    //collision
    // this.game.physics.arcade.collide(this.player, this.blockedLayer, this.pills, this.virus);
    // this.game.physics.arcade.overlap(this.player, null, this);

    //player movement
    this.player.body.velocity.x = 0;

    if (this.cursors.up.isDown) {
      if (this.player.body.velocity.y == 0)
        this.player.body.velocity.y -= 50;
    } else if (this.cursors.down.isDown) {
      if (this.player.body.velocity.y == 0)
        this.player.body.velocity.y += 50;
    } else {
      this.player.body.velocity.y = 0;
    }
    if (this.cursors.left.isDown) {
      this.player.body.velocity.x -= 50;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x += 50;
    }
  },
};
