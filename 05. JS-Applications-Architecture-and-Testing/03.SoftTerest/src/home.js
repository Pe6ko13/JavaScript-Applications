const section = document.getElementById('homePage');
section.remove();
const form = section.querySelector('#getStartedLink');
form.addEventListener('click', (e) => {
    e.preventDefault();
    ctx.goTo('catalog');
});
let ctx = null;


export async function showHomePage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}