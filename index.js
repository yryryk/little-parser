const useParser = require("./parser");
const {url, unnecessaryResources} = require("./constants");

(async () => {
  const data = await useParser(url, unnecessaryResources)
  console.log(data);
})()
