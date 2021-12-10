import { getRecentRecipes } from '../api/recepies.js';
import { html, until } from '../library.js';
import { spinner } from './common.js';

const homeTemplate = (recipePromise) => html`
<section id="home">
    <div class="hero">
        <h2>Welcome to My Cookbook</h2>
    </div>
    <header class="section-title">Recently added recipes</header>
    <div class="recent-recipes">

       ${until(recipePromise, spinner())}

    </div>
    <footer class="section-title">
        <p>Browse all recipes in the <a href="/catalog">Catalog</a></p>
    </footer>
</section>`;

const recentRecipe = (recipe) => html`
<a class="card" href=${`/details/${recipe.objectId}`} >
    <article class="recent">
        <div class="recent-preview"><img src=${recipe.img}></div>
        <div class="recent-title">${recipe.name}</div>
    </article>
</a>`;

export function homePage(ctx) {
    ctx.render(homeTemplate(loadRecipes()));
}

async function loadRecipes() {
    const { results: recipes } = await getRecentRecipes();

    if (recipes.length == 0) {
        return html`<p>No recipes found!</p>`;
    } else {
        return recipes.reduce((a, c) => {
            if (a.length > 0) {
                a.push(html`<div class="recent-space"></div>`);
            }
            a.push(recentRecipe(c));
            return a;
        }, []);
    }
}