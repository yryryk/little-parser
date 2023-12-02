const useParser = require("./parser");
const {url, unnecessaryResources} = require("./constants");
const priceToNumber = require("./priceToNumber");

(async () => {
  const data = await useParser(url, unnecessaryResources)
  console.log(priceToNumber(data));
})()
