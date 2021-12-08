let userData = null;

window.addEventListener('DOMContentLoaded', () => {
    userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData != null) {
        document.getElementById('guest').style.display = 'none';
        document.querySelector('#addForm .add').disabled = false;
        document.getElementById('logout').addEventListener('click', logout);
        document.querySelector('.email span').textContent = userData.email;
        document.querySelector('.load').addEventListener('click', loadData);

    } else {
        document.getElementById('user').style.display = 'none';
    }

    const catchesEl = document.querySelector('#catches');
    catchesEl.querySelectorAll('div').forEach(div => div.remove());

    document.getElementById('addForm').addEventListener('submit', addCatch);
    const divCatches = document.querySelector('#catches');
    divCatches.addEventListener('click', buttonFunc);
});

function buttonFunc(e) {
    if (e.target.textContent == 'Update') {
        updateCatch(e);
    } else if (e.target.textContent == 'Delete') {
        deleteCatch(e);
    }
}

async function updateCatch(e) {
    const inputData = e.target.parentNode.querySelectorAll('input');
    let [angler, weight, species, location, bait, captureTime] = inputData;
    const catchesInfo = {
        angler: angler.value,
        weight: weight.value,
        species: species.value,
        location: location.value,
        bait: bait.value,
        captureTime: captureTime.value
    };

    const id = e.target.getAttribute('data-id');
    const token = userData.token;

    try {
        if (Object.values(catchesInfo).some(x => x == '')) {
            throw new Error('All fields must be filled!');
        }
        const res = await fetch('http://localhost:3030/data/catches/' + id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(catchesInfo)
        });

        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }
    } catch (err) {
        alert(err.message);
    }
}

async function deleteCatch(e) {
    const id = e.target.getAttribute('data-id');
    const token = userData.token;

    try {
        const res = await fetch('http://localhost:3030/data/catches/' + id, {
            method: 'delete',
            headers: {
                'X-Authorization': token
            }
        });

        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }
    } catch (err) {
        alert(err.message);
    }

    e.target.parentElement.remove();
}

async function addCatch(e) {
    e.preventDefault();
    if(!userData) {
        window.location = 'login.html';
        return;
    }

    const formData = new FormData(e.target);

    const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, {[k]: v}), {});
    
    try {
        if (Object.values(data).some(x => x == '')) {
            throw new Error('All fields must be filled!');
        }

        const res = await fetch('http://localhost:3030/data/catches', {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            method: 'post',
            body: JSON.stringify(data)
        });

        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        loadData();
        e.target.reset();

    } catch(err) {
        alert(err.message);
    }
}

async function loadData() {
    const res = await fetch('http://localhost:3030/data/catches');
    const data = await res.json();
    
    document.getElementById('catches').replaceChildren(...data.map(createCatch));
}

function createCatch(item) {
    const isOwner = (userData && item._ownerId == userData.id);

    const catchDiv = document.createElement('div');
    catchDiv.className = 'catch';
    catchDiv.innerHTML = 
        `<label>Angler</label>
        <input type="text" class="angler" value="${item.angler}" ${!isOwner ? 'disabled' : ''}>
        <label>Weight</label>
        <input type="text" class="weight" value="${item.weight}" ${!isOwner ? 'disabled' : ''}>
        <label>Species</label>
        <input type="text" class="species" value="${item.species}" ${!isOwner ? 'disabled' : ''}>
        <label>Location</label>
        <input type="text" class="location" value="${item.location}" ${!isOwner ? 'disabled' : ''}>
        <label>Bait</label>
        <input type="text" class="bait" value="${item.bait}" ${!isOwner ? 'disabled' : ''}>
        <label>Capture Time</label>
        <input type="number" class="captureTime" value="${item.captureTime}" ${!isOwner ? 'disabled' : ''}>
        <button class="update" data-id="${item._id}" ${!isOwner ? 'disabled' : ''}>Update</button>
        <button class="delete" data-id="${item._id}" ${!isOwner ? 'disabled' : ''}>Delete</button>`;

    return catchDiv;
}

function logout() {
    fetch('http://localhost:3030/users/logout', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': userData.token
        }
    });

    sessionStorage.clear();
    window.location = 'index.html';
}