const elem = document.createElement('div');
elem.id = 'overlay';

elem.innerHTML = `<div id="modal">
                    <p>Are you sure?</p>
                    <div>
                        <button class="modal-ok">OK</button>
                        <button class="modal-cancel">Cancel</button>
                    </div>
                </div>`;

elem.querySelector('.modal-ok').addEventListener('click', () => onChoice(true));
elem.querySelector('.modal-cancel').addEventListener('click', () => onChoice(false));

const msg = elem.querySelector('p');
let onChoice = null;

export function showModal(message) {
    msg.textContent = message;
    document.body.appendChild(elem);
    
    return new Promise(callback => {
        onChoice = (choice) => {
            clear();
            callback(choice);
        };
    });
}

export function clear() {
    elem.remove();
}