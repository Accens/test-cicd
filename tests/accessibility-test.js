const { chromium } = require('playwright');
const axeCore = require('axe-core');
const assert = require('assert');

describe('Accessibility test with Playwright and Axe', function () {
  let browser, page;

  before(async () => {
    browser = await chromium.launch();
  });

  after(async () => {
    await browser.close();
  });

  it('should have no critical accessibility violations', async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');

    // Inject Axe script into the page
    await page.addScriptTag({ content: axeCore.source });

    // Run Axe analysis
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        window.axe.run((err, results) => {
          if (err) throw err;
          resolve(results);
        });
      });
    });

    // Log violations
    console.log('Accessibility violations:', results.violations);

    // Check for critical violations
    const criticalViolations = results.violations.filter(
      (violation) => violation.impact === 'critical'
    );
    assert.strictEqual(
      criticalViolations.length,
      0,
      `Found critical accessibility violations: ${JSON.stringify(
        criticalViolations,
        null,
        2
      )}`
    );

    await page.close();
  });
});
