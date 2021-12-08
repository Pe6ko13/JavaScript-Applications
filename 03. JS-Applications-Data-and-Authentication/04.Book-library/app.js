let loadBooksBtn = document.getElementById('loadBooks');
loadBooksBtn.addEventListener('click', getBooks);

let booksTableBody = document.querySelector('#books-table tbody');
booksTableBody.querySelectorAll('tr').forEach(tr => tr.remove());

let bookForm = document.getElementById('book-form');
bookForm.addEventListener('submit', handleFormSubmit);

function handleEdit(ev) {
    let currentBook = ev.target.closest('.book');
    let currentTitle = currentBook.querySelector('.title');
    let currentAuthor = currentBook.querySelector('.author');

    let formHeading = bookForm.querySelector('h3');
    formHeading.textContent = 'Edit FORM';
    bookForm.dataset.entryId = currentBook.dataset.id;
    bookForm.dataset.isEdit = true;

    let titleInput = bookForm.querySelector('input[name="title"]');
    let authorInput = bookForm.querySelector('input[name="author"]');
    titleInput.value = currentTitle.textContent;
    authorInput.value = currentAuthor.textContent;
}

async function handleFormSubmit(ev) {
    ev.preventDefault();
    let form = ev.currentTarget;
    let formData = new FormData(form);

    if (form.dataset.isEdit !== undefined) {
        let id = form.dataset.entryId;
        editBook(formData, id);
    } else {
        createBook(formData);
    }
}

async function deleteBook(ev) {
    let bookToDelete = ev.target.closest('.book');
    let id = bookToDelete.dataset.id;
    let url = `http://localhost:3030/jsonstore/collections/books/${id}`;
    let deleteResponse = await fetch(url, {
        method: 'Delete',
    });

    if (deleteResponse.status == 200) {
        bookToDelete.remove();
    }
}

async function editBook(formData, id) {
    let editBook = {
        title: formData.get('title'),
        author: formData.get('author')
    };

    let url = `http://localhost:3030/jsonstore/collections/books/${id}`;
    let editResponse = await fetch(url, {
        method: 'Put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editBook)
    });

    let editResult = await editResponse.json();
    let editedBook = booksTableBody.querySelector(`tr.book[data-id="${id}"]`);
    let editedHtmlBook = createHtmlBook(editResult, editResult._id);
    editedBook.replaceWith(editedHtmlBook);
    console.log(editResult);
}

async function createBook(formData) {
    let newBook = {
        title: formData.get('title'),
        author: formData.get('author')
    };

    let url = 'http://localhost:3030/jsonstore/collections/books';
    let createResponse = await fetch(url, {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newBook)
    });

    let createResult = await createResponse.json();
    let createdHtmlBook = createHtmlBook(createResult, createResult._id);
    booksTableBody.appendChild(createdHtmlBook);
}

async function getBooks() {
    let url = 'http://localhost:3030/jsonstore/collections/books';
    let bookResponse = await fetch(url);
    let books = await bookResponse.json();

    booksTableBody.replaceChildren();
    
    Object.keys(books).forEach(key => {
        let htmlBook = createHtmlBook(books[key], key);
        booksTableBody.appendChild(htmlBook);
    });
}

function createHtmlBook(book, id) {
    let titleTd = createEl('td', {class: 'title'}, book.title);
    let authorTd = createEl('td', {class: 'author'}, book.author);
    let editBtn = createEl('button', undefined, 'Edit');
    editBtn.addEventListener('click', handleEdit);
    let deleteBtn = createEl('button', undefined, 'Delete');
    deleteBtn.addEventListener('click', deleteBook);
    let buttonsTd = createEl('td', undefined, editBtn, deleteBtn);
    let tr = createEl('tr', {class: 'book'}, titleTd, authorTd, buttonsTd);
    tr.dataset.id = id;
    return tr;
}

function createEl(tag, attr, ...params) {
    let element = document.createElement(tag);
    let firstValue = params[0];
    if (params.length === 1 && typeof(firstValue) !== 'object') {
        if (['input', 'textarea'].includes(tag)) {
            element.value = firstValue;
        } else {
            element.textContent = firstValue;
        }
    } else {
        element.append(...params);
    }

    if (attr !== undefined) {
        Object.keys(attr).forEach(key => {
            element.setAttribute(key, attr[key]);
        });
    }

    return element;
}