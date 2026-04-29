import './libraries/helpers';








({


	init: async function() {
		console.log("patate");
		await loadScript(new URL('https://sceptiques-du-quebec.github.io/brick-breaqueer/scripts/brickbreaqueer.core.min.js', window.location).href);

		BrickBreaqueer({
			parent: "game-container",
			width: 800,
			height: 600,
			fontFamily: "Unbounded",
			fontWeight: 500,
			color: '#161616',
			onGameOver: async (stats) => {
				console.log("Stats de fin de partie :", stats);
				return new Promise((resolve) => {
					setTimeout(() => {
						console.log("Modal fermé");
						resolve();
					}, 2000);
				});
			}
		});


	}

}).init();