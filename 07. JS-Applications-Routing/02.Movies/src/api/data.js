import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const endpoint = {
    allMovies: '/data/movies',
    moveById: '/data/movies/'
};

export async function getAllMovies() {
    return api.get(endpoint.allMovies);
}

export async function getMovieById(id) {
    return api.get(endpoint.moveById + id);
}