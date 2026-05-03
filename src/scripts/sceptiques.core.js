import './libraries/helpers';
import CSSDoc from './libraries/cssdoc';
import ModalScore from './libraries/modalscore';
import FingerprintJS from '@fingerprintjs/fingerprintjs';


const GAME_URL = 'https://sceptiquesduquebec.com/brick-breaqueer/scripts/brickbreaqueer.core.min.js';
const API_URL  = 'https://script.google.com/macros/s/AKfycbwH5V6n3wWoteG9czsAczmHKWykcDuGX8pqjtM_2uf6n1ykDKI2Os3QrB-A2kgnTNqz/exec';


({

	modalscore: null,
	fingerprint: null,


	init: async function() {
		await this.cleanUrl();
		await this.shuffleBackground();
		await documentReady();
		this.modalscore = new ModalScore();
		this.loadFingerprint();
		this.loadGame();
		this.loadLeaderboard();
	},


	cleanUrl: async function() {
		if (window.location.search.includes('fbclid')) {
			const url = new URL(window.location);
			url.searchParams.delete('fbclid');
			window.history.replaceState({}, document.title, url.pathname + url.search);
		}
	},


	shuffleBackground: async function() {
		const driftTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--drift-time').replace(/s$/gi, ''));
		const delay = 0 - (Math.floor(Math.random() * (driftTime + 1)));
		document.documentElement.style.setProperty('--drift-time-delay', `${delay}s`);
	},


	loadGame: async function() {
		await loadScript(GAME_URL);
		await BrickBreaqueer({
			parent: "game-container",
			fontFamily: "Unbounded",
			fontWeight: 500,
			color: (new CSSDoc)('--color-fg'),
			onLoadComplete: async () => document.querySelector('#game-container').classList.add('loaded'),
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
		header.create('td', null, '#');
		header.create('td', null, 'utilisateur');
		header.create('td', null, 'niveau');
		header.create('td', null, 'score');

		data.topGrouped.forEach((entry, i) => {
			const row = table.create('tr');
			row.create('td', null, i + 1);
			row.create('td', null, entry[2]);
			row.create('td', null, entry[3]);
			row.create('td', null, entry[4].toLocaleString());
		});

		container.classList.add('loaded');
		container.replaceChildren(table);
	},


	getCredentials: async function() {
		return new Promise(res => {
			const username  = localStorage.getItem('username');
			this.modalscore.show(username || '', results => {
				if(results.savescore) localStorage.setItem('username', results.username);
				res(results);
			});
		});
	},


	logScore: async function(stats) {
		await new Promise(resolve => setTimeout(resolve, 1000));
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