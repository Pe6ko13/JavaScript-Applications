const { chromium, request } = require('playwright-chromium');

const { expect } = require('chai');

let browser, page;

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

let testMessages = {
    1: {
        author: 'Pesho',
        content: 'My message'
    }
};

let testCreateMessage = {
    2: {
        author: 'Gosho',
        content: 'Goshos message',
        _id: 2
    }
};

describe('E2E tests', async function () {
    this.timeout(5000);

    before(async () => { browser = await chromium.launch({headless: false, slowMo: 500}); });
    after(async () => { await browser.close(); });
    beforeEach(async () => { page = await browser.newPage(); });
    afterEach(async () => { await page.close(); });

    describe('load messages', () => {
        it ('it should call server', async () => {
            await page.route('**/jsonstore/messenger', route => route.fulfill(fakeResponse(testMessages)));
            await page.goto('http://127.0.0.1:3030/01.Messenger/');

            const [response] = await Promise.all([
                page.click('#refresh'),
                page.waitForRequest('**/jsonstore/messenger')

            ]);

            let result = await response.json();
            expect(result).to.be.eql(testMessages);
        });

        it ('should show data', async () => {
            await page.route('**/jsonstore/messenger', route => route.fulfill(fakeResponse(testMessages)));
            await page.goto('http://127.0.0.1:3030/01.Messenger/');

            const [response] = await Promise.all([
                page.click('#refresh'),
                page.waitForRequest('**/jsonstore/messenger')

            ]);

            const content = await page.$eval('#messages', (m) => m.value);
            let text = Object.values(testMessages).map(x => `${x.author}: ${x.content}`).join('\n');
            expect(content).to.be.eql(text);
        });
    });

    describe('create message', () => {
        it ('it should call server', async () => {
            let appRequest = undefined;
            let expected = {
                author: 'Gosho',
                content: 'Goshos message'
            };

            await page.route('**/jsonstore/messenger', (route, request) => {
                if(request.method().toLowerCase() === 'post') {
                    appRequest = request.postData();
                    route.fulfill(fakeResponse(testCreateMessage));
                }
            });
            
            await page.goto('http://127.0.0.1:3030/01.Messenger/');
            await page.fill('#author', 'Gosho');
            await page.fill('#content', 'Goshos message');


            const [response] = await Promise.all([
                page.click('#submit'),
                page.waitForRequest('**/jsonstore/messenger')
                
            ]);
            
            let result = JSON.parse(appRequest);
            expect(result).to.be.eql(expected);
        });

    });
});