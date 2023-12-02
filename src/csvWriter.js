const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const writeInCsv = async (data, title) => {
  let date = new Date();
  const csvWriter = createCsvWriter({
    path: `./src/${title}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.csv`,
    header: [
      { id: "name", title: "наименование" },
      { id: "price", title: "цена ₽" },
    ],
  });
  try {
    await csvWriter.writeRecords(data);
    console.log("The CSV file was written successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = writeInCsv;
