const priceToNumber = (data) => data.map((item) => ({...item, price: Number(item.price.split('₽')[0].split(' ').join(''))}));
module.exports = priceToNumber;