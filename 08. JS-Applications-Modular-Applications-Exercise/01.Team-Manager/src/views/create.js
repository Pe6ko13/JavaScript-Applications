import { createTeam } from '../api/data.js';
import { html } from '../library.js';

const createTemplate = (onSubmit, errMsg) => html`
<section id="create">
    <article class="narrow">
        <header class="pad-med">
            <h1>New Team</h1>
        </header>
        <form @submit=${onSubmit} id="create-form" class="main-form pad-large">
            ${errMsg ? html`<div class="error">${errMsg}</div>` : null}
            <label>Team name: <input type="text" name="name"></label>
            <label>Logo URL: <input type="text" name="logoUrl"></label>
            <label>Description: <textarea name="description"></textarea></label>
            <input class="action cta" type="submit" value="Create Team">
        </form>
    </article>
</section>`;

export async function createPage(ctx) {
    ctx.render(createTemplate(onSubmit));

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

            const team = await createTeam({name, logoUrl, description});
            e.target.reset();
            ctx.page.redirect(`/details/${team._id}`);

        } catch (err) {
            ctx.render(createTemplate(onSubmit, err.message));
        }
    }
}