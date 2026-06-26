import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:3000/mealplanner.html', { waitUntil: 'networkidle0' });
  
  // Try to find the Add Suggestion button and click it
  await page.waitForSelector('.suggestion-button');
  await page.click('.suggestion-button');
  
  // Wait for dialog to open
  await page.waitForSelector('#suggestion-dialog[open]');
  
  // Click submit
  await page.click('.dialog-submit-btn');
  
  // Wait a bit to see if there are errors
  await new Promise(r => setTimeout(r, 1000));
  
  const cardHtml = await page.evaluate(() => {
    return document.querySelector('#breakfast').innerHTML;
  });
  console.log('Breakfast HTML:', cardHtml);
  
  await browser.close();
})();
