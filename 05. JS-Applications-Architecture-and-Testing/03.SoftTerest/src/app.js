import { showSection } from './dom.js';
import { showCatalogPage } from './catalog.js';
import { showCreatePage } from './create.js';
import { showDetailsPage } from './details.js';
import { showHomePage } from './home.js';
import { showLoginPage } from './login.js';
import { showRegisterPage } from './register.js';
import { logout } from './api/data.js';


const links = {
    'homeLink': 'home',
    'getStartedLink': 'home',
    'catalogLink': 'catalog',
    'loginLink': 'login',
    'registerLink': 'register',
    'createLink': 'create'
};

const views = {
    'home': showHomePage,
    'catalog': showCatalogPage,
    'login': showLoginPage,
    'register': showRegisterPage,
    'create': showCreatePage,
    'details': showDetailsPage
};

const nav = document.querySelector('nav');

nav.addEventListener('click', onNavigate);
document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    await logout();
    updateNav();
    goTo('home');
});

const ctx = {
    goTo,
    showSection,
    updateNav
};

updateNav();
goTo('home');

function onNavigate(e) {
    const name = links[e.target.id];
    if(name) {
        e.preventDefault();
        goTo(name);
    }
}

function goTo(name, ...params) {
    const view = views[name];
    if(typeof view == 'function') {
        view(ctx, ...params);
    }
}

function updateNav() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if(userData != null) {
        [...nav.querySelectorAll('.user')].forEach(li => li.style.display = 'block');
        [...nav.querySelectorAll('.guest')].forEach(li => li.style.display = 'none');
    } else {
        [...nav.querySelectorAll('.user')].forEach(li => li.style.display = 'none');
        [...nav.querySelectorAll('.guest')].forEach(li => li.style.display = 'block');
    }
}