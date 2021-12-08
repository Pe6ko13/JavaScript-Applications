window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', onLogin);
});

async function onLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch('http://localhost:3030/users/login', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        if (response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        const user = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        };

        sessionStorage.setItem('user', JSON.stringify(user));
        window.location = 'index.html';

    } catch (err) {
        alert(err.message);
    }
}