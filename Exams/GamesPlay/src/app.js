import { render, page } from './library.js';
import { getUserData } from './utils.js';
import { allGamesPage } from './views/allGames.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { logoutPage } from './views/logout.js';
import { navPage } from './views/navigation.js';
import { registerPage } from './views/register.js';

const root = document.getElementById('main-content');
const navElement = document.querySelector('header.navigation');

page(decorateContext);
page(navContext);

page('/', homePage);
page('/allGames', allGamesPage);
page('/login', loginPage);
page('/logout', logoutPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);


//updateNavigationBar();
page.start();

export function decorateContext(ctx, next) {
    ctx.render = (context) => render(context, root);
    // ctx.updateNav = updateNavigationBar;
    ctx.user = getUserData();
    next();
}

function navContext(ctx, next) {
    render(navPage(ctx), navElement);
    next();
}

// function updateNavigationBar() {
//     const user = getUserData();
//     if(user) {
//         document.getElementById('user').style.display = 'block';
//         document.getElementById('guest').style.display = 'none';
//     } else {
//         document.getElementById('user').style.display = 'none';
//         document.getElementById('guest').style.display = 'block';
//     }
// }

// document.getElementById('logoutBtn').addEventListener('click', () => {
//     logout();
//     // updateNavigationBar();
//     page.redirect('/');
// });