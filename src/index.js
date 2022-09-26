const { webkit } = require('playwright');

(async () => {

    const browser = await webkit.launch({headless:false}); //{headless: false}
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

        // for (let i = 0; i < countCorners; ++i){
            let p = 1
            await page.locator('.ovm-StatsIcon').nth(p).click();
            
            await page.waitForTimeout(100);

            let dataTeamInformation = await teamInformation();
            
            let cornersTeamOne; 
            let cornersTeamTwo;

            const observerOptions = {
                subtree:true,
                characterData:true,
                characterDataOldValue:true
            }

                if(await page.locator('.oss-SoccerStatsCell_Label').count() != 16){
                    await page.evaluate( async ({observerOptions}) => {
                        const observerTeamHome = new MutationObserver( async (changes) => {
                            cornersTeamTwo = document.querySelector('div:nth-child(3) > div:nth-child(3) > .oss-SoccerStatsCell_Label').innerHTML
                            for(let change of changes){
                                if (change.type === 'characterData') {
                                    console.log(`home team corner: [${change.target.textContent}]⛳️`)
                                    console.log(`away team corner: ${cornersTeamTwo}⛳️`)
                                }
                            }
                        })
                        const observerTeamOut = new MutationObserver( async (changes) => {
                            cornersTeamOne = document.querySelector('div:nth-child(2) > div:nth-child(3) > .oss-SoccerStatsCell_Label').innerHTML
                            for(let change of changes){
                                if (change.type === 'characterData') {
                                    console.log(`home team corner: ${cornersTeamOne}⛳️`)
                                    console.log(`away team corner: [${change.target.textContent}]⛳️`)
                                }
                            }
                        })

                        cornersTeamOne = document.querySelector('div:nth-child(2) > div:nth-child(3) > .oss-SoccerStatsCell_Label')
                        cornersTeamTwo = document.querySelector('div:nth-child(3) > div:nth-child(3) > .oss-SoccerStatsCell_Label')

                        observerTeamHome.observe(cornersTeamOne, observerOptions)
                        observerTeamOut.observe(cornersTeamTwo, observerOptions)
                    }, {observerOptions})

                } else {
                    await page.evaluate( async ({observerOptions}) => {
                        const observerTeamHome = new MutationObserver( async (changes) => {
                            cornersTeamTwo = document.querySelector('div:nth-child(3) > div:nth-child(3) > .oss-SoccerStatsCell_Label').innerHTML
                            for(let change of changes){
                                if (change.type === 'characterData') {
                                    console.log(`home team corner: [${change.target.textContent}]⛳️`)
                                    console.log(`away team corner: ${cornersTeamTwo}⛳️`)
                                }
                            }
                        })
                        const observerTeamOut = new MutationObserver( async (changes) => {
                            cornersTeamOne = document.querySelector('div:nth-child(2) > div:nth-child(3) > .oss-SoccerStatsCell_Label').innerHTML
                            for(let change of changes){
                                if (change.type === 'characterData') {
                                    console.log(`home team corner: ${cornersTeamOne}⛳️`)
                                    console.log(`away team corner: [${change.target.textContent}]⛳️`)
                                }
                            }
                        })

                        cornersTeamOne = document.querySelector('div:nth-child(2) > div:nth-child(3) > .oss-SoccerStatsCell_Label')
                        cornersTeamTwo = document.querySelector('div:nth-child(3) > div:nth-child(3) > .oss-SoccerStatsCell_Label')

                        observerTeamHome.observe(cornersTeamOne, observerOptions)
                        observerTeamOut.observe(cornersTeamTwo, observerOptions)
                    }, {observerOptions})

                }

            // await page.locator('.g5-PopupManager_ClickMask').click();

        // }
    }

    await popup();

    // await browser.close();

})();