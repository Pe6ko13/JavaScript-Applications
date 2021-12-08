import { page, render } from './library.js';
import { getUserData } from './userdata.js';
import { logout } from './api/data.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { homePage } from './views/home.js';
import { allListingsPage } from './views/allListings.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { myListingsPage } from './views/myListing.js';
import { searchPage } from './views/search.js';

const root = document.getElementById('site-content');

page(decorateContext);
page('/', homePage);
page('/allListings', allListingsPage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/myListings', myListingsPage);
page('/search', searchPage);

updateNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (cont) => render(cont, root);
    ctx.updateNav = updateNav;
    next();
}

function updateNav() {
    const user = getUserData();
    if (user) {
        document.getElementById('profile').style.display = 'block';
        document.getElementById('guest').style.display = 'none';
        document.querySelector('.welcome').textContent = `Welcome ${user.username}`;
    } else {
        document.getElementById('profile').style.display = 'none';
        document.getElementById('guest').style.display = 'block';
    }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
    updateNav();
    page.redirect('/');
});
