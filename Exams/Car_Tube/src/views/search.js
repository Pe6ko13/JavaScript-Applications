import { getCarsByYear } from '../api/data.js';
import { html } from '../library.js';
import { carTemplate } from './common.js';

const searchTemplate = (onClick, onChange, cars = '') => html`
<section id="search-cars">
    <h1>Filter by year</h1>

    <div class="container">
        <input @change=${onChange} id="search-input" type="text" name="search" placeholder="Enter desired production year">
        <button @click=${onClick} class="button-list">Search</button>
    </div>

    <h2>Results:</h2>
    <div class="listings">
        ${cars.length == 0
            ? html`<p class="no-cars"> No results.</p>`
            : cars.map(carTemplate)}
    </div>
</section>`;

export async function searchPage(ctx) {
    let currSearch = '';
    

    const onChange = (e) => {
        currSearch = e.target.value;
    };

    async function onClick(e) {
        e.preventDefault();
        let year = Number(currSearch);
        const cars = await getCarsByYear(year);
        ctx.render(searchTemplate(onChange, onClick, cars));
    }

    ctx.render(searchTemplate(onClick, onChange));
}

// export async function searchPage(ctx) {
//     const year = Number(ctx.querystring.split('=')[1]);
//     const cars = Number.isNaN(year) ? [] : await getCarsByYear(year);

//     ctx.render(searchTemplate(cars, onClick, year));

//     function onClick() {
//         const year = Number(document.getElementById('search-input').value);
//         if(Number.isNaN(year) == false) {
//             ctx.page.redirect('/search?query=' + year);
//         } else {
//             alert('Year must be a positive number');
//         }
//     }
// }

// <input .value=${year || ''}></input>