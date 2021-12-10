import { notify } from '../lib/notify.js';
import { getUserData } from '../util.js';

const hostname = 'https://parseapi.back4app.com';

async function request(url, options) {
    try {
        const res = await fetch(hostname + url, options);

        if (res.ok == false) {
            const error = await res.json();
            throw {
                message: error.error,
                code: error.code
            };
        }

        return res.json();
        
    } catch (err) {
        notify(err.message);
        throw err;
    }
}

function cretaeOption(method = 'get', data) {
    const options = {
        method,
        headers: {
            "X-Parse-Application-Id": "Tj7twquhKYFF3u8pbs9iiTCgEhRc730IfkO4beOd",
            "X-Parse-REST-API-Key": "uV8B7IvS3eKhuFgdwf3gRYdSlDj89xI7tq1mKQdG",
        }
    };

    if(data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const user = getUserData();
    if (user) {
        options.headers['X-Parse-Session-Token'] = user.token;
    }

    return options;
}

export async function get(url) {
    return request(url, cretaeOption());
}

export async function post(url, data) {
    return request(url, cretaeOption('post', data));
}

export async function put(url, data) {
    return request(url, cretaeOption('put', data));
}

export async function del(url) {
    return request(url, cretaeOption('delete'));
}