game.PlayScreen = me.ScreenObject.extend({

	init: function() {
		this.parent(true);
		this.mask = null;
	},

	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		me.levelDirector.loadLevel("level00");

		if(this.mask === null && false) {
			this.mask = new me.SpriteObject (0, 0, me.loader.getImage("playermask"));
			this.mask.alpha = 0.92;
			me.game.add(this.mask, 10000);
		}
	},

	update: function() {
		if(this.mask !== null) {
			var player = me.game.getEntityByName('player')[0];
			this.mask.pos.x = player.pos.x - (this.mask.width/2) + player.width/2;
			this.mask.pos.y = player.pos.y - (this.mask.height/2) + player.height/2;
		}
		return true;
	},

	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {

	}
});
