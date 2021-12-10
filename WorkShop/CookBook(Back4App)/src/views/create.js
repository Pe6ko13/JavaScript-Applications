import { createRecipe } from '../api/recepies.js';
import { html } from '../library.js';
import { createSubmitHandler } from '../util.js';
import { field } from './common.js';

const createTemplate = (onSubmit, errors, data) => html`
<section id="create">
    <article>
        <h2>New Recipe</h2>
        <form @submit=${onSubmit} id="createForm">
            ${errors ? html`<p class="error">${errors.message}</p>` : null}

            ${field({ label: 'Name', name: 'name', placeholder: 'Recipe name', value: data.name, error: errors.name})}
            ${field({ label: 'Image', name: 'img', placeholder: 'Image URL', value: data.img, error: errors.img})}
            ${field({ label: 'Ingredients', type: 'textarea', name: 'ingredients', placeholder: 'Enter ingredients on separate lines', value: data.ingredients, error: errors.ingredients })}
            ${field({ label: 'Preparation', type: 'textarea', name: 'steps', placeholder: 'Enter preparation on separate lines', value: data.steps, error: errors.steps })}
            <input type="submit" value="Create Recipe">
        </form>
    </article>
</section>`;

export function createPage(ctx) {
    update();

    function update(errors = {}, data = {}) {
        ctx.render(createTemplate(createSubmitHandler(onSubmit, 'name', 'img', 'ingredients', 'steps'), errors, data));
    }

    async function onSubmit(data, e) {
        try{
            const missing = Object.entries(data).filter(([k, v]) => v == '');

            if (missing.length > 0) {
                throw missing.reduce((a, [k]) => Object.assign(a, { [k]: true}), {message: 'All fields are required!'});
            }

            const recipe = {
                name: data.name,
                img: data.img,
                ingredients: data.ingredients.split('\n').filter(r => r != ''),
                steps: data.steps.split('\n').filter(r => r != '')
            };

            const result = await createRecipe(recipe);
            e.target.reset();
            ctx.page.redirect('/details/' + result.objectId);

        } catch(err) {
            update(err, data);
        }
       
    }
}