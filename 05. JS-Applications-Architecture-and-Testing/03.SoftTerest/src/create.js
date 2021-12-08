import { createIdea } from './api/data.js';

const section = document.getElementById('createPage');
section.remove();
const form = section.querySelector('form');
form.addEventListener('submit', onSubmit);
let ctx = null;


export async function showCreatePage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

async function onSubmit(e) {
    e.preventDefault(); 
    const forData = new FormData(form);

    const title = forData.get('title').trim();
    const description = forData.get('description').trim();
    const img = forData.get('imageURL').trim();

    if(title.length < 6) {
        return alert('at least 6 characters');
    }
    if(description.length < 10) {
        return alert('at least 10 characters');
    }
    
    if(img.length < 5) {
        return alert('at least 10 characters');
    }

    createIdea({title, description, img});
    form.reset();

    ctx.goTo('catalog');
}