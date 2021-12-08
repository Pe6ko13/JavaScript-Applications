import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const endpoint = {
    movies: '/data/movies'
};

export async function getAllMovies() {
    return api.get(endpoint.movies);
}