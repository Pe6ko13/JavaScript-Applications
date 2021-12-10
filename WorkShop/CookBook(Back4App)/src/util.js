function setUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
}

function getUserData() {
    return JSON.parse(localStorage.getItem('userData'));
}

function clearUserData() {
    localStorage.removeItem('userData');
}

function createSubmitHandler(callback, ...fields) {
    return function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = fields.reduce((a, c) => Object.assign(a, { [c]: formData.get(c).trim()}), {});

        callback(data, e);
    };
}

function parseQuery(querystring) {
    if (querystring == '') {
        return {};
    } else {
        return querystring.split('&').reduce((a, c) => {
            const [k, v] = c.split('=');
            a[k] = v;
            return a;
        }, {});
    }
    
}

export {
    getUserData,
    setUserData,
    clearUserData,
    createSubmitHandler,
    parseQuery
};