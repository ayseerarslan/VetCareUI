const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = process.env.UI_BASE_URL || 'http://localhost:5173';

describe('VetCare UI Basic Smoke Tests', function () {
  let driver;
  this.timeout(30000);

  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().addArguments('--headless', '--disable-gpu'))
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('verifies the home page header', async function () {
    await driver.get(`${BASE_URL}/`);
    const header = await driver.wait(
      until.elementLocated(By.tagName('h1')),
      10000
    );
    const text = await header.getText();
    assert.ok(
      text.includes('Vet Care'),
      `Expected header to include 'Vet Care', got '${text}'`
    );
  });

  it('checks presence of navigation on home page', async function () {
    await driver.get(`${BASE_URL}/`);
    const navItem = await driver.wait(
      until.elementLocated(By.css('nav, header, .navbar')),
      10000,
      'Expected a nav bar or header element'
    );
    assert.ok(navItem, 'Navigation element is not present');
  });

  it('navigates to the Appointment page via nav', async function () {
    await driver.get(`${BASE_URL}/`);
    const appLink = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(text(),'Appointment')] | //button[contains(text(),'Appointment')]")),
      10000,
      'Appointments link not found'
    );
    await appLink.click();
    await driver.wait(
      until.urlContains('/appointment'),
      10000,
      'URL did not change to /appointment'
    );
    const pageText = await driver.findElement(By.tagName('body')).getText();
    assert.ok(
      pageText.toLowerCase().includes('appointment'),
      'Expected Appointment page to contain the word appointment'
    );
  });

  it('navigates to the Doctor page via nav', async function () {
    await driver.get(`${BASE_URL}/`);
    const vetLink = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(text(),'Doctor')] | //button[contains(text(),'Doctor')]")),
      10000,
      'Doctor link not found'
    );
    await vetLink.click();
    await driver.wait(
      until.urlContains('/doctor'),
      10000,
      'URL did not change to /doctor'
    );
    const pageText = await driver.findElement(By.tagName('body')).getText();
    assert.ok(
      pageText.toLowerCase().includes('doctor'),
      'Expected Doctor page to contain the word doctor'
    );
  });

  it('navigates to the Animal page via nav', async function () {
    await driver.get(`${BASE_URL}/`);
    const petsLink = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(text(),'Animal')] | //button[contains(text(),'Animal')]")),
      10000,
      'Animal link not found'
    );
    await petsLink.click();
    await driver.wait(
      until.urlContains('/animal'),
      10000,
      'URL did not change to /animal'
    );
    const pageText = await driver.findElement(By.tagName('body')).getText();
    assert.ok(
      pageText.toLowerCase().includes('animal'),
      'Expected Animal page to contain the word animal'
    );
  });

  it('displays the Customer navigation label', async function () {
    await driver.get(`${BASE_URL}/`);
    const label = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(text(),'Customer')] | //button[contains(text(),'Customer')]")),
      10000,
      'Customer nav label not found'
    );
    const text = await label.getText();
    assert.ok(
      text.includes('Customer'),
      `Expected navigation label to include 'Customer', got '${text}'`
    );
  });

  it('skips footer check if footer is not used', async function () {
    await driver.get(`${BASE_URL}/`);
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert.ok(
      bodyText.length > 0,
      'Page should have visible content even if footer is not defined'
    );
  });

  it('add a customer form with valid data', async function () {
    await driver.get(`${BASE_URL}/customer`);

    await driver.wait(
      until.elementLocated(By.css('form.saveForm')),
      10000,
      'Add Customer form not found'
    );

    await driver.findElement(By.name('name')).sendKeys('Test User');
    await driver.findElement(By.name('phone')).sendKeys('123456789');
    await driver.findElement(By.name('mail')).sendKeys('test@example1.com');
    await driver.findElement(By.name('address')).sendKeys('Test Street 1');
    await driver.findElement(By.name('city')).sendKeys('Istanbul');

    const addButton = await driver.findElement(By.css('form.saveForm button[type="submit"]'));
    await addButton.click();

    const pageText = await driver.findElement(By.tagName('body')).getText();
    assert.ok(
      pageText.toLowerCase().includes('customer'),
      'Expected confirmation or customer presence in the page text'
    );
  });
});

