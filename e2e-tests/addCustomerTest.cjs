const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Add Customer Test', function () {
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

  it('should add a new customer from the UI', async function () {
    await driver.get('http://localhost:5173/customers'); // --> change this each run

    const addCustomerButton = await driver.wait(until.elementLocated(By.id('add-customer')), 10000);
    await addCustomerButton.click();

    const nameField = await driver.wait(until.elementLocated(By.id('customer-name')), 10000);
    const emailField = await driver.wait(until.elementLocated(By.id('customer-email')), 10000);

    await nameField.sendKeys('Test Customer');
    await emailField.sendKeys('test@example.com');

    const submitButton = await driver.findElement(By.id('submit-customer'));
    await submitButton.click();

    const confirmation = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Customer added successfully')]")),
      10000
    );

    assert.ok(confirmation, 'Customer confirmation message not found');
  });
});
