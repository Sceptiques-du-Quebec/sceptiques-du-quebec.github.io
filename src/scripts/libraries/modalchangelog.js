import Modal from './modal';
import { marked } from 'marked';

export default class ModalChangelog extends Modal {
    constructor(opts = {}) {
        super({ ...opts, class: 'changelog' });
    }

    async showChangelog() {
        try {
            const res = await fetch('/changelog.md');
            if (!res.ok) throw new Error(res.status);
            const md = await res.text();

            const header = create('div', 'changelog__header');
            header.create('span', 'changelog__header__title', 'Changelog');
            header.create('button', 'changelog__header__close', '✕', { 'aria-label': 'Fermer' })
                .addEventListener('click', () => this.hide());

            const body = create('div', 'changelog__body');
            body.innerHTML = marked.parse(md);

            const container = create('div', 'changelog__container');
            container.append(header, body);

            await this.show(container);
        } catch (e) {
            console.error(e);
            await this.show('<p>Impossible de charger le changelog.</p>');
        }
    }
}
