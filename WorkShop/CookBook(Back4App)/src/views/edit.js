import { getRecipeById, updateRecipe } from '../api/recepies.js';
import { html } from '../library.js';
import { createSubmitHandler } from '../util.js';
import { field } from './common.js';

const editTemplate = (onSubmit, errors, data) => html`
<section id="edit">
    <article>
        <h2>Edit Recipe</h2>
        <form @submit=${onSubmit} id="editForm">
            ${errors ? html`<p class="error">${errors.message}</p>` : null}

            ${field({ label: 'Name', name: 'name', placeholder: 'Recipe name', value: data.name, error: errors.name})}
            ${field({ label: 'Image', name: 'img', placeholder: 'Image URL', value: data.img, error: errors.img})}
            ${field({ label: 'Ingredients', type: 'textarea', name: 'ingredients', placeholder: 'Enter ingredients on separate lines', value: data.ingredients, error: errors.ingredients })}
            ${field({ label: 'Preparation', type: 'textarea', name: 'steps', placeholder: 'Enter preparation on separate lines', value: data.steps, error: errors.steps })}
            <input type="submit" value="Save Changes">
        </form>
    </article>
</section>`;

export async function editPage(ctx) {
    const recipeId = ctx.params.id;
    const recipe = await getRecipeById(recipeId);
    recipe.ingredients = recipe.ingredients.join('\n');
    recipe.steps = recipe.steps.join('\n');

    update();

    function update(errors = {}, data = recipe) {
        ctx.render(editTemplate(createSubmitHandler(onSubmit, 'name', 'img', 'ingredients', 'steps'), errors, data));
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

            const result = await updateRecipe(recipeId, recipe);
            e.target.reset();
            ctx.notify('Recipe Updated!');
            ctx.page.redirect('/details/' + recipeId);

        } catch(err) {
            update(err, data);
        }
       
    }
}