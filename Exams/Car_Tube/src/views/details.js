import { deleteCar, getCarById } from '../api/data.js';
import { html } from '../library.js';
import { getUserData } from '../userdata.js';

const detailsTemplate = (car, onDelete, isOwner) => html`
<section id="listing-details">
    <h1>Details</h1>
    <div class="details-info">
        <img src=${car.imageUrl}>
        <hr>
        <ul class="listing-props">
            <li><span>Brand:</span>${car.brand}</li>
            <li><span>Model:</span>${car.model}</li>
            <li><span>Year:</span>${car.year}</li>
            <li><span>Price:</span>${car.price}$</li>
        </ul>

        <p class="description-para">${car.descriptio}</p>

        ${isOwner 
            ? html`<div class="listings-buttons">
                        <a href="/edit/${car._id}" class="button-list">Edit</a>
                        <a @click=${onDelete} href="javascript:void(0)" class="button-list">Delete</a>
                    </div>` : null}
        
    </div>
</section>`;

export async function detailsPage(ctx) {
    const car = await getCarById(ctx.params.id);
    const user = getUserData();

    const isOwner = user && car._ownerId == user.id;

    ctx.render(detailsTemplate(car, onDelete, isOwner));

    async function onDelete(e) {
        e.preventDefault();
        const choice = confirm('Are you sure?');
        if(choice) {
            await deleteCar(ctx.params.id);
            ctx.page.redirect('/allListings');
        }

        
    }
    
}