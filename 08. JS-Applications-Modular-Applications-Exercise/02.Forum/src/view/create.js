import { createTopic } from '../api/data.js';
import { input } from '../common/input.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../util.js';

const createTemplate = (onSubmit, errMsg, errors, values) => html`
<div class="narrow">
    <header>Create New Topic</header>
    <form @submit=${onSubmit}>
        ${errMsg ? html`<p class="error-msg">${errMsg}</p>` : null}
        ${input('Title', 'text', 'title', values.title, errors.title)}
        ${input('Content', 'textarea', 'content', values.content, errors.content)}
        <!-- <label><span>Title</span><input type="text" name="email" .value=${values.title}></label>
        <textarea name="content" .value=${values.content}></textarea> -->
        <div class="center">
            <input class="action" type="submit" value="Create Topic">
        </div>  
        
    </form>
</div>`;

export function createPage(ctx) {
    update();

    function update(errMsg = '', errors = {}, values = {}) {
        ctx.render(createTemplate(createSubmitHandler(onSubmit, 'title', 'content'), errMsg, errors, values));
    }

    async function onSubmit(data) {
        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '');
            if(missing.length > 0) {
                const errors = missing.reduce((a, [k]) => Object.assign(a, { [k]: true}), {});
                throw {
                    error: new Error('All fields are required!'),
                    errors
                };
            }

            const result = await createTopic(data);
            ctx.page.redirect('/topic/' + result._id);

        } catch (err) {
            const message = err.message || err.error.message;
            update(message, err.errors, data);
        }
        
    }
}