const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Display correct title on the home page', function () {
  let driver;
  this.timeout(30000);

  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().addArguments('--headless'))
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the correct title on the home page', async function () {

    await driver.get('http://localhost:5173'); // --> change this each run
    const title = await driver.getTitle();
    const expectedTitle = 'VetCare'; 
    assert.strictEqual(title, expectedTitle, `Expected title to be "${expectedTitle}", but got "${title}"`);
  });
});
