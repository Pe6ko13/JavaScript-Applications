import * as api from './api.js';
import { addOwner, createPointer, createPointerQuery } from './data.js';

const endpoints = {
    comments: '/classes/Comment',
    commentsByRecipe: (recipeId) => `/classes/Comment?where=${createPointerQuery('recipe', 'Recipe', recipeId)}&include=owner&order=-createdAt` 
};

export function getCommentsByRecipeId(recipeId) {
    return api.get(endpoints.commentsByRecipe(recipeId));
}

export function createComment(recipeId, comment) {
    comment.recipe = createPointer('Recipe', recipeId);
    addOwner(comment);
    return api.post(endpoints.comments, comment);
}

