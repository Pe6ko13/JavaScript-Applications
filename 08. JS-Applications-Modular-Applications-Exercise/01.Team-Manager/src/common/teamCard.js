import { html } from '../library.js';

export const teamCard = (team) => html`
<article class="layout">
    <img src=${team.logoUrl} class="team-logo left-col">
    <div class="tm-preview">
        <h2>${team.name}</h2>
        <p>${team.description}</p>
        <span class="details">${team.memberCount}</span>
        <div><a href=${`/details/${team._id}`} class="action">See details</a></div>
    </div>
</article>`;
