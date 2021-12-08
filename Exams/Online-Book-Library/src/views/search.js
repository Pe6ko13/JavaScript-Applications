import { searchBooks } from '../api/data.js';
import { html } from '../lib.js';

const searchTemplete = (books, onSearch, params = '') => html`
<section id="search-page" class="dashboard">
    <h1>Search</h1>

    <form @submit=${onSearch}>
        <input type="type" name="search" .value=${params}>
        <input type="submit" value="Search">
    </form>
    ${books.length == 0
        ? html`<p class="no-books">No result</p>`
        : html`<ul class="other-books-list">
            ${books.map(bookCard)}
        </ul>`}

</section>`;

const bookCard = (book) => html`
<li class="otherBooks">
    <h3>${book.title}</h3>
    <p>Type: ${book.type}</p>
    <p class="img"><img src=${book.imageUrl}></p>
    <a class="button" href="/details/${book._id}">Details</a>
</li>`;

export async function searchPage(ctx) {
    const params = ctx.querystring.split('=')[1];
    let books = [];
    
    if (params) {
        books = await searchBooks(decodeURIComponent(params));
    }

    ctx.render(searchTemplete(books, onSearch, params));

    function onSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get('search');

        if(search) {
            ctx.page.redirect('/search?query=' + encodeURIComponent(search));
        }
    }
}

// <@change=${onChange}>

// export const searchPage = (ctx) => {
//     let currSearch = '';

//     const onChange = (e) => {
//         currSearch = e.target.value;
//     }

//     const onSearch = (e) => {
//         let result = currSearch;
//         const books = await searchBooks(result);
//         ctx.render(searchTemplete(onChange, onSearch, books));
//     }

//     ctx.render(searchTemplete(onChange, onSearch));
// }