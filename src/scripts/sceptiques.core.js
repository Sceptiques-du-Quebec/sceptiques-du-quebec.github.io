import './libraries/helpers';
import CSSDoc from './libraries/cssdoc';
import ModalScore from './libraries/modalscore';
import FingerprintJS from '@fingerprintjs/fingerprintjs';



const GAME_URL = 'https://sceptiques-du-quebec.github.io/brick-breaqueer/scripts/brickbreaqueer.core.min.js';
const API_URL  = 'https://script.google.com/macros/s/AKfycbwsBRwf-wCg1PL6P8m0llrXB4OKlEqdmAE0wZdtruBBoFZB_UWnr-Z-9VaGP1SCEtlG/exec';


({

	modalscore: null,
	fingerprint: null,


	init: async function() {
		await documentReady();
		this.modalscore = new ModalScore();
		this.loadFingerprint();
		this.loadGame();
		this.loadLeaderboard();
	},


	loadGame: async function() {
		await loadScript(GAME_URL);
		document.querySelector('#game-container').classList.add('loaded');
		BrickBreaqueer({
			parent: "game-container",
			width: 800,
			height: 600,
			fontFamily: "Unbounded",
			fontWeight: 500,
			color: (new CSSDoc)('--color-fg'),
			onGameOver: async stats => await this.logScore(stats)
		});
	},


	loadFingerprint: async function() {
		const fp = await FingerprintJS.load();
		this.fingerprint = (await fp.get()).visitorId;
	},


	loadLeaderboard: async function(data) {
		data = data || await this.getLeaderboard();
		
		const container = document.querySelector('.leaderboard > div > div');
		
		const table = create('table');
		const header = table.create('tr');
		header.create('td', null, 'utilisateur');
		header.create('td', null, 'niveau');
		header.create('td', null, 'score');

		data.topGrouped.forEach(entry => {
			const row = table.create('tr');
			row.create('td', null, entry[2]);
			row.create('td', null, entry[3]);
			row.create('td', null, entry[4]);
		});

		container.classList.add('loaded');
		container.replaceChildren(table);
	},


	getCredentials: async function() {
		return new Promise(res => {
			const savescore = sessionStorage.getItem('savescore');
			const username  = sessionStorage.getItem('username');
			if(savescore == 'no') res({ savescore: false });
			else if(savescore == 'yes' && username) res({ savescore: true, username: username });
			else {
				this.modalscore.show(results => {
					if(results.savescore) {
						sessionStorage.setItem('savescore', 'yes');
						sessionStorage.setItem('username', results.username);
					} else {
						sessionStorage.setItem('savescore', 'no');
					}
					res(results);
				});
			}
		});
	},


	logScore: async function(stats) {
		const creds = await this.getCredentials();
		if(creds.savescore) {
			this.saveScore({
				fingerprint: this.fingerprint,
				username: creds.username,
				level: stats.levelReached,
				score: stats.score,
				hash: md5(`${this.fingerprint}:${creds.username}:${stats.levelReached}:${stats.score}`)
			});
		}
	},


	saveScore: async function (entry) {
		try {
			const results = await fetch(API_URL, { method: 'POST', body: JSON.stringify(entry) });
			const data = await results.json();
			if(data.status == 'success') {
				this.loadLeaderboard(data.leaderboard);
			} else {
				console.error(data.message);
				return false;
			}
		} catch (e) {
			console.error(e);
			return false;
		}
	},


	getLeaderboard: async function() {
		try {
			const results = await fetch(API_URL);
			const data = await results.json();
			return data;
		} catch (e) {
			console.error(e);
			return false;
		}
	}


}).init();