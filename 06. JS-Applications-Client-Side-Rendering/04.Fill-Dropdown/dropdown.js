import { html, render} from './node_modules/lit-html/lit-html.js';

const selectTemplete = (items) => html`
<select id="menu">
    ${items.map(i => html`<option value=${i._id}>${i.text}</option>`)}
</select>`;

const root = document.querySelector('div');
document.querySelector('form').addEventListener('click', addItem);

getData();

async function getData() {
    const res = await fetch('http://localhost:3030/jsonstore/advanced/dropdown');
    const data = await res.json();

    update(Object.values(data));
}

function update(items) {
    const test = selectTemplete(items);
    render(test, root);
}

async function addItem(e) {
    e.preventDefault();
    const text = document.getElementById('itemText').value;

    const res = await fetch('http://localhost:3030/jsonstore/advanced/dropdown', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });

    if (res.ok) {
        getData();
    }
}