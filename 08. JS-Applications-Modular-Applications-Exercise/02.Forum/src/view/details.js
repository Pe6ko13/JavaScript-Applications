import { html, until } from '../lib.js';
import { getTopicById, getCommentsByTopicId, createComment } from '../api/data.js';
import { createSubmitHandler, getUserData } from '../util.js';

const detailsTemplate = (topicPromise) => html`
<div class="narrow">
    ${until(topicPromise, html`<p class="spinner">Loading &hellip;</p>`)}
</div>`;

const topicCard = (topic, isOwner, comments, onCommentSubmit) => html`
<header>
    <h2>${topic.title}</h2>
    ${isOwner 
            ? html`<a class="action" href=${`/edit/${topic._id}`}>Edit</a><a class="action" href="javascript:void(0)">Delete</a>`
            : html`<span>By ${topic.author.username}</span>`}
</header>
<div class="topic-content">
    <p>${topic.content}</p>
</div>
<header>comments:</header>
<div class="topic-content">
    ${commentForm(onCommentSubmit)}
    ${comments.map(commentCard)}
</div>`;

const commentCard = (comment) => html`
<article>
        <header>from ${comment.author.username}</header>
        <p>${comment.content}</p>
</article>`;

const commentForm = (onCommentSubmit) => html`
<div class="topic-content">
    <form @submit=${onCommentSubmit}>
        <label>Your comment<textarea name="content"></textarea></label>
        <input class="action" type="submit" value="Post">
    </form>
</div>`;

let _topicData = null;

export function detailsPage(ctx) {
    _topicData = getTopicById(ctx.params.id);
    update();

    function update() {
        ctx.render(detailsTemplate(loadTopic(ctx.params.id, onCommentSubmit)));
    }
    async function onCommentSubmit(data, e) {
        if (data.content == '') {
            return alert('Cannot post empty comment');
        }

        [...e.target.querySelectorAll('input, textarea')].forEach(i => i.disabled = true);

        data.topicId = ctx.params.id;

        await createComment(data);

        [...e.target.querySelectorAll('input, textarea')].forEach(i => i.disabled = false);

        update();
    }
}

async function loadTopic(id, onCommentSubmit) {
    const [ topic, comments ] = await Promise.all([
        _topicData,
        getCommentsByTopicId(id)
    ]); 

    const userData = getUserData();
    const isOwner = userData && userData.id == topic._ownerId;

    return topicCard(topic, isOwner, comments, createSubmitHandler(onCommentSubmit, 'content'));
}