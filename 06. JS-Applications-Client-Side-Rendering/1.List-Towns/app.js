import { html, render } from './node_modules/lit-html/lit-html.js';

const listTemplate = (towns) => html`
    <ul>
        ${towns.map(t => html`<li>${t}</li>`)}
    </ul>`;
    
const root = document.getElementById('root');
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const towns = document.getElementById('towns').value.split(',').map(t => t.trim());

    const result = listTemplate(towns);
    render(result, root);
});

