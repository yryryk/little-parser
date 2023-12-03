# little-parser

Тестовое задание 

## Описание

Парсер позволяющий собрать информацию обо всех товарах категории сайта DNS-shop.ru (по умолчанию https://www.dns-shop.ru/catalog/17a8d26216404e77/vstraivaemye-xolodilniki/) (Url в файле "constants.js").<br/>
Работает в режиме "headless: false"<br/>
Сохраняет наименования и цены в папку src в файл формата .csv типа "\<title>-\<date>.csv"<br/>

## Стек технологий

JavaScript<br/>
NodeJS<br/>
Puppeteer<br/>

## Запуск проекта

`npm i` — загружает зависимости<br/>
`npm start` — запускает проект <br/> 

## Исправления

Проведён рефакторинг в соответствии с: https://stackoverflow.com/questions/55664420/page-evaluate-vs-puppeteer-methods