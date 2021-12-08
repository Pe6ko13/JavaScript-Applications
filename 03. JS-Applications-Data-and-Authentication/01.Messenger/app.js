function attachEvents() {
    let refreshBtn = document.getElementById('refresh');
    refreshBtn.addEventListener('click', loadMessages);

    let sendBtn = document.getElementById('submit');
    sendBtn.addEventListener('click', onSend);

    loadMessages();
}

const authorInput = document.querySelector('[name="author"]');
const contentInput = document.querySelector('[name="content"]');
const textArea = document.getElementById('messages');

attachEvents();

// load and desplay messages
async function loadMessages() {
    let url = 'http://localhost:3030/jsonstore/messenger';
    const response = await fetch(url);
    const data = await response.json();

    const messages = Object.values(data);
   
    textArea.textContent = messages.map(mes => `${mes.author}: ${mes.content}`).join('\n');
}

// post message
async function createMessage(message) {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    };

    const res = await fetch(url, options);
    const result = await res.json();
    return result;


}
// add single message to list
async function onSend() {
    const author = authorInput.value;
    const content = contentInput.value;

    await createMessage({author, content});

    authorInput.value = '';
    contentInput.value ='';
    textArea.value += '\n' + `${author}: ${content}`;
}