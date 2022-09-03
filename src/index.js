const { webkit } = require('playwright');

(async() => {

    const browser = await webkit.launch({headless:true}); //{headless: false}
    const page = await browser.newPage();
     
    await page.goto('https://www.bet365.com/#/HO/');

    await page.waitForLoadState('networkidle');

    await page.locator('text=Aceitar').click();
    await page.locator('.hm-MainHeaderCentreWide > div:nth-child(2) > div').click();
    await page.waitForURL('https://www.bet365.com/#/IP/B1');

    await page.locator('.iip-IntroductoryPopup_Cross').click();
    
    let teamInformation = async () => {

        let firstTeamName = await page.locator('.ovm-FixtureDetailsTwoWay_TeamsWrapper > div:nth-child(1)').allTextContents();
        let secondTeamName = await page.locator('.ovm-FixtureDetailsTwoWay_TeamsWrapper > div:nth-child(2)').allTextContents();
    
        let firstScoreTeam = await page.locator('.ovm-StandardScoresSoccer_TeamOne').allTextContents();        
        let secondScoreTeam = await page.locator('.ovm-StandardScoresSoccer_TeamTwo').allTextContents();   
    
        let firstTeamOdd = await page.locator('.ovm-HorizontalMarket_Participants > div:nth-child(1)').allTextContents(); 
        let secondTeamOdd = await page.locator('.ovm-HorizontalMarket_Participants > div:nth-child(3)').allTextContents();
    
        return {
            firstTeamName,
            secondTeamName,
            firstScoreTeam,
            secondScoreTeam,
            firstTeamOdd,
            secondTeamOdd
        }
    
    };

    let popup = async () => {

        await page.waitForTimeout(5000);

        let countCorners = await page.locator('.ovm-StatsIcon').count();

        for (let i = 0; i < countCorners; ++i){
            
            await page.locator('.ovm-StatsIcon').nth(i).click();

            await page.waitForTimeout(500);

            let dataTeamInformation = await teamInformation();
            
            let cornersTeamOne; 
            let cornersTeamTwo;

            if(await page.locator('.oss-SoccerStatsCell_Label').count() != 16){
                cornersTeamOne = await page.locator('div:nth-child(2) > div:nth-child(6) > .oss-SoccerStatsCell_Label').allTextContents();
                cornersTeamTwo = await page.locator('div:nth-child(3) > div:nth-child(6) > .oss-SoccerStatsCell_Label').allTextContents();
            } else {
                cornersTeamOne = await page.locator('div:nth-child(2) > div:nth-child(7) > .oss-SoccerStatsCell_Label').allTextContents();
                cornersTeamTwo = await page.locator('div:nth-child(3) > div:nth-child(7) > .oss-SoccerStatsCell_Label').allTextContents();    
            }

            let totalCorners = Number(cornersTeamOne) + Number(cornersTeamTwo);

            console.log(`${dataTeamInformation.firstTeamName[i]}: ${cornersTeamOne} - corners ⛳️`);
            console.log(`${dataTeamInformation.secondTeamName[i]}: ${cornersTeamTwo} - corners ⛳️`);
            console.log(`Total corners: ${totalCorners}`);
            console.log("---------------");

            await page.locator('.g5-PopupManager_ClickMask').click();

        }
    };

    console.log(await popup());

    await browser.close();

})();