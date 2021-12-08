import { html } from '../library.js';

const navTemplate = (user) => html`
 <!-- Navigation -->
<h1><a class="home" href="/">GamesPlay</a></h1>
<nav>
    <a href="/allGames">All games</a>
    ${user 
        ? html`<div id="user">
                    <a href="/create">Create Game</a>
                    <a id="logoutBtn" href="/logout">Logout</a>
                </div>` 
        : html ` <div id="guest">
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </div>`}
</nav>`;

export function navPage(ctx) {
    return navTemplate(ctx.user);
}