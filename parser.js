const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

// вернуть массив с наименованием и ценой для товаров с текущей страницы
const getNamesAndPrices = async (page) => {
  await page.waitForSelector(".product-buy__price", { visible: true });
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
  return namesAndPrices;
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
    if (Number(text)) return { ...(await acc), [Number(text)]: el };
    return await acc;
  }, {});
  return pages;
};

// получить ссылку на страницу,
// отсечь загрузку бесполезной информации,
// перейти по ссылке и собрать данные со всех страниц для данной категории
const getAllNamesAndPrices = async (
  browser,
  extraTry,
  url,
  unnecessaryResources
) => {
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

    await page.goto(url.href);

    const pageResult = await getNamesAndPrices(page);
    let result = [];
    result = [...result, ...pageResult];
    let pages = await getPages(page);
    const numberOfPages = Object.keys(pages).length;
    if (numberOfPages > 1) {
      for (let i = 2; i <= numberOfPages; i++) {
        await pages[i].click();
        const pageResult = await getNamesAndPrices(page);
        result = [...result, ...pageResult];
        pages = await getPages(page);
      }
    }
    return result;
  } catch (e) {
    console.log(e);
    if (extraTry) {
      extraTry = false;
      return await getAllNamesAndPrices(browser);
    }
  }
};

// создать браузер,
// вернуть массив с наименованием и ценой для всех товаров категории
const useParser = async (url, unnecessaryResources) => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  let extraTry = true;
  const result = await getAllNamesAndPrices(
    browser,
    extraTry,
    url,
    unnecessaryResources
  );
  await browser.close();
  return result;
};

module.exports = useParser;
