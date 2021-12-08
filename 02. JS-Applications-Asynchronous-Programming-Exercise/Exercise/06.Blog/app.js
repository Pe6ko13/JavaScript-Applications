function attachEvents() {
    document.getElementById('btnLoadPosts').addEventListener('click', getAllPosts);
    document.getElementById('btnViewPost').addEventListener('click', displayPost);
}

attachEvents();

async function displayPost() {
    let selectId = document.getElementById('posts').value;
    
    const [post, comments] = await Promise.all([
        getPostById(selectId),
        getCommentsByPostId(selectId)
    ]);

    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-body').textContent = post.body;

    const ulElement = document.getElementById('post-comments');
    ulElement.replaceChildren();

    comments.forEach(c => {
        const liEl = document.createElement('li');
        liEl.textContent = c.text;
        ulElement.appendChild(liEl);
    });

}
async function getAllPosts() {
    const response = await fetch('http://localhost:3030/jsonstore/blog/posts');
    const data = await response.json();

    let selectEl = document.getElementById('posts');
    selectEl.replaceChildren();

    Object.values(data).forEach(p => {
        const optionEl = document.createElement('option');
        optionEl.textContent = p.title;
        optionEl.value = p.id;
        selectEl.appendChild(optionEl);
    });
}

async function getPostById(postId) {
    const response = await fetch('http://localhost:3030/jsonstore/blog/posts/' + postId);
    return await response.json();
}

async function getCommentsByPostId(postId) {
    const response = await fetch('http://localhost:3030/jsonstore/blog/comments');
    const data = await response.json();
    return Object.values(data).filter(c => c.postId === postId);
}