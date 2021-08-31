const puppeteer = require('puppeteer')

export async function clima(location){

    //abre un navegador
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'] //argumento para poder abrir chrome dentro de un container
    })

    const page = await browser.newPage()

    //idioma de la pagina en espaniol
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'es'
    });

    //navega hacia el url pasado por argumento
    await page.goto('https://www.google.com.uy/search?q=clima+'+location+'&oq=clima&aqs=chrome..69i57j69i59l2.1797j0j1&sourceid=chrome&ie=UTF-8')
    
    //espera a que un selector especifico cargue
    await page.waitForSelector('[class="vk_bk TylWce"]')

    //evalua la informacion obtenida de la pagina
    const temp = await page.evaluate(() => {

        const estado = document.querySelector('[id="wob_dcp"] span').innerHTML //obtiene la condicion del dia
        const grados = document.querySelector('div [class="vk_bk TylWce"] span').innerHTML //obtiene la temperatura

        return 'Afuera esta '+estado.toLowerCase()+' con '+grados+'°C.'
    
    })

    //cierra el navegador
    await browser.close()

    return temp
}

export async function horoscopo(signo){

    const link = 'https://www.montevideo.com.uy/horoscopo/apreds.aspx?'+signo+',,4'

    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    })

    const page = await browser.newPage()

    await page.goto(link)

    const dia = await page.evaluate(() => {

        const estado = document.querySelector('[itemprop="description"] em').innerHTML //obtiene el horoscopo del dia segun el signo

        return estado
    
    })

    await browser.close()

    return 'El horoscopo del dia: '+dia + '\n' + link

}