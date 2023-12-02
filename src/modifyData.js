const modifyData = (data) => data.map((item) => ({name: item.name.replace( /,/g, ";" ), price: Number(item.price.split('₽')[0].split(' ').join(''))}));

module.exports = modifyData;
