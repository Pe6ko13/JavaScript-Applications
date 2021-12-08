import { logout } from '../api/data.js';

export async function logoutPage(ctx) {
    logout();
    ctx.page.redirect('/');
}