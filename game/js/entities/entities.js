game.PlayerEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {
		settings.spritewidth = 22;
		settings.spriteheight = 34;

		// call the constructor
		this.parent(x, y, settings);

		this.renderable.addAnimation('walk', [0,1,2]);
		this.renderable.addAnimation('excited', [3]);
		this.renderable.addAnimation('still', [4]);

		this.renderable.setCurrentAnimation('walk');

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(3, 15);

		// adjust the bounding box
		//this.updateColRect(6, 20, -1, 0);

		this.setFriction(0.2, 0);

		this.maxVel.x = 4;
		this.panic = 1;

		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		me.state.current().prepMask();
	},

	update: function() {
		if( this.panic > 6 && this.alive) {
			this.alive = false;
			me.levelDirector.reloadLevel(true);
			return;
		}

		var mask = me.state.current().mask;
		if(mask !== null) {
			var player = me.game.getEntityByName('player')[0];
			mask.pos.x = player.pos.x - (mask.width/2) + player.width/2;
			mask.pos.y = player.pos.y - (mask.height/2) + player.height/2;
		}


		if (me.input.isKeyPressed('left')) {
			// flip the sprite on horizontal axis
			this.flipX(false);
			// update the entity velocity
			this.vel.x -= this.accel.x * me.timer.tick;
		} else if (me.input.isKeyPressed('right')) {
			// unflip the sprite
			this.flipX(true);
			// update the entity velocity
			this.vel.x += this.accel.x * me.timer.tick;
		} else {
		//	this.vel.x = 0;
		}
		if (me.input.isKeyPressed('jump')) {
			// make sure we are not already jumping or falling
			if (!this.jumping && !this.falling) {
				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.vel.y = -this.maxVel.y * me.timer.tick;
				// set the jumping flag
				this.jumping = true;
			}

		}

		if(this.vel.x === 0) {
			if(this.panic < 2) {
				this.renderable.setCurrentAnimation('still');
			} else {
				this.renderable.setCurrentAnimation('excited');
			}
		} else {
			this.renderable.setCurrentAnimation('walk');
		}

		if(this.panic > 1) {
			this.panic -= 0.01;
		}

		// check & update player movement
		this.updateMovement();

		// check for collision
		var res = me.game.collide(this);

		if (res) {
			// if we collide with an enemy
			if (res.obj.type == me.game.ENEMY_OBJECT || res.obj.type == game.SpikeEntity.TYPE) {
				this.falling = false;
				this.vel.y = -this.maxVel.y * me.timer.tick;
				this.vel.x = (-this.maxVel.x * me.timer.tick) * (res.x > 0 ? 1:-1);
				// set the jumping flag
				this.jumping = true;
				this.renderable.flicker(45);

				if(this.panic < 10) {
					this.panic += 3;
				}
				me.game.viewport.shake(40, 500, me.game.viewport.AXIS.BOTH);
			}
		}

		if(!me.game.viewport.shaking) {
			var enemyEntitys = me.game.getEntityByName('EnemyEntity');
			for(var c = 0; c < enemyEntitys.length; c++) {
				var dist = this.distanceTo(enemyEntitys[c]);

				if(dist < 200 ) {
					me.game.viewport.shake(4*this.panic, 5, me.game.viewport.AXIS.BOTH);
				}
				//console.log("fark!");
				//console.log(dist);
			}
		}

		// update animation if necessary
		if (this.vel.x !== 0 || this.vel.y !== 0) {
			// update object animation
			this.parent();
			return true;
		}

		// else inform the engine we did not perform
		// any update (e.g. position, animation)
		return false;
	}

});

game.TextEntity = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.text = settings.text;
		this.once = settings.once;
		this.shown = false;

		// make it collidable
		this.collidable = true;

		this.font = new me.Font('Arial', 14, "#ffffff");
		me.game.add(this.font, 11);
	},
	onCollision : function() {
		if(!this.once || (this.once && !this.shown) ) {
			this.setText(this.text);
			this.shown = true;
			this.allowDraw = true;
			if(me.state.current().currentText && me.state.current().currentText !== this ) {
				me.state.current().currentText.allowDraw = false;
			}
			me.state.current().currentText = this;
		}
	},
	onDestroyEvent:function() {
		this.shown = false;
	},
	setText: function(text) {
		this.text = text;
		this.tw = null;
		this.showTime = me.timer.getTime();
	},
	draw: function(context) {
		if(me.timer.getTime()-1500 < this.showTime && this.allowDraw === true) {
			if(!this.tw) {
				this.tw= this.font.measureText(context, this.text);
			}

			var player = me.game.getEntityByName('player')[0];
			this.font.draw(context, this.text, (player.pos.x+player.width/2)-this.tw.width/2, player.pos.y - 20);
		}
	}
});

game.SpikeEntity = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		// define this here instead of tiled
		settings.image = "spike_big";
		settings.spritewidth = 44;
		settings.spriteheight = 32;

		// call the parent constructor
		this.parent(x, y, settings);

		// make it collidable
		this.collidable = true;
		this.updateColRect(2, 40, 2, 30);

		// make it a enemy object
		this.type = me.game.ENEMY_OBJECT;

	}
});
game.SpikeEntity.TYPE = "spike";

game.EnemyEntity = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		// define this here instead of tiled
		settings.image = "rot_big";
		settings.spritewidth = 36;
		settings.spriteheight = 36;
		this.still = settings.still;

		// call the parent constructor
		this.parent(x, y, settings);

		this.startX = x;
		this.endX = x + settings.width - settings.spritewidth;
		// size of sprite

		// make him start from the right
		this.pos.x = x + settings.width - settings.spritewidth;
		this.walkLeft = false;

		// walking & jumping speed
		this.setVelocity(2, 6);

		this.flipX(true);

		// make it collidable
		this.collidable = true;
		// make it a enemy object
		this.type = me.game.ENEMY_OBJECT;

		this.lastHiss = me.timer.getTime();

	},

	// call by the engine when colliding with another object
	// obj parameter corresponds to the other object (typically the player) touching this one
	onCollision: function(res, obj) {

		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		if (this.alive && (res.y > 0) && obj.falling) {
			this.renderable.flicker(45);
		}
	},

	// manage the enemy movement
	update: function() {
		var _self = this;
		// do nothing if not in viewport
		if (!this.inViewport)
			return false;

		if (this.alive  && !this.still) {
			if (this.walkLeft && this.pos.x <= this.startX) {
				this.walkLeft = false;
			} else if (!this.walkLeft && this.pos.x >= this.endX) {
				this.walkLeft = true;
			}
			// make it walk
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

		} else {
			this.vel.x = 0;
		}

		var player = me.game.getEntityByName('player')[0];
		if(player && this.distanceTo(player) < 150 && me.timer.getTime()-4000 > this.lastHiss ) {
			this.lastHiss = me.timer.getTime();
			me.audio.play("hiss0" + Math.ceil(Math.random() * 3));
		}

		// check and update movement
		this.updateMovement();

		// update animation if necessary
		if (this.vel.x !== 0 || this.vel.y !== 0) {
			// update object animation
			this.parent();
			return true;
		}
		return false;
	}
});