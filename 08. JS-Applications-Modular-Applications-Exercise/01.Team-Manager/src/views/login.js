import { login } from '../api/api.js';
import { html } from '../library.js';

const loginTemplate = (onSubmit, errMsg) => html`
<section id="login">
    <article class="narrow">
        <header class="pad-med">
            <h1>Login</h1>
        </header>
        <form @submit=${onSubmit} id="login-form" class="main-form pad-large">
            ${errMsg ? html`<div class="error">${errMsg}</div>` : null}
            <label>E-mail: <input type="text" name="email"></label>
            <label>Password: <input type="password" name="password"></label>
            <input class="action cta" type="submit" value="Sign In">
        </form>
        <footer class="pad-small">Don't have an account? <a href="/register" class="invert">Sign up here</a>
        </footer>
    </article>
</section>`;

export async function loginPage(ctx) {
    ctx.render(loginTemplate(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {           
            if (email == '' || password == '') {
                throw new Error('Fields must be filled!');
            }
            
            await login(email, password);
            ctx.setUserNav();
            e.target.reset();
            ctx.page.redirect('/myTeams');
        } catch (err) {
            ctx.render(loginTemplate(onSubmit, err.message));
        }
        
    }
}