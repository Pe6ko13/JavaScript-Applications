import { page } from '../src/library.js';
import decorateContext from './middleware/render.js';
import addSession from './middleware/session.js';
import notify from './middleware/notify.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { logoutPage } from './views/logout.js';

page(addSession());
page(decorateContext());
page(notify());
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/catalog', catalogPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/logout', logoutPage);

page.start();
