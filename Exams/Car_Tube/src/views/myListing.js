import { getUserCars } from '../api/data.js';
import { html } from '../library.js';
import { getUserData } from '../userdata.js';
import { carTemplate } from './common.js';

const myCarsTemplate = (cars) => html`
<section id="my-listings">
    <h1>My car listings</h1>
    <div class="listings">
        ${cars.length == 0
            ? html`<p class="no-cars"> You haven't listed any cars yet.</p>`
            : cars.map(carTemplate)}
    </div>
</section>`;

export async function myListingsPage(ctx) {
    const user = getUserData();
    const cars = await getUserCars(user.id);
    ctx.render(myCarsTemplate(cars));
}