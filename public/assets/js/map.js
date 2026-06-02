
$( document ).ready(function() {
    ymaps.ready(function () {
        var myMap = new ymaps.Map('map', {
                center: [55.768864, 37.725301],
                zoom: 15
            }, {
                searchControlProvider: 'yandex#search'
            }),
    
            
            // Создаём макет содержимого.
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
            ),
    
            
    
            myPlacemarkWithContent = new ymaps.Placemark([55.765620, 37.726493], {
                hintContent: 'FREZOREZ.RU',
                balloonContent: '<h3>FREZOREZ.RU</h3>'+
                '<a class="fz-phone dropdown-item" href="tel:+79255560166">+7 (925) 556-01-66</a>'+
                '<a href="https://yandex.ru/maps/-/CBUE68E2pC">Москва,'+
                  'ул. Буракова, 6 стр. 2</a>'+
                  '<br>Часы работы: Пн-Вс 9:00-21:00</p>',
                iconContent: ''
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#imageWithContent',
                // Своё изображение иконки метки.
                iconImageHref: '/apple-touch-favicon.png',
                // Размеры метки.
                iconImageSize: [48, 48],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-24, -24],
                // Смещение слоя с содержимым относительно слоя с картинкой.
                iconContentOffset: [15, 15],
                // Макет содержимого.
                iconContentLayout: MyIconContentLayout
            });
        myMap.behaviors.disable('scrollZoom');
        myMap.geoObjects
             
            .add(myPlacemarkWithContent);
    });
});
