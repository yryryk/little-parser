# little-parser

Тестовое задание 

## Описание

Парсер позволяющий собрать информацию обо всех товарах категории сайта DNS-shop.ru (по умолчанию https://www.dns-shop.ru/catalog/17a8d26216404e77/vstraivaemye-xolodilniki/) (Url в файле "constants.js").<br/>
Сохраняет наименования и цены в папку src в файл формата .csv типа "\<title>-\<date>.csv"<br/>

## Стек технологий

JavaScript<br/>
NodeJS<br/>
Puppeteer<br/>

## Запуск проекта

`npm i` — загружает зависимости<br/>
`npm start` — запускает проект <br/> 

## Исправления

Проведён рефакторинг в соответствии с: https://stackoverflow.com/questions/55664420/page-evaluate-vs-puppeteer-methods <br/>

Исправлен баг с режимом работы в ```headless: "New"```. Оказалось, что баг возникает только в безголовом режиме из-за использования ```const page = (await browser.pages())[0];``` вместо ```const page =  await browser.newPage();```, при том что в режиме ```headless: false``` всё работало.