import pa11y from 'pa11y';
import puppeteer from 'puppeteer';
import cliReporter from 'pa11y-reporter-cli';

const standard = process.argv[2] || 'WCAG2A';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.type('input[placeholder="Email"]', 'jfc@di.uminho.pt');
await page.type('input[placeholder="Password"]', 'WD09OYLH');

const loginButton = await page.$('button.button');
await loginButton.click();

await page.waitForFunction('window.location.href.includes("/SolveProblems")');
await page.waitForSelector('#solve-problems-main', { visible: true });

const manageShitsButton = await page.$('a[href="/ManageShifts"]');
await manageShitsButton.click();

await page.waitForFunction('window.location.href.includes("/ManageShifts")');
await page.waitForSelector('#manage-shifts-sidebar-main', { visible: true });

// Teste
const results = await pa11y(page.url(), {
  browser,
  page,
  standard: standard
});

const output = await cliReporter.results(results);
console.log(output);
await browser.close();
