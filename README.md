## Install

##### Установить все зависимости
>npm i

##### Build
> ПКМ на package.json > Show npm scripts > Build

##### Запуск
> dist/index.html

##### Работа с проектом
Если изменений в `index.html` внесено не было, использовать `soft-build` вместо `build`, потому что скорее всего будет ошибка

##### Ошибка при выполнении build
Такое может быть из-за того что команда пытается удалить папку `dist`, а в ней кто-то находится, типа открытого браузера с index.html