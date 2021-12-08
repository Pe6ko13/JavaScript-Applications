import { getAllTopics } from '../api/data.js';
import { html, until } from '../lib.js';

const topicsTemplate = (topicPromise) => html`
<h1>Topics</h1>
<div>
    ${until(topicPromise, html`<p class="spinner">Loading &hellip;</p>`)}
</div>`;

const topicPreviewCard = (topic) => html`
<article class="preview">
    <header><a class="topic-title" href=${`/topic/${topic._id}`}>${topic.title}</a></header>
    <div><span>By ${topic.author.username}</span> | <span>23 Comments</span></div>
</article>`;

export function topicsPage(ctx) {
    ctx.render(topicsTemplate(loadTopics()));
}

async function loadTopics() {
    const topics = await getAllTopics();

    return topics.map(topicPreviewCard);
}