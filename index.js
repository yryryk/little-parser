const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const url = new URL(
  "https://www.dns-shop.ru/catalog/17a8d26216404e77/vstraivaemye-xolodilniki/"
);

const unnecessaryResources = ["image", "media"];

const parser = async (url, unnecessaryResources) => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  try {
    // const page = await browser.newPage();
    const page = (await browser.pages())[0];
    page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        unnecessaryResources.includes(request.resourceType()) ||
        !request.url().includes(url.hostname.replace("www.", ""))
      ) {
        request.abort();
        return;
      }

      request.continue();
    });

    await page.goto(url.href);

    await page.waitForSelector(".product-buy__price");

    const products = await page.$$(".catalog-products .catalog-product");
    console.log(await Promise.all(products.map(async (el) => {
      const name = await el.$eval(".catalog-product__name", (el) => el.textContent);
      const price = await el.$eval(".product-buy__price", (el) => el.textContent);
      return {name, price}
    })));

  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
};
parser(url, unnecessaryResources);
