import { register } from '../api/data.js';
import { input } from '../common/input.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../util.js';

const registerTemplate = (onSubmit, errMsg, errors, values) => html`
<div class="narrow center">
    <header>Register</header>
    <form @submit=${onSubmit}>
    ${errMsg ? html`<p class="error-msg">${errMsg}</p>` : null}
        ${input('Email', 'text', 'email', values.email, errors.email)}
        ${input('Userame', 'text', 'username', values.username, errors.username)}
        ${input('Password', 'password', 'password', values.password, errors.password)}
        ${input('Repeat', 'password', 'repass', values.repass, errors.repass)}
        <!-- <label><span>Email</span><input type="text" name="email" .value=${values.email}></label>
        <label><span>Display Name</span><input type="text" name="username" .value=${values.username}></label>
        <label><span>Password</span><input type="password" name="password" .value=${values.password}></label>
        <label><span>Repeat</span><input type="password" name="repass" .value=${values.repass}></label> -->
        <input class="action" type="submit" value="Sign Up"> 
    </form>
</div>`;

export function registerPage(ctx) {
    update();

    function update(errMsg, errors = {}, values = {}) {
        ctx.render(registerTemplate(createSubmitHandler(
            onSubmit,
            'email', 
            'username', 
            'password', 
            'repass'
        ), errMsg, errors, values));
    }
    
    async function onSubmit(data, e) {
        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '');
            if(missing.length > 0) {
                const errors = missing.reduce((a, [k]) => Object.assign(a, { [k]: true}), {});
                throw {
                    error: new Error('All fields are required!'),
                    errors
                };
            }

            if (data.password != data.repass) {
                throw {
                    error: new Error('Passwords do not match!'),
                    errors: {
                        password: true,
                        repass: true
                    }
                };
            }

            await register(data.email, data.username, data.password);
            e.target.reset();
            ctx.updateUserNav();
            ctx.page.redirect('/topics');

        }catch (err) {
            const message = err.message || err.error.message;
            update(message, err.errors, data);
        }
    }
    
}