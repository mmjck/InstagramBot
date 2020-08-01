import puppeteer from 'puppeteer'


function count(arrobas: string[]) {
    var count: any = {}

    arrobas.forEach(function (arroba: string) {
        count[arroba] = (count[arroba] || 0) + 1;
    });

    return count;

}


function sort(counted: object) {
    const entries = Object.entries(counted);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted;
}



(async () => {

    async function loadMore(page: puppeteer.Page, selector: string) {


        const button = await page.$(selector);


        if (button) {
            console.log('Button More clicked ...')
            await button.click()

            await page.waitFor(selector, { timeout: 4000 }).catch((error) => {
                console.log(error)
            });

            await loadMore(page, selector)
        }
        return

    }

    async function getComments(page: puppeteer.Page, selector: string) {

        const comments = await page.$$eval(selector, links => links.map(link => {
            return link.innerHTML;

        }));
        return comments;
    }


    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto('https://www.instagram.com/p/CDUwb-Oh03W/')


    await loadMore(page, '.dCJp8')
    let arrobas = await getComments(page, '.C4VMK span a');
    const counted = count(arrobas)
    const sorted = sort(counted);





    await browser.close()


    console.log("\n\n comentarios: \n\n", counted);
    console.log("\n\n ordenado: \n\n", sorted);

})();




