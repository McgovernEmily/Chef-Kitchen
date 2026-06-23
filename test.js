import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  
  const checkPage = async (url) => {
    console.log(`Checking ${url}...`);
    const page = await browser.newPage();
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.close();
  };

  await checkPage('http://localhost:3000/mealplanner.html');
  await checkPage('http://localhost:3000/mealfinder.html');
  await checkPage('http://localhost:3000/index.html');
  
  await browser.close();
})();
