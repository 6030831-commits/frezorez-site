$('#carouselExample').on('slide.bs.carousel', function (e) {

    /*

    CC 2.0 License Iatek LLC 2018
    Attribution required
    
    */


    var $e = $(e.relatedTarget);
    var idx = $e.index();
    var itemsPerSlide = 7;
    var totalItems = $('.carousel-client').length;
    
    if (idx >= totalItems-(itemsPerSlide-1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i=0; i<it; i++) {
            // append slides to end
            if (e.direction=="left") {
                $('.carousel-client').eq(i).appendTo('.carousel-inner-clients');
            }
            else {
                $('.carousel-client').eq(0).appendTo('.carousel-inner-clients');
            }
        }
    }
});

$(function(){
    $('.carousel-clients').carousel({
      interval: 2000
    });
});