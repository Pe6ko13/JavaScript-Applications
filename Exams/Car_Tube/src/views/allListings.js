import { getAllCars } from '../api/data.js';
import { html } from '../library.js';
import { carTemplate } from './common.js';

const allListingsTEmplate = (cars) => html`
<section id="car-listings">
    <h1>Car Listings</h1>
    <div class="listings">
        <!-- Display all records or nothing-->
        ${cars.length == 0
            ? html`<p class="no-cars">No cars in database.</p>`
            : cars.map(carTemplate)}    
    </div>
</section>`;

export async function allListingsPage(ctx) {
    const cars = await getAllCars();
    ctx.render(allListingsTEmplate(cars));
}


// Page ${page} / ${pages}
// ${page > 1 ? html`<a class="button-list" href="/allListings?page=${page -1}">&lt; Prev</a>` : ''}
// ${page < pages ? html`<a class="button-list" href="/allListings?page=${page + 1}">Next &gt;</a>` : ''}


// export async function allListingsPage(ctx) {
//     const page = Number(ctx.querystring.split('=')[1]) || 1;

//     const count = await getCollectionSize();
//     const pages = Math.ceil(count / 3);
//     const cars = await getAllCars(page);

//     ctx.render(allListingsTEmplate(cars, page, pages));
// }