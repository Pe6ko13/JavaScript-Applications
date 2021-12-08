import { register } from './api/data.js';

const section = document.getElementById('registerPage');
section.remove();
const form = section.querySelector('form');
form.addEventListener('submit', onSubmit);
let ctx = null;

export function showRegisterPage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

async function onSubmit(e) {
    e.preventDefault(); 
    const forData = new FormData(form);

    const email = forData.get('email').trim();
    const password = forData.get('password').trim();
    const repPassword = forData.get('repeatPassword').trim();

    if (email == '' || password == '') {
        throw new Error('All field must be filled!');
    }
    
    if(email.length < 3) {
        return alert('at least 3 characters');
    }
    
    if(password.length < 3) {
        return alert('at least 3 characters');
    }

    if(password != repPassword) {
        return alert('Passwords don\'t match!');
    }

    await register(email, password);
    form.reset();
    ctx.goTo('home');
    ctx.updateNav();
}