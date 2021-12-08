import { editAlbum, getAlbumById } from '../api/data.js';
import { html } from '../library.js';

const editTEmplate = (album, onEdit) => html`
<section class="createPage">
    <form @submit=${onEdit}>
        <fieldset>
            <legend>Edit Album</legend>

            <div class="container">
                <label for="name" class="vhide">Album name</label>
                <input id="name" name="name" class="name" type="text" placeholder="Album name" .value=${album.name}>

                <label for="imgUrl" class="vhide">Image Url</label>
                <input id="imgUrl" name="imgUrl" class="imgUrl" type="text" placeholder="Image Url" .value=${album.imgUrl}>

                <label for="price" class="vhide">Price</label>
                <input id="price" name="price" class="price" type="text" placeholder="Price" .value=${album.price}>

                <label for="releaseDate" class="vhide">Release date</label>
                <input id="releaseDate" name="releaseDate" class="releaseDate" type="text" placeholder="Release date" .value=${album.releaseDate}>

                <label for="artist" class="vhide">Artist</label>
                <input id="artist" name="artist" class="artist" type="text" placeholder="Artist" .value=${album.artist}>

                <label for="genre" class="vhide">Genre</label>
                <input id="genre" name="genre" class="genre" type="text" placeholder="Genre" .value=${album.genre}>

                <label for="description" class="vhide">Description</label>
                <textarea name="description" class="description" placeholder="Description" .value=${album.description}></textarea>

                <button class="add-album" type="submit">Add New Album</button>
            </div>
        </fieldset>
    </form>
</section>`;

export async function editPage(ctx) {
    const albumId = ctx.params.id;
    const album = await getAlbumById(albumId);

    ctx.render(editTEmplate(album, onEdit));

    async function onEdit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const album = {
            name: formData.get('name').trim(),
            imgUrl: formData.get('imgUrl').trim(),
            price: formData.get('price').trim(),
            releaseDate: formData.get('releaseDate').trim(),
            artist: formData.get('artist').trim(),
            genre: formData.get('genre').trim(),
            description: formData.get('description').trim(),
        };

        if(Object.values(album).some(a => !a)) {
            return alert('All fields are required');
        }

        await editAlbum(albumId, album);
        e.target.reset();
        ctx.page.redirect('/catalog');
    }
}