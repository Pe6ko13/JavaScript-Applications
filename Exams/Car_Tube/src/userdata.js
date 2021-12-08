export const setUserData = (data) => {
    sessionStorage.setItem('userData', JSON.stringify(data));
};

export const getUserData = () => {
    return JSON.parse(sessionStorage.getItem('userData'));
};

export const clearUserData = () => sessionStorage.removeItem('userData');
