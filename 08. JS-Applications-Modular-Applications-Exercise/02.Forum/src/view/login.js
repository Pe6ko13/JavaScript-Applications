import { login } from '../api/data.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../util.js';

const loginTemplate = (onSubmit, errMsg, email) => html`
<div class="narrow center">
    <header>Login</header>
    <form @submit=${onSubmit}>
    ${errMsg ? html`<p class="error-msg">${errMsg}</p>` : null}
        <label><span>Email</span><input type="text" name="email" .value=${email}></label>
        <label><span>Password</span><input type="password" name="password"></label>
        <input class="action" type="submit" value="Log in">
        
    </form>
</div>`;

export function loginPage(ctx) {
    update();

    function update(errMsg = '', email = '') {
        ctx.render(loginTemplate(createSubmitHandler(onSubmit, 'email', 'password'), errMsg, email));
    }

    async function onSubmit(data) {
        try {
            await login(data.email, data.password);
            ctx.updateUserNav();
            ctx.page.redirect('/topics');
        } catch (err) {
            const message = err.message || err.error.message;
            update(message, data.email);
        }
        
    }
}