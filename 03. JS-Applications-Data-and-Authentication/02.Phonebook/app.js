function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', loadContacts);
    document.getElementById('btnCreate').addEventListener('click', onCreate);
    
    phonebook.addEventListener('click', onDelete);

    loadContacts();
}

const phonebook = document.getElementById('phonebook');
const personInput = document.getElementById('person');
const phoneInput = document.getElementById('phone');

attachEvents();

async function loadContacts() {
    let url = 'http://localhost:3030/jsonstore/phonebook';
    const response = await fetch(url);
    const data = await response.json();

    phonebook.replaceChildren(...Object.values(data).map(createElement));
    // Object.values(data).map(createElement).forEach(i => phonebook.appendChild(i));
}

async function createContact(contact) {
    const res = await fetch('http://localhost:3030/jsonstore/phonebook', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });

    const result = await res.json();
    return result;
}

async function onCreate() {
    const person = personInput.value;
    const phone = phoneInput.value;
    const contact = {
        person,
        phone
    };

    const result = await createContact(contact);

    phonebook.appendChild(createElement(result));
    personInput.value = '';
    phoneInput.value = '';
}

async function deleteContact(id) {
    const response = await fetch('http://localhost:3030/jsonstore/phonebook/' + id, {
        method: 'delete'
    });
    return await response.json();
}

async function onDelete(ev) {
    const id = ev.target.dataset.id;
    if (id != undefined) {
        await deleteContact(id);
        ev.target.parentElement.remove();
    }
}

function createElement(contact) {
    let liElement = document.createElement('li');
    liElement.innerHTML = `${contact.person}: ${contact.phone} <button data-id="${contact._id}">Delete</button>`;
    return liElement;
}

