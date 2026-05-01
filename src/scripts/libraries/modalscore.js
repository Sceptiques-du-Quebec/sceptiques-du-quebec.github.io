import Modal from "./modal";


export default class ModalScore extends Modal {

	#clb = null;
	#container = null;


	constructor() {
		super({
			parent: document.querySelector('section.game > div'),
			lock: true,
		});
	}


	show(username, clb) {
		this.#clb = clb;
		this.#container = create('div', 'modalscore__container');

		const title = create('div', 'modalscore__container__title', "Entrez votre nom d'utilisateur:");
		const form = create('div', 'modalscore__container__form');
		const input = form.create('input', null, null, {
			type: "text",
			minlength: 4,
			maxlength: 16,
			value: username,
			placeholder: "4 caractères min.",
		});

		input.addEventListener('input', () => {
			let val = input.value;
			val = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
			val = val.replace(/[^a-zA-Z0-9]/g, "");
			val = val.toUpperCase();
			input.value = val;
		});

		input.addEventListener('keydown', (evt) => {
			if (evt.key === 'Enter') {
				evt.preventDefault();
				evt.stopPropagation();
				this.ok(input);
			}
		});

		const buttons = this.#container.create('div', 'modalscore__container__buttons');
		const btnok = buttons.create('div', 'modalscore__container__buttons__ok');
		const btncancel = buttons.create('div', 'modalscore__container__buttons__cancel');
		btnok.addEventListener('click', () => this.ok(input));
		btncancel.addEventListener('click', () => this.cancel());

		this.#container.replaceChildren(title, form, buttons);
		
		super.show(this.#container);
		setTimeout(() => input.select(), 200);
	}


	ok(input) {
		if(input.value.length < 4) {
			input.style.color = 'red';
			input.focus();
		} else {
			this.hide();
			this.#clb({ savescore: true, username: input.value });
		}
	}


	cancel() {
		this.hide();
		this.#clb({ savescore: false });
	}

}