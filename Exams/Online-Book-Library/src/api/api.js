import { getUserData, setUserData, clearUserData} from '../util.js';

const host = 'http://localhost:3030';

async function request(url, option) {
    try {
        const res = await fetch(host + url, option);

        if (res.ok == false) {
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
    if(userData) {
        options.headers['X-Authorization'] = userData.token;
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
        email: result.email,
        id: result._id,
        token: result.accessToken
    };
    setUserData(userData);
    return result;
}

async function register(email, password) {
    const result = await post('/users/register', { email, password });
    const userData = {
        email: result.email,
        id: result._id,
        token: result.accessToken
    };
    setUserData(userData);
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