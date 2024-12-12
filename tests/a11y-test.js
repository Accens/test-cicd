const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const assert = require('assert');

describe('Accessibility test with Playwright and Axe', function() {
    let browser, page;

    before(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
    });


    after(async () => {
        await page.close();
        await browser.close();
    });


    it('should have no serious accessibility violations on home', async function() {
        await page.goto('http://localhost:3000');
        // Run the accessibility test using the reusable function
        await runAxeAccessibilityTest(page);
    });


    it('should have no serious accessibility violations on revalidation', async function() {
        await page.goto('http://localhost:3000/revalidation');
        // Run the accessibility test using the reusable function
        await runAxeAccessibilityTest(page);
    });


    it('should have no serious accessibility violations on image-cdn', async function() {
        await page.goto('http://localhost:3000/image-cdn');
        // Run the accessibility test using the reusable function
        await runAxeAccessibilityTest(page);
    });

});


// Reusable function for running accessibility checks
async function runAxeAccessibilityTest(page) {
    let results = await new AxeBuilder({ page }).analyze();
    // Check for serious violations
    const seriousViolations = results.violations.filter(
        (violation) => violation.impact === 'serious'
    );

    // Assert that there are no serious violations
    assert.strictEqual(
        seriousViolations.length,
        0,
        `Found serious accessibility violations: ${JSON.stringify(
            seriousViolations,
            null,
            2
        )}`
    );
}