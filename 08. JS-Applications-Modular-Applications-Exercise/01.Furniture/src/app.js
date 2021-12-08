import { render, page } from './lib.js';
import { catalogPage } from './catalog.js';
import { createPage } from './create.js';
import { detailsPage } from './details.js';
import { editPage } from './edit.js';
import { loginPage } from './login.js';
import { registerPage } from './register.js';
import { logout } from './api/data.js';
import { getUserData } from './util.js';

const root = document.querySelector('div.container');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', catalogPage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/my-furniture', catalogPage);

updateUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;
    next();
}

function updateUserNav() {
    const userData = getUserData();
    if (userData) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}

async function onLogout() {
    await logout();
    updateUserNav();
    page.redirect('/');
}