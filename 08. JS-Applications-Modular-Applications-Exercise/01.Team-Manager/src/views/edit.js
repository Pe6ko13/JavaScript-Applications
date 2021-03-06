import { editTeam, getTeamById } from '../api/data.js';
import { loaderTemplate } from '../common/loader.js';
import { html, until } from '../library.js';

const editTemplate = (team, onSubmit, errMsg) => html`
<section id="edit">
    <article class="narrow">
        <header class="pad-med">
            <h1>Edit Team</h1>
        </header>
        <form @submit=${onSubmit} id="edit-form" class="main-form pad-large">
            ${errMsg ? html`<div class="error">${errMsg}</div>` : ''}
            <label>Team name: <input type="text" name="name" .value=${team.name}></label>
            <label>Logo URL: <input type="text" name="logoUrl" .value=${team.logoUrl}></label>
            <label>Description: <textarea name="description" .value=${team.description}></textarea></label>
            <input class="action cta" type="submit" value="Save Changes">
        </form>
    </article>
</section>`;

export async function editPage(ctx) {
    ctx.render(until(loadTemplate(), loaderTemplate()));

    async function loadTemplate() {
        const team = await getTeamById(ctx.params.id);
        return editTemplate(team, onSubmit);

        async function onSubmit(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const logoUrl = formData.get('logoUrl');
            const description = formData.get('description');
    
            try {
                if (name == '' || logoUrl == '' || description == '') {
                    throw new Error('All fields are required!');
                }
    
                if (name.length < 4) {
                    throw new Error('Team name must be longer');
                }
    
                if (description.length < 4) {
                    throw new Error('Description must be longer');
                }
    
                await editTeam(ctx.params.id, {name, logoUrl, description});
                e.target.reset();
                ctx.page.redirect(`/details/${team._id}`);
    
            } catch (err) {
                ctx.render(editTemplate(team, onSubmit, err.message));
            }
        }
    }
}