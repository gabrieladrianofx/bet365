const { webkit } = require('playwright')

const child_process = require('child_process')

;
(async () => {
    
    const browser = await webkit.launch({headless:true}); //{headless: false}
    const page = await browser.newPage();
     
    await page.goto('https://www.bet365.com/#/HO/');

    await page.waitForLoadState('networkidle');

    await page.locator('text=Aceitar').click();
    await page.locator('.hm-MainHeaderCentreWide > div:nth-child(2) > div').click();
    await page.waitForURL('https://www.bet365.com/#/IP/B1');

    await page.locator('.iip-IntroductoryPopup_Cross').click();

    await page.waitForTimeout(5000);
        
    let countCorners = await page.locator('.ovm-StatsIcon').count();
    countCorners = 1

    for (let i = 0; i < countCorners; ++i){

        const worker = child_process.fork(`${__dirname}/worker.js`, [])

        worker.on('message', msg => console.log('sucess', msg));
        worker.on('error', msg => console.log('error', msg));

        worker.send(i);
        
    }
    
    await browser.close();

})()
