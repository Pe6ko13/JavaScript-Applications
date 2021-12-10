import { login } from '../api/user.js';
import { html } from '../library.js';
import { createSubmitHandler } from '../util.js';
import { field } from './common.js';

const loginTemplate = (onSubmit, errors, data) => html`
<section id="login">
    <article>
        <h2>Login</h2>
        <form @submit=${onSubmit} id="loginForm">
            ${errors ? html`<p class="error">${errors.message}</p>` : null}
            ${field({label: 'Username', name: 'username', value: data.username, error: errors.username})}
            ${field({label: 'Password', name: 'password', type: 'password', error: errors.password})}
          <input type="submit" value="Login">
        </form>
    </article>
</section>`;

export function loginPage(ctx) {
    update();

    function update(errors = {}, data = {}) {
        ctx.render(loginTemplate(createSubmitHandler(onSubmit, 'username', 'password'), errors, data));
    }

    async function onSubmit({ username, password }, e) {
        try{
            if (username == '' || password == '') {
                throw {
                    message: 'All fields are required!',
                    username: true,
                    password: true
                };
            }
            
            await login(username, password);
            e.target.reset();
            ctx.updateSession();
            ctx.updateUserNav();
            ctx.page.redirect('/catalog');
        } catch(err) {
            update(err, { username });
        }
       
    }
}