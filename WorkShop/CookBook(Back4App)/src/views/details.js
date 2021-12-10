import { deleteRecipe, getRecipeById } from '../api/recepies.js';
import { html } from '../lib/lit-html.js';
import { until } from '../library.js';
import { commentsView } from './comments.js';
import { spinner } from './common.js';

const detailsTemplate = (recipePromise, isOwner, onDelete) => html`
<section id="details">
    ${until(recipePromise, spinner())}

    <div id="comments-container"></div>
</section>`;

const recipeCard = (recipe, isOwner, onDelete) => html`
<article>
    <h2>${recipe.name}</h2>
    <div class="band">
        <div class="thumb"><img src=${recipe.img}></div>
        <div class="ingredients">
            <h3>Ingredients:</h3>
            <ul>
                ${recipe.ingredients.map(i => html`<li>${i}</li>`)}
            </ul>
        </div>
    </div>
    <div class="description">
        <h3>Preparation:</h3>
        ${recipe.steps.map(s => html`<p>${s}</p>`)}
    </div>

    ${isOwner
        ? html`<div class="controls">
                    <a class="actionLink" href=${'/edit/' + recipe.objectId}>\u270E Edit</a>
                    <a class="actionLink" href="javascript:void(0)" @click=${onDelete}>\u2716 Delete</a>
                </div>`
        : null}
</article>`;

export function detailsPage(ctx) {
    ctx.render(detailsTemplate(loadRecipe(ctx)));
    commentsView(ctx, ctx.params.id);
}

async function loadRecipe(ctx) {
    const recipe = await getRecipeById(ctx.params.id);
    const isOwner = ctx.user && ctx.user.id == recipe.owner.objectId;

    return recipeCard(recipe, isOwner, onDelete);

    async function onDelete(e) {
        const choice = confirm('Are You Sure You want to delete this recipe?');
        if (choice) {
            await deleteRecipe(ctx.params.id);
            ctx.notify('Recipe deleted');
            ctx.page.redirect('/catalog');
        }
    }
}