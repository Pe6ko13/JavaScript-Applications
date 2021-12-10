import * as api from './api.js';
import { addOwner, createQuery } from './data.js';

const pageSize = 5;

const endpoints = {
    recent: '/classes/Recipe?limit=3&order=-createdAt',
    recipes: (page) => `/classes/Recipe?skip=${(page - 1) * pageSize}&limit=${pageSize}`,
    recipeSearch: (page, query) => `/classes/Recipe?where=${createQuery(query)}&skip=${(page - 1) * pageSize}&limit=${pageSize}`,
    recipeDetails: (id) => `/classes/Recipe/${id}?include=owner`,
    createRecipe: '/classes/Recipe',
    recipeById: '/classes/Recipe/',
};

export async function getRecipes(page, query) {
    if (query) {
        query = {
            name: {
                $text: {
                    $search: {$term: query}
                }
            }
        };
        return api.get(endpoints.recipeSearch(page, query));
    } else {
        return api.get(endpoints.recipes(page));
    }

}

export async function getRecentRecipes() {
    return api.get(endpoints.recent);
}

export async function getRecipeById(id) {
    return api.get(endpoints.recipeDetails(id));
}

export async function createRecipe(recipe) {
    addOwner(recipe);
    return api.post(endpoints.createRecipe, recipe);
}

export async function updateRecipe(id, recipe) {
    return api.put(endpoints.recipeById + id, recipe);
}

export async function deleteRecipe(id) {
    return api.del(endpoints.recipeById + id);
}