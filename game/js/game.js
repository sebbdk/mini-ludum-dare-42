
/* Game namespace */
var game = {
	// Run on page load.
	"onload" : function () {
		// Initialize the video.
		if (!me.video.init("screen", 640, 480, true, 'auto')) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}

		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}

		// Initialize the audio.
		//me.audio.init("mp3,ogg");
		me.audio.init("ogg");

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);

		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);

		//me.debug.renderHitBox = true;
		//me.debug.displayFPS = true;
	},



	// Run on game resources loaded.
	"loaded" : function () {
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());

		// add our player entity in the entity pool
		me.entityPool.add("player", game.PlayerEntity);
		me.entityPool.add("EnemyEntity", game.EnemyEntity);
		me.entityPool.add("SpikeEntity", game.SpikeEntity);

		// enable the keyboard
		me.input.bindKey(me.input.KEY.A,  "left");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.W,     "jump", true);

		// Start the game.
		me.state.change(me.state.PLAY);
	}
};
