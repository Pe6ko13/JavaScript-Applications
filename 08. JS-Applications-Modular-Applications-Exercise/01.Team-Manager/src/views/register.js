import { register } from '../api/api.js';
import { html } from '../library.js';


const registerTemplate = (onSubmit, errMsg) => html`
<section id="register">
    <article class="narrow">
        <header class="pad-med">
            <h1>Register</h1>
        </header>
        <form @submit=${onSubmit} id="register-form" class="main-form pad-large">
            ${errMsg ? html`<div class="error">${errMsg}</div>` : null}
            <label>E-mail: <input type="text" name="email"></label>
            <label>Username: <input type="text" name="username"></label>
            <label>Password: <input type="password" name="password"></label>
            <label>Repeat: <input type="password" name="repass"></label>
            <input class="action cta" type="submit" value="Create Account">
        </form>
        <footer class="pad-small">Already have an account? <a href="/login" class="invert">Sign in here</a>
        </footer>
    </article>
</section>`;

export function registerPage(ctx) {
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const username = formData.get('username').trim();
        const password = formData.get('password').trim();
        const repass = formData.get('repass').trim();

        try {
            if (email == '', username == '', password == '', repass == '') {
                throw new Error('All fields are required!');
            }
    
            if (password != repass) {
                throw new Error('Passwords don\'t match!');
            }

            if (username.length < 3) {
                throw new Error('Username must be longer');
            }

            if (password.length < 3) {
                throw new Error('Password must be longer');
            }
            
            await register(email, username, password);
            e.target.reset();
            ctx.setUserNav();
            ctx.page.redirect('/myTeams');
        } catch (err) {
            ctx.render(registerTemplate(onSubmit, err.message));
        }
    }
}