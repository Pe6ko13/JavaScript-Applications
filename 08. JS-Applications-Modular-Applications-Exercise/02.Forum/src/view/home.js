import { getTopicCount } from '../api/data.js';
import { html, until } from '../lib.js';

const homeTemplate = (countPromise) => html`
<h1>Forum</h1>
<div class="splash">
    <p>Welcome to The Forum</p>
    <div>
        <a href="/topics">All Topics: ${until(countPromise, 'topics')}</a>
    </div>
</div>`;

export function homePage(ctx) {
    ctx.render(homeTemplate(loadHome()));
}

async function loadHome() {
    const count = await getTopicCount();

    return count;
}