import {createBook, html} from './utility.js';

const createT = (onSuccess) => html`
<form @submit=${e => onSubmit(e, onSuccess)} id="add-form">
    <h3>Add book</h3>
    <label>TITLE</label>
    <input type="text" name="title" placeholder="Title...">
    <label>AUTHOR</label>
    <input type="text" name="author" placeholder="Author...">
    <input type="submit" value="Submit">
</form>`;

export function showCreate(ctx) {
    if (ctx.book == undefined) {
        return createT(ctx.update);
    } else {
        return null;
    }
}

async function onSubmit(e, onSuccess) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const title = formData.get('title').trim();
    const author = formData.get('author').trim();

    await createBook({ title, author });

    e.target.reset();
    onSuccess();
}