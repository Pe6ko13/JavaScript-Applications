const host = 'http://localhost:3030';

async function request(url, option) {
    try {
        const res = await fetch(host + url, option);

        if (res.ok != true) {
            if (res.status == 403) {
                sessionStorage.removeItem('userData');
            }
            const error = await res.json();
            throw new Error(error.message);
        }

        if (res.status == 204) {
            return res;
        } else {
            return res.json();
        }
    } catch (err) {
        alert(err.message);
        throw err;
    }
}

function createOptions(method = 'get', data) {
    const option = {
        method,
        headers: {}
    };

    if (data != undefined) {
        option.headers['Content-Type'] = 'application/json';
        option.body = JSON.stringify(data);
    }

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData != null) {
        option.headers['X-Authorization'] = userData.token;
    }

    return option;
}

async function get(url) {
    return request(url, createOptions());
}

async function post(url, data) {
    return request(url, createOptions('post', data));
}

async function put(url, data) {
    return request(url, createOptions('put', data));
}

async function del(url) {
    return request(url, createOptions('delete'));
}

async function login(email, password) {
    const res = await request('/users/login', createOptions('post', { email, password }));
    const userData = {
        email: res.email,
        id: res._id,
        token: userData.accessToken
    };
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

async function register(email, password) {
    const res = await post('/users/register', {email, password});
    const userData = {
        email: res.email,
        id: res._id,
        token: userData.accessToken
    };
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

async function logout() {
    await request('/users/logout', createOptions());
    sessionStorage.removeItem('userData');
}

export {
    get,
    post,
    put,
    del,
    login,
    register,
    logout
};