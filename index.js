const useParser = require("./parser");
const {url, unnecessaryResources} = require("./constants");
const modifyData = require("./modifyData");
const writeInCsv = require("./csvWriter");

(async () => {
  try {
    const result = await useParser(url, unnecessaryResources)
    await writeInCsv(modifyData(result.data), result.title);
  } catch (error) {
    console.log(error);
  }
})()
