import { login } from './api/data.js';

const section = document.getElementById('loginPage');
section.remove();
const form = section.querySelector('form');
form.addEventListener('submit', onSubmit);
let ctx = null;


export function showLoginPage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

async function onSubmit(e) {
    e.preventDefault(); 
    const forData = new FormData(form);

    const email = forData.get('email').trim();
    const password = forData.get('password').trim();

    form.reset();
    await login(email, password);
    ctx.goTo('home');
    ctx.updateNav();
}