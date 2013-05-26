game.PlayScreen = me.ScreenObject.extend({

	init: function() {
		this.parent(true);
		this.mask = null;
		//me.audio.playTrack("bgm");
	},

	prepMask:function() {
		if(this.mask === null) {
			this.mask = new me.SpriteObject (0, 0, me.loader.getImage("playermask"));
			this.mask.alpha = 0.95;
		}
		me.game.add(this.mask, 100);
	},

	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		me.levelDirector.loadLevel("level01");
		this.prepMask();
	},

	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	}
});
