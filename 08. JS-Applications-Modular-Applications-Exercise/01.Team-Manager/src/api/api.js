import { clearUserData, getUserData, setUserData } from '../util.js';


const host = 'http://localhost:3030';

async function request(url, options) {
    try {
        const response = await fetch(host + url, options);
        if(response.ok != true) {
            if(response.status == 403) {
                clearUserData();
            }
            const error = await response.json();
            throw new Error(error.message);
        }
        
        if(response.status == 204) {
            return response;
        } else {
            return response.json();
        }

    } catch (err) {
        alert(err.message);
        throw err;
    }
};

function createOption(method = 'get', data) {
    const options = {
        method,
        headers: {}
    };

    if(data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const userData = getUserData();
    if(userData != null) {
        options.headers['X-Authorization'] = userData.authToken;
    }
    return options;
}

async function get(url) {
    return request(url, createOption());
}

async function post(url, data) {
    return request(url, createOption('post', data));
}

async function edit(url, data) {
    return request(url, createOption('put', data));
}

async function del(url) {
    return request(url, createOption('delete'));
}

async function login(email, password) {
    const result = await post('/users/login', {email, password});
    const userData = {
        username: result.username,
        userId: result._id,
        authToken: result.accessToken
    };
    setUserData(userData);
}

async function register(email, username, password) {
    const result = await post('/users/register', {email, username, password});
    const userData = {
        username: result.username,
        useId: result._id,
        authToken: result.accessToken
    };
    setUserData(userData);
}

async function logout() {
    await get('/users/logout');
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