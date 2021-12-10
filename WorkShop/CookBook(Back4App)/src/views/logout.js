import { logout } from '../api/user.js';

export async function logoutPage(ctx) {
    await logout();
    ctx.updateSession();
    ctx.updateUserNav();
    ctx.page.redirect('/');
}