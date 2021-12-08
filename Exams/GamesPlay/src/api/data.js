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

export async function register(email, password) {
    const user = await api.post('/users/register', {email, password});
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

export async function getAllGames(more) {
    if (more) {
        return api.get(`/data/games?sortBy=_createdOn%20desc${more}`);
    } else {
        return api.get('/data/games?sortBy=_createdOn%20desc');
    }
}

export async function getGameById(id) {
    return api.get('/data/games/' + id);
}

export async function createGame(game) {
    return api.post('/data/games', game);
}

export async function editGame(id, game) {
    return api.edit('/data/games/' + id, game);
}

export async function deleteGame(id) {
    return api.del('/data/games/' + id);
}

export async function getComments(gameId) {
    return api.get(`/data/comments?where=gameId%3D%22${gameId}%22`);
}

export async function postComment(comment) {
    return api.post('/data/comments', comment);
}