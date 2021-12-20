import { getMyTeams } from '../api/data.js';
import { loaderTemplate } from '../common/loader.js';
import { teamCard } from '../common/teamCard.js';
import { html, until } from '../library.js';

const myTeamTemplate = (teams) => html`
<section id="my-teams">

    <article class="pad-med">
        <h1>My Teams</h1>
    </article>

    <article class="layout narrow">
        ${teams.length == 0
            ? html`<div class="pad-med">
                        <p>You are not a member of any team yet.</p>
                        <p><a href="/teams">Browse all teams</a> to join one, or use the button bellow to cerate your own
                            team.</p>
                    </div>` : ''}
        
        <div class="pad-small"><a href="/create" class="action cta">Create Team</a></div>
    </article>

    ${teams.map(teamCard)}

</section>`;

export async function myPage(ctx) {   
    ctx.render(until(loadTemplate(), loaderTemplate()));
}

async function loadTemplate() {
    const teams = await getMyTeams();
    return myTeamTemplate(teams);
}