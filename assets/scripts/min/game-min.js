var drMarioGame=drMarioGame||{};drMarioGame.Game=function(){},drMarioGame.Game.prototype={create:function(){this.map=this.game.add.tilemap("drMarioLevel"),this.map.addTilesetImage("tiles","gameTiles"),this.backgroundlayer=this.map.createLayer("backgroundLayer"),this.blockedLayer=this.map.createLayer("blockedLayer"),this.map.setCollisionBetween(1,2e3,!0,"blockedLayer"),this.backgroundlayer.resizeWorld(),this.createVirus(),this.createPills();var e=this.findObjectsByType("playerStart",this.map,"objectsLayer");this.player=this.game.add.sprite(e[0].x,e[0].y,"playerStart"),this.player=this.game.add.sprite("playerStart"),this.game.physics.arcade.enable(this.player),this.cursors=this.game.input.keyboard.createCursorKeys()},createVirus:function(){this.virus=this.game.add.group(),this.virus.enableBody=!0;var e;result=this.findObjectsByType("virus",this.map,"objectsLayer"),result.forEach(function(e){this.createFromTiledObject(e,this.virus)},this)},createPills:function(){this.pills=this.game.add.group(),this.pills.enableBody=!0,result=this.findObjectsByType("pill",this.map,"objectsLayer"),result.forEach(function(e){this.createFromTiledObject(e,this.pills)},this)},findObjectsByType:function(e,t,i){var r=new Array;return t.objects[i].forEach(function(i){i.properties.type===e&&(i.y-=t.tileHeight,r.push(i))}),r},createFromTiledObject:function(e,t){var i=t.create(e.x,e.y,e.properties.sprite);Object.keys(e.properties).forEach(function(t){i[t]=e.properties[t]})},update:function(){this.player.body.velocity.x=0,this.cursors.up.isDown?0==this.player.body.velocity.y&&(this.player.body.velocity.y-=50):this.cursors.down.isDown?0==this.player.body.velocity.y&&(this.player.body.velocity.y+=50):this.player.body.velocity.y=0,this.cursors.left.isDown?this.player.body.velocity.x-=50:this.cursors.right.isDown&&(this.player.body.velocity.x+=50)}};