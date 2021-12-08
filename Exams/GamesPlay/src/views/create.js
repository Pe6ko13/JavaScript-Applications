import { createGame } from '../api/data.js';
import { html } from '../library.js';

const createTemplate = (onSubmit) => html`
<section id="create-page" class="auth">
    <form @submit=${onSubmit} id="create">
        <div class="container">

            <h1>Create Game</h1>
            <label for="leg-title">Legendary title:</label>
            <input type="text" id="title" name="title" placeholder="Enter game title...">

            <label for="category">Category:</label>
            <input type="text" id="category" name="category" placeholder="Enter game category...">

            <label for="levels">MaxLevel:</label>
            <input type="text" id="maxLevel" name="maxLevel" min="1" placeholder="1">

            <label for="game-img">Image:</label>
            <input type="text" id="imageUrl" name="imageUrl" placeholder="Upload a photo...">

            <label for="summary">Summary:</label>
            <textarea name="summary" id="summary"></textarea>
            <input class="btn submit" type="submit" value="Create Game">
        </div>
    </form>
</section>`;

export async function createPage(ctx) {
    ctx.render(createTemplate(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const game = {
            title: formData.get('title').trim(),
            category: formData.get('category').trim(),
            maxLevel: (formData.get('maxLevel').trim()),
            imageUrl: formData.get('imageUrl').trim(),
            summary: formData.get('summary').trim()
        };

        if(Object.values(game).some(g => !g)) {
            return alert('All fields are required!');
        }

        // if(game.maxLevel <= 0) {
        //     return alert('Level must be a positive number');
        // }

        await createGame(game);
        e.target.reset();
        ctx.page.redirect('/');
    }
}