game.PlayScreen = me.ScreenObject.extend({

	init: function() {
		this.parent(true);
		this.mask = null;
		//me.audio.playTrack("bgm");

		this.font = new me.Font('Arial', 14, "#ffffff");
		me.game.add(this.font, 11);
	},

	setText: function(text) {
		this.text = text;
		this.tw = null;
		this.showTime = me.timer.getTime();
	},

	draw: function(context) {
		if(me.timer.getTime()-1500 < this.showTime) {
			if(!this.tw) {
				this.tw= this.font.measureText(context, this.text);
			}

			var player = me.game.getEntityByName('player')[0];
			this.font.draw(context, this.text, (player.pos.x+player.width/2)-this.tw.width/2, player.pos.y - 20);
		}
	},

	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		me.levelDirector.loadLevel("level00");

		if(this.mask === null) {
			this.mask = new me.SpriteObject (0, 0, me.loader.getImage("playermask"));
			this.mask.alpha = 0.95;
		}
		me.game.add(this.mask, 10);
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
		var player = me.game.getEntityByName('player')[0];
		player.panic = 1;
	}
});
