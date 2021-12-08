import { deleteBook, getBookById, getLikes, getUserLike, likeBook } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const detailsTemplete = (book, isOwner, onDelete, likes, showLikeButton, onLike) => html`
<section id="details-page" class="details">
    <div class="book-information">
        <h3>${book.title}</h3>
        <p class="type">Type: ${book.type}</p>
        <p class="img"><img src=${book.imageUrl}></p>
        <div class="actions">
            ${isOwner 
                ? html`<a class="button" href="/edit/${book._id}">Edit</a>
                        <a @click=${onDelete} class="button" href="javascript:void(0)">Delete</a>`
                : null}
           
            <!-- Like button ( Only for logged-in users, which is not creators of the current book ) -->
            ${likeControlTemp(showLikeButton, onLike)}

            <!-- ( for Guests and Users )  -->
            <div class="likes">
                <img class="hearts" src="/images/heart.png">
                <span id="total-likes">Likes: ${likes}</span>
            </div>
            <!-- Bonus -->
        </div>
    </div>
    <div class="book-description">
        <h3>Description:</h3>
        <p>${book.description}</p>
    </div>
</section>`;

const likeControlTemp = (showLikeButton, onLike) => {
    if (showLikeButton) {
        return html`<a @click=${onLike} class="button" href="javascript:void(0)">Like</a>`;
    } else {
        return null;
    }
};

export async function detailsPage(ctx) {
    const userData = getUserData();

    const [book, likes, hasLike] = await Promise.all([
        getBookById(ctx.params.id),
        getLikes(ctx.params.id),
        userData ? getUserLike(ctx.params.id, userData.id) : 0
    ]);

    const isOwner = userData && book._ownerId == userData.id;
    const showLikeButton = userData != null && isOwner == false && hasLike == false;

    ctx.render(detailsTemplete(book, isOwner, onDelete, likes, showLikeButton, onLike));

    async function onDelete() {
        const choice = confirm('Are you sure?');
        if(choice) {
            await deleteBook(ctx.params.id);
            ctx.page.redirect('/');
        }
    }

    async function onLike() {
        try{
            await likeBook(ctx.params.id);
            ctx.page.redirect('/details/' + ctx.params.id);
        } catch (err) {
            alert(err.message);
        }
        
    }
}