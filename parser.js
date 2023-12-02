const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

// вернуть массив с наименованием и ценой для товаров с текущей страницы
const getNamesAndPrices = async (page, href, result = []) => {
  await page.goto(href, {waitUntil: 'domcontentloaded'});
  await page.waitForSelector('.catalog-product:last-child .product-buy__price');
  const products = await page.$$(".catalog-products .catalog-product");
  const namesAndPrices = await Promise.all(
    products.map(async (el) => {
      const name = await el.$eval(
        ".catalog-product__name",
        (el) => el.textContent
      );
      const price = await el.$eval(
        ".product-buy__price",
        (el) => el.textContent
      );
      return { name, price };
    })
  );
  return [...result, ...namesAndPrices];
};

// получить объект с элементами ссылок пагинации
const getPages = async (page) => {
  await page.waitForSelector(
    ".pagination-widget__pages .pagination-widget__page a"
  );
  const paginationElements = await page.$$(
    ".pagination-widget__pages .pagination-widget__page a"
  );
  const pages = await paginationElements.reduce(async (acc, el) => {
    const text = await el.evaluate((x) => x.textContent);
    if (Number(text)) return { ...(await acc), [Number(text)]: await el.evaluate((x) => x.href) };
    return await acc;
  }, {});
  return pages;
};

// создать браузер,
// получить ссылку на страницу,
// отсечь загрузку бесполезной информации,
// перейти по ссылке и собрать данные со всех страниц для данной категории
// вернуть массив с наименованием и ценой для всех товаров категории
const useParser = async (url, unnecessaryResources) => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  try {
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

    let result = [];

    result = await getNamesAndPrices(page, url.href, result);

    let pagesUrls = await getPages(page);
    const numberOfPages = Object.keys(pagesUrls).length;

    if (numberOfPages > 1) {
      for (let i = 2; i <= numberOfPages; i++) {
        result = await getNamesAndPrices(page, pagesUrls[i], result);
      }
    }
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
};

module.exports = useParser;
