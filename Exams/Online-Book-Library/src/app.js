import { logout } from './api/api.js';
import { page, render } from './lib.js';
import { getUserData } from './util.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { myBooksPage } from './views/my-books.js';
import { registerPage } from './views/register.js';
import { searchPage } from './views/search.js';

const root = document.getElementById('site-content');

page(decorateContext);
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/createBook', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/my-books', myBooksPage);
page('/search', searchPage);

updateUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;
    next();
}

function updateUserNav() {
    const userData = getUserData();
    if(userData) {
        document.getElementById('guest').style.display = 'none';
        document.getElementById('user').style.display = 'block';
        document.querySelector('#user span').textContent = `Welcome, ${userData.email}`;
    } else {
        document.getElementById('guest').style.display = 'block';
        document.getElementById('user').style.display = 'none';
    }
}

document.getElementById('logoutBtn').addEventListener('click', onLogout);

async function onLogout() {
    await logout();
    updateUserNav();
    page.redirect('/');
}