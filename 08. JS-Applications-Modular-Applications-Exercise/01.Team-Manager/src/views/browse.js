import { getTeams } from '../api/data.js';
import { loaderTemplate } from '../common/loader.js';
import { teamCard } from '../common/teamCard.js';
import { html, until } from '../library.js';
import { getUserData } from '../util.js';

const browseTemplate = (teams, user) => html`
<section id="browse">

    <article class="pad-med">
        <h1>Team Browser</h1>
    </article>

    ${user 
        ? html`<article class="layout narrow">
                <div class="pad-small"><a href="/create" class="action cta">Create Team</a></div>
            </article>` : null}
    
    ${teams.map(teamCard)}
    
</section>`;


export async function browsePage(ctx) {   
    ctx.render(until(loadTemplate(), loaderTemplate()));
}

async function loadTemplate() {
    const user = getUserData();
    const teams = await getTeams();
    return browseTemplate(teams, user);
}