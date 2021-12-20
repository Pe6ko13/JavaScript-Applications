import { approveMembership, cancelMembership, getReqByTeamId, getTeamById, requestToJoinTeam } from '../api/data.js';
import { loaderTemplate } from '../common/loader.js';
import { html, until } from '../library.js';
import { getUserData } from '../util.js';

const detailsTemplate = (team, isOwner, createControls, members, pending) => html`
<section id="team-home">
    <article class="layout">
        <img src=${team.logoUrl} class="team-logo left-col">
        <div class="tm-preview">
            <h2>${team.name}</h2>
            <p>${team.description}</p>
            <span class="details">${team.memberCount} Members</span>
            <div>
                ${createControls()}              
            </div>
        </div>
        <div class="pad-large">
            <h3>Members</h3>
            <ul class="tm-members">
                ${members.map(m => memberTemplate(m, isOwner))}
          </ul>
        </div>

        ${isOwner ? html` <div class="pad-large">
                                <h3>Membership Requests</h3>
                                <ul class="tm-members">
                                    ${pending.map(pendingMemberTemplate)}                                  
                                </ul>
                            </div>` : ''}     
    </article>
</section>`;


const memberTemplate = (request, isOwner) => html`
<li>${request.user.username}
    ${isOwner ? html`<a @click=${request.decline} href="javascript:void(0)" class="tm-control action">Remove from team</a>` : ''}
</li>`;


const pendingMemberTemplate = (request) => html`
 <li>${request.user.username}
    <a @click=${request.approve} href="javascript:void(0)" class="tm-control action">Approve</a>
    <a @click=${request.decline} href="javascript:void(0)" class="tm-control action">Decline</a>
</li>`;


export async function detailsPage(ctx) {
    const teamId = ctx.params.id;
    ctx.render(until(loadTemplate(teamId), loaderTemplate()));

    let userId = sessionStorage.getItem('userId');
    const user = getUserData();
    if (user) {
        userId = user.userId;
    }

    async function loadTemplate(teamId) {
      
        const [team, requests] = await Promise.all([
            getTeamById(teamId),
            getReqByTeamId(teamId),
        ]);

        requests.forEach(r => {
            r.approve = (e) => approve(e, r);
            r.decline = (e) => leave(e, r._id);
        });

        const isOwner = userId == team._ownerId;

        const members = requests.filter(r => r.status == 'member');

        const pending = requests.filter(r => r.status == 'pending');
           
        team.memberCount = members.length;

        return detailsTemplate(team, isOwner, createControls, members, pending);
    
        function createControls() {
            if (userId != null) {
                const request = requests.find(r => r._ownerId == userId);
                if (isOwner) {
                    return html`<a href=${`/edit/${team._id}`} class="action">Edit team</a>`;
                } else if (request && request.status == 'member') {
                    return html`<a @click=${(e) => leave(e, request._id)} href="javascript:void(0)" class="action invert">Leave team</a>`;
                } else if (request && request.status == 'pending') { 
                    return html`Membership pending. <a @click=${(e) => leave(e, request._id)} href="javascript:void(0)">Cancel request</a>`;
                } else {
                    return html`<a @click=${join} href="javascript:void(0)" class="action">Join team</a>`;
                }
            } else {
                return '';
            }
            
        }
    
        async function join(e) {
            e.target.remove();
            await requestToJoinTeam(teamId);
            ctx.render(await loadTemplate(teamId));
        }

        async function leave(e, requestId) {
            const choice = confirm('Are you sure?');
            if (choice) {
                e.target.remove();
                await cancelMembership(requestId);
                ctx.render(await loadTemplate(teamId));

            }
        }

        async function approve(e, request) {
            e.target.remove();
            await approveMembership(request);
            ctx.render(await loadTemplate(teamId));
        }
    }
}

