import { getUserData, setUserData, clearUserData } from '../userdata.js';

const host = 'http://localhost:3030';

async function request(url, options) {
    try {
        const response = await fetch(host + url, options);

        if (response.ok != true) {
            if (response.status == 403) {
                sessionStorage.removeItem('userData');
            }
            const error = await response.json();
            throw new Error(error.message);
        }

        try {
            return await response.json();
        } catch(err) {
            return response;
        }
        
    } catch (err) {
        alert(err.message);
        throw err;
    }
}

function createOptions(method, data) {
    const options = { method, headers: {} };

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const user = getUserData();
    if(user) {
        options.headers['X-Authorization'] = user.token;
    }
    return options;
}

async function get(url) {
    return request(url, createOptions('GET'));
}

async function post(url, data) {
    return request(url, createOptions('POST', data));
}

async function edit(url, data) {
    return request(url, createOptions('PUT', data));
}

async function del(url) {
    return request(url, createOptions('DELETE'));
}

async function login(username, password) {
    const result = await post('/users/login', {username, password});
    setUserData({
        username: result.username,
        id: result._id,
        token: result.accessToken
    });
    return result;
}

async function register(username, password) {
    const result = await post('/users/register', {username, password});
    setUserData({
        username: result.username,
        id: result._id,
        token: result.accessToken
    });
    return result;
}

async function logout() {
    get('/users/logout');
    clearUserData();
}

export {
    get,
    post,
    edit,
    del,
    login,
    register,
    logout
};