const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

// вернуть массив с наименованием и ценой для товаров с текущей страницы
const getNamesAndPrices = async (
  page,
  href,
  result = { data: [], title: "" },
  title = false
) => {
  await page.goto(href, { waitUntil: "domcontentloaded" });
  if (title) {
    await page.waitForSelector(".title");
    const title = await page.evaluate(
      () => document.querySelector(".title").textContent
    );
    result.title = title;
  }
  await page.waitForSelector(".catalog-product:last-child .product-buy__price");
  const namesAndPrices = await page.evaluate(() => {
    const products = Array.from(document.querySelectorAll(
      ".catalog-products .catalog-product"
    ));
    const namesAndPrices = products.map((el) => {
      const name = el.querySelector(".catalog-product__name").textContent;
      const price = el.querySelector(".product-buy__price").textContent;
      return { name, price };
    });
    return namesAndPrices;
  });
  result.data = [...result.data, ...namesAndPrices];
  return result;
};

// получить объект с элементами ссылок пагинации
const getPages = async (page) => {
  await page.waitForSelector(
    ".pagination-widget__pages .pagination-widget__page a"
  );
  const pages = await page.evaluate(() => {
    const paginationElements = Array.from(document.querySelectorAll(".pagination-widget__pages .pagination-widget__page a"));
    const pages = paginationElements.reduce((acc, el) => {
      const text = el.textContent;
      if (Number(text))
        return {
          ...(acc),
          [Number(text)]: el.href
        };
      return acc;
    }, {});
    return pages;
  });
  return pages;
};

// создать браузер,
// получить ссылку на страницу,
// отсечь загрузку бесполезной информации,
// перейти по ссылке и собрать данные со всех страниц для данной категории
// вернуть массив с наименованием и ценой для всех товаров категории
const useParser = async (url, unnecessaryResources) => {
  const browser = await puppeteer.launch({
    // headless: "New",
    headless: false,
  });
  try {
    const page = (await browser.pages())[0];
    await page.setViewport({ width: 1920, height: 1080 });
    page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        unnecessaryResources.includes(request.resourceType()) ||
        !request.url().includes(url.hostname.replace("www.", ""))
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    let result = { data: [], title: "" };

    result = await getNamesAndPrices(page, url.href, result, true);

    let pagesUrls = await getPages(page);
    const numberOfPages = Object.keys(pagesUrls).length;

    if (numberOfPages > 1) {
      for (let i = 2; i <= numberOfPages; i++) {
        result = await getNamesAndPrices(page, pagesUrls[i], result);
      }
    }
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
};

module.exports = useParser;
