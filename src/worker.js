const { webkit } = require('playwright')

const initialURI = 'https://www.bet365.com/#/HO/'
const finalURI = 'https://www.bet365.com/#/IP/B1'

async function render({index, initialURI, finalURI}) {
    const browser = await webkit.launch({headless:false}); //{headless: false}
    const page = await browser.newPage();
     
    await page.goto(initialURI);

    await page.waitForLoadState('networkidle');

    await page.locator('text=Aceitar').click();
    await page.locator('.hm-MainHeaderCentreWide > div:nth-child(2) > div').click();
    await page.waitForURL(finalURI);

    await page.locator('.iip-IntroductoryPopup_Cross').click();

    let teamInformation = async () => {

        let firstTeamName = page.locator('.ovm-FixtureDetailsTwoWay_TeamsWrapper > div:nth-child(1)').allTextContents();
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
    
    }

    await page.waitForTimeout(500);

    await page.locator('.ovm-StatsIcon').nth(index).click();

    await page.waitForTimeout(500);

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
                dataTeamInformation;
                cornersTeamTwo = document.querySelector('div:nth-child(3) > div:nth-child(3) > .oss-SoccerStatsCell_Label').innerHTML
                for(let change of changes){
                    if (change.type === 'characterData') {
                        console.log(`home team corner: [${change.target.textContent}]⛳️\naway team corner: ${cornersTeamTwo}⛳️`)
                    }
                }
            })
            const observerTeamOut = new MutationObserver( async (changes) => {
                dataTeamInformation;
                cornersTeamOne = document.querySelector('div:nth-child(2) > div:nth-child(3) > .oss-SoccerStatsCell_Label').innerHTML
                for(let change of changes){
                    if (change.type === 'characterData') {
                        console.log(`home team corner: ${cornersTeamOne}⛳️\naway team corner: [${change.target.textContent}]⛳️`)
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
                        console.log(`home team corner: [${change.target.textContent}]⛳️\naway team corner: ${cornersTeamTwo}⛳️`)
                    }
                }
            })
            const observerTeamOut = new MutationObserver( async (changes) => {
                cornersTeamOne = document.querySelector('div:nth-child(2) > div:nth-child(3) > .oss-SoccerStatsCell_Label').innerHTML
                for(let change of changes){
                    if (change.type === 'characterData') {
                        console.log(`home team corner: ${cornersTeamOne}⛳️\naway team corner: [${change.target.textContent}]⛳️`)
                    }
                }
            })

            cornersTeamOne = document.querySelector('div:nth-child(2) > div:nth-child(3) > .oss-SoccerStatsCell_Label')
            cornersTeamTwo = document.querySelector('div:nth-child(3) > div:nth-child(3) > .oss-SoccerStatsCell_Label')

            observerTeamHome.observe(cornersTeamOne, observerOptions)
            observerTeamOut.observe(cornersTeamTwo, observerOptions)
        }, {observerOptions})

    // await page.locator('.g5-PopupManager_ClickMask').click();
    }
}

async function main(message){
    try {
        const index = message
        await render({index, initialURI, finalURI})
        process.send(`| child process ${index} rodando`)
    } catch(error) {
        process.send(`| child process BROKEN! ${error}`)
    }

}

process.once("message", main)
