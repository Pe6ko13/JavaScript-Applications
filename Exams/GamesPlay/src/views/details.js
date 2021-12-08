import { deleteGame, getComments, getGameById, postComment } from '../api/data.js';
import { html } from '../library.js';
import { getUserData } from '../utils.js';

const detailsTemplate = (game, onDelete, isOwner, comments, submitComment, showAddComment) => html`
<section id="game-details">
    <h1>Game Details</h1>
    <div class="info-section">
    <div class="game-header">
        <img class="game-img" src=${game.imageUrl} />
        <h1>${game.title}</h1>
        <span class="levels">MaxLevel: ${game.maxLevel}</span>
        <p class="type">${game.category}</p>
    </div>

    <p class="text">${game.summary}</p>

    ${isOwner 
        ? html`<div class="buttons">
                    <a href="/edit/${game._id}" class="button">Edit</a>
                    <a @click=${onDelete} href="javascript:void(0)" class="button">Delete</a>
                </div>` : null}
    
    <div class="details-comments">
        <h2>Comments:</h2>
        <ul>
           ${comments.length == 0
                ? html`<p class="no-comment">No comments.</p>` 
                : comments.map(commentTemplate)}
        </ul>
                
    </div>

    <!-- Add Comment ( Only for logged-in users, which is not creators of the current game ) -->
    ${showAddComment
        ? html`<article class="create-comment">
            <label>Add new comment:</label>
            <form @submit=${submitComment} class="form">
                <textarea name="comment" placeholder="Comment......"></textarea>
                <input class="btn submit" type="submit" value="Add Comment">
            </form>
        </article>` : null}
</div>
</section>`;

const commentTemplate = (comment) => html`
<li class="comment">
    <p>Content: ${comment.comment}.</p>
</li>`;


export async function detailsPage(ctx) {
    const gameId = ctx.params.id;
    const game = await getGameById(gameId);
    const user = getUserData();
    const comments = await getComments(gameId);

    const isOwner = user && game._ownerId == user.id;
    const showAddComment = user && isOwner == false;

    ctx.render(detailsTemplate(game, onDelete, isOwner, comments, submitComment, showAddComment));

    async function onDelete() {
        let choice = confirm('Are you sure?');
        if (choice) {
            await deleteGame(gameId);
            ctx.page.redirect('/');
        }
    }

    async function submitComment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const comment = formData.get('comment');

        if(comment == '') {
            return alert('Field must be filled!');
        }

        try{
            await postComment({gameId, comment});
        
        } catch (err) {
            alert(err.message);
        }
        e.target.reset();
        ctx.page.redirect(`/details/${gameId}`);
    }
}