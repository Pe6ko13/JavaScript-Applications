const { chromium, request } = require('playwright-chromium');
const { expect, assert } = require('chai');

let mochData = {
    1: {
        author: 'J.K.Rowling',
        title: 'Harry Potter'
    },
    2: {
        author: 'S.Nakov',
        title: 'C# Fundamentals'
    }
};

function fakeResponse(data) {
    return {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
}

describe('Test', async function() {
    this.timeout(6000);

    let page, browser;

    before(async () => { browser = await chromium.launch({headless: false, slowMo: 500}); });
    after(async () => { await browser.close(); });
    beforeEach(async () => { page = await browser.newPage(); });
    afterEach(async () => { await page.close(); });

    it('load all books', async () => {
        await page.route('**/jsonstore/collections/books*', route => {
            route.fulfill(fakeResponse(mochData));
        });
        await page.goto('http://127.0.0.1:5501/02.Book-Library/');
        await page.click('text=Load All Books');

        await page.waitForSelector('text=Harry Potter');

        const rows = await page.$$eval('tr', (rows) => rows.map(r => r.textContent.trim()));
        expect(rows[1]).to.contains('Harry Potter');
        expect(rows[1]).to.contains('Rowling');
        expect(rows[2]).to.contains('C# Fundamentals');
        expect(rows[2]).to.contains('Nakov');
    });

    it('can create book', async () => {
        await page.goto('http://127.0.0.1:5501/02.Book-Library/');

        await page.fill('form#createForm >> input[name="title"]', 'Title');
        await page.fill('form#createForm >> input[name="author"]', 'Author');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'POST'),
            page.click('form#createForm >> text=Submit')
        ]);

        const data = JSON.parse(request.postData());
        expect(data.title).to.equal('Title');
        expect(data.author).to.equal('Author');
    });

    it('can edit a book', async () => {
        await page.goto('http://127.0.0.1:5501/02.Book-Library/');
        await Promise.all([
            page.click('text=LOAD ALL BOOKS'),
            page.click('.editBtn'),
        ]);

        await page.fill('#editForm input[name="title"]', 'Hell');
        await page.fill('#editForm input[name="author"]', 'Gosh');

        await page.click('text=Save');
        await page.click('text=LOAD ALL BOOKS');

        const content = await page.textContent('table tbody');

        expect(content).to.contain('Hell');
        expect(content).to.contain('Gosh');
    });

    it('delete book', async () => {
        await page.goto('http://127.0.0.1:5501/02.Book-Library/');
        
        await Promise.all([
            page.click('text=LOAD ALL BOOKS'),
            page.click('.deleteBtn'),
            page.on('dialog', dialog => dialog.accept())
        ]);
        
        await page.click('text=LOAD ALL BOOKS');
        const content = await page.textContent('table tbody');
        expect(content).not.to.contain('J.K.Rowling');
    });
});