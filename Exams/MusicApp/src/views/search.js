import { searchAlbum } from '../api/data.js';
import { html } from '../library.js';
import { getUserData } from '../utils.js';

let isLogged = false;

const searchTemplate = (albums = '', onSearch, params = '', user) => html`
<section id="searchPage">
    <h1>Search by Name</h1>

    <div class="search">
        <form @submit=${onSearch}>
            <input id="search-input" type="text" name="search" placeholder="Enter desired albums's name" .value=${params}>
            <button class="button-list">Search</button>
        </form>
    </div>

    <h2>Results:</h2>

    <!--Show after click Search button-->
    <div class="search-result">
        ${albums.length == 0
            ? html`<p class="no-result">No result.</p>`
            : albums.map(albumTemp)}
    </div>
</section>`;

const albumTemp = (album) => html`
<div class="card-box">
    <img src=${album.imgUrl}>
    <div>
        <div class="text-center">
            <p class="name">Name: ${album.name}</p>
            <p class="artist">Artist: ${album.artist}</p>
            <p class="genre">Genre: ${album.genre}</p>
            <p class="price">Price: $${album.price}</p>
            <p class="date">Release Date: ${album.releaseDate}</p>
        </div>
        ${isLogged
         ? html`<div class="btn-group">
            <a href="/details/${album._id}" id="details">Details</a>
        </div>` : null}
        
    </div>
</div>`;

export async function searchPage(ctx) {
    const user = getUserData();
    isLogged = user;

    const params = ctx.querystring.split('=')[1];
    let albums = [];
    
    if (params) {
        albums = await searchAlbum(params);
    }

    ctx.render(searchTemplate(albums, onSearch, params));

    function onSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get('search');

        if(search == '') {
            return alert('Fiald must be filled!');
        }
        if(search) {
            ctx.page.redirect('/search?query=' + search);
        }
    }
}