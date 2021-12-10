const container = document.createElement('div');
container.id = 'notification';
const ul = document.createElement('ul');
ul.addEventListener('click', onClick);
container.appendChild(ul);

document.body.appendChild(container);

export function notify(message) {
    const liItem = document.createElement('li');
    liItem.className = 'notification';
    liItem.textContent = message + ' \u2716';
    ul.appendChild(liItem);
    
    setTimeout(() => liItem.remove(), 5000);
}

function onClick(e) {
    e.preventDefault();
    if (e.target.tagName == 'LI') {
        e.target.remove();
    }
}