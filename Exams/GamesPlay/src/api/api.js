import { clearUserData, getUserData } from '../utils.js';

const host = 'http://localhost:3030';

async function request(url, options) {
    try {
        const res = await fetch(host + url, options);

        if (res.ok == false) {
            if (res.status == 403) {
                clearUserData();
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

function createOptions(method, data) {
    const options = {method, headers: {}};

    if(data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const user = getUserData();
    if (user) {
        options.headers['X-Authorization'] = user.token;
    }
    return options;
}

export async function get(url) {
    return request(url, createOptions('GET'));
}

export async function post(url, data) {
    return request(url, createOptions('POST', data));
}

export async function edit(url, data) {
    return request(url, createOptions('PUT', data));
}

export async function del(url) {
    return request(url, createOptions('DELETE'));
}