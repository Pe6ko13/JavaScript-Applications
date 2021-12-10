import { register } from '../api/user.js';
import { html } from '../library.js';
import { createSubmitHandler } from '../util.js';
import { field } from './common.js';

const registerTemplate = (onSubmit, errors, data) => html`
<section id="register">
    <article>
        <h2>Register</h2>
        <form @submit=${onSubmit} id="registerForm">
            ${errors ? html`<p class="error">${errors.message}</p>` : null}
            ${field({label: 'Username', name: 'username', value: data.username, error: errors.username})}
            ${field({label: 'E-mail', name: 'email', value: data.email, error: errors.email})}
            ${field({label: 'Password', name: 'password', type: 'password', value: data.password, error: errors.password})}
            ${field({label: 'Repeat', name: 'repass', type: 'password', value: data.repass, error: errors.repass})}

            <input type="submit" value="Register">
        </form>
    </article>
</section>`;

export function registerPage(ctx) {
    update();

    function update(errors = {}, data = {}) {
        ctx.render(registerTemplate(createSubmitHandler(onSubmit, 'username', 'email', 'password', 'repass'), errors, data));
    }

    async function onSubmit(data, e) {
        try{
            const missing = Object.entries(data).filter(([k, v]) => v == '');

            if (missing.length > 0) {
                throw missing.reduce((a, [k]) => Object.assign(a, { [k]: true}), {message: 'All fields are required!'});
            }

            if (data.password != data.repass) {
                throw {
                    message: 'Passwords don\'t match!',
                    password: true,
                    repass: true
                };
            }
            
            await register(data.username, data.email, data.password);
            e.target.reset();
            ctx.updateSession();
            ctx.updateUserNav();
            ctx.page.redirect('/catalog');
        } catch(err) {
            if (err.code == 202) {
                err.username = true;
            } else if (err.code == 203) {
                err.email = true;
            }
            update(err, { username: data.username, email: data.email });
        }
       
    }
} 