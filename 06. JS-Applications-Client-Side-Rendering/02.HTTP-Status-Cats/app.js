import { html, render } from './node_modules/lit-html/lit-html.js';
import { cats } from './catSeeder.js';

const catCard = (cat) => html`
<li>
    <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
    <div class="info">
        <button @click=${() => toggleInfo(cat)} class="showBtn">${cat.info ? 'Hide status code' : 'Show status code'}</button>
        ${cat.info ? html`<div class="status" id="${cat.id}">
            <h4>Status Code: ${cat.statusCode}</h4>
            <p>${cat.statusMessage}</p>
        </div>` : null}
    </div>
</li>`;

const root = document.getElementById('allCats');
cats.forEach(c => c.info = false);
update();

function update() {
    render(html`<ul>${cats.map(catCard)}</ul>`, root);
}

function toggleInfo(cat) {
    cat.info = !cat.info;
    update();
}

// root.addEventListener('click', (e) => {
//     if(e.target.tagName == 'BUTTON') {
//         const elem = e.target.parentNode.querySelector('.status');
//         if(elem.style.display == 'none'){
//             elem.style.display = 'block';
//             e.target.textContent = 'Hide status code';
//         } else {
//             elem.style.display = 'none';
//             e.target.textContent = 'Hide status code';

//         }
//     }
// });