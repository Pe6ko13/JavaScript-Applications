import { createComment, getCommentsByRecipeId } from '../api/comments.js';
import { html } from '../lib/lit-html.js';
import { until, render } from '../library.js';
import { createSubmitHandler } from '../util.js';
import { spinner } from './common.js';

const commentsTemplate = (commentsPromise, hasUser, active, onToggle, onSubmit) => html`

${hasUser ? commentForm(active, onToggle, onSubmit) : null}

<div class="section-title">Comments</div>
<div class="comments">
    <ul>
       ${until(commentsPromise, spinner())}
    </ul>
</div>`;

const commentForm = (active, onToggle, onSubmit) => html`
<article class="new-comment">
    ${active
        ? html`
            <h2>New comment</h2>
            <form @submit=${onSubmit} id="commentForm">
                <textarea name="content" placeholder="Type comment"></textarea>
                <input type="submit" value="Add comment">
            </form>`
        : html`<form><button @click=${onToggle} class="button" @click="">Add comment</button></form>`}
</article>`;

const commentCard = (comment) => html`
 <li class="comment">
    <header>${comment.owner.username}<span class="comment-date">${(new Date(comment.createdAt)).toLocaleString()}</span></header>
    <p>${comment.content}</p>
</li>`;

export function commentsView(ctx, recipeId) {
    const parent = document.getElementById('comments-container');
    const commentPromise = getCommentsByRecipeId(recipeId);

    update();

    function update(active = false) {
        render(commentsTemplate(loadComment(commentPromise), ctx.user, active, onToggle, createSubmitHandler(onSubmit, 'content')), parent);
    }

    function onToggle() {
        update(true);
    }

    async function onSubmit({ content }) {
        if (content == '') {
            return;
        }
        const result = await createComment(recipeId, { content });
        result.owner = { username: ctx.user.username };
        result.content = content;

        (await commentPromise).results.unshift(result);
        update();
    }
}

async function loadComment(commentPromise) {
    const { results: comments } = await commentPromise;

    return comments.map(commentCard);
}