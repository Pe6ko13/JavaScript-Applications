function setUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

function clearUserData() {
    sessionStorage.removeItem('userData');
}

export {
    getUserData,
    setUserData,
    clearUserData
};