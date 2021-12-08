import { page, render } from './library.js';
import { getUserData } from './utils.js';
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { logoutPage } from './views/logout.js';
import { navPage } from './views/navigation.js';
import { registerPage } from './views/register.js';
import { searchPage } from './views/search.js';

const nav = document.querySelector('.navigation');
const main = document.getElementById('main-content');

page(decorateContext);
page(navContext);

page('/', homePage);
page('/login', loginPage);
page('/logout', logoutPage);
page('/register', registerPage);
page('/catalog', catalogPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/search', searchPage);

page.start();

function navContext(ctx, next) {
    render(navPage(ctx), nav);
    next();
}

export function decorateContext(ctx, next) {
    ctx.render = (context) => render(context, main);
    ctx.user = getUserData();
    next();
}