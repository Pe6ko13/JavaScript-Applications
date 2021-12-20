import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';
import { getUserData } from './util.js';
import { homePage } from './views/home.js';
import { browsePage } from './views/browse.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { logout } from './api/api.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { myPage } from './views/myTeams.js';


const root = document.querySelector('main');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', homePage);
page('/teams', browsePage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/myTeams', myPage);

setUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.setUserNav = setUserNav;
    next();
}

function setUserNav() {
    const user = getUserData();
    if (user) {
        [...document.querySelectorAll('nav > a.user')].forEach(a => a.style.display = 'block');
        [...document.querySelectorAll('nav > a.guest')].forEach(a => a.style.display = 'none');
    } else {
        [...document.querySelectorAll('nav > a.user')].forEach(a => a.style.display = 'none');
        [...document.querySelectorAll('nav > a.guest')].forEach(a => a.style.display = 'block');
    }
}

async function onLogout(e) {
    e.preventDefault();
    await logout();
    setUserNav();
    page.redirect('/');
}