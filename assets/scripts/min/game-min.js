var drMarioGame=drMarioGame||{};drMarioGame.Game=function(){},console.log("Game state loaded"),drMarioGame.Game.prototype={create:function(){this.map=this.game.add.tilemap("drMarioLevel"),this.map.addTilesetImage("tiles","gameTiles"),this.backgroundLayer=this.map.createLayer("backgroundLayer"),this.blockedLayer=this.map.createLayer("blockedLayer"),this.map.setCollisionBetween(1,2e3,!0,"blockedLayer"),this.backgroundLayer.resizeWorld(),this.createVirus();var e=this.findObjectsByType("playerStart",this.map,"objectsLayer"),t=this.findObjectsByType("playerStartLeft",this.map,"objectsLayer");this.player=this.game.add.sprite(t[0].x,t[0].y,"leftGreen"),this.game.physics.arcade.enable(this.player),this.cursors=this.game.input.keyboard.createCursorKeys()},update:function(){this.game.physics.arcade.collide(this.player,this.blockedLayer),this.game.physics.arcade.collide(this.player,this.virus),this.player.body.velocity.x=0,this.player.body.velocity.y=12,this.cursors.down.isDown?(this.player.body.velocity.y+=100,console.log("down")):this.cursors.left.isDown?(this.player.body.velocity.x-=100,console.log("left")):this.cursors.right.isDown&&(this.player.body.velocity.x+=100,console.log("right"))},findObjectsByType:function(e,t,i){var r=new Array;return t.objects[i].forEach(function(i){i.type===e&&(i.y-=t.tileHeight,r.push(i))}),r},createFromTiledObject:function(e,t){var i=t.create(e.x,e.y,e.properties.sprite);Object.keys(e.properties).forEach(function(t){i[t]=e.properties[t]})},createVirus:function(){this.virus=this.game.add.group(),this.virus.enableBody=!0,result=this.findObjectsByType("virus",this.map,"virusLayer"),result.forEach(function(e){this.createFromTiledObject(e,this.virus)},this)},newPill:function(){}};