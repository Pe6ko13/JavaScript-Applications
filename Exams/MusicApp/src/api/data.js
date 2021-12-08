import { clearUserData, setUserData } from '../utils.js';
import * as api from './api.js';

export async function login(email, password) {
    const user = await api.post('/users/login', {email, password});
    setUserData({
        email: user.email,
        id: user._id,
        token: user.accessToken
    });
    return user;
}

export async function register( email, password ) {
    const user = await api.post('/users/register', { email, password });
    setUserData({
        email: user.email,
        id: user._id,
        token: user.accessToken
    });
    return user;
}

export async function logout() {
    api.get('/users/logout');
    clearUserData();
}

export async function getAllAlbums() {
   return api.get('/data/albums?sortBy=_createdOn%20desc&distinct=name');
}

export async function getAlbumById(id) {
    return api.get('/data/albums/' + id);
}

export async function createAlbum(album) {
    return api.post('/data/albums', album);
}

export async function editAlbum(id, album) {
    return api.edit('/data/albums/' + id, album);
}

export async function deleteAlbum(id) {
    return api.del('/data/albums/' + id);
}

export async function searchAlbum(query) {
    return api.get(`/data/albums?where=name%20LIKE%20%22${query}%22`);
}