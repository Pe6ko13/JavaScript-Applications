window.addEventListener('DOMContentLoaded', ()=> {
    const form = document.querySelector('form');
    form.addEventListener('submit', regUser);
});

async function regUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    try {
        if (email == '' || password == '') {
            throw new Error('All field must be filled!');
        } else if (password != rePass) {
            throw new Error("Passwords don't match!");
        }

        const res = await fetch('http://localhost:3030/users/register', { 
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (res.ok != true) {
            const error = await res.json();
            return alert(error.message);
        }

        const data = await res.json();
        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        };

        sessionStorage.setItem('userData', JSON.stringify(userData));
        window.location = 'login.html';

        alert('Registered successfully!');
        e.target.reset();
    }
    catch (error) {
        alert(error.message);
    }
}