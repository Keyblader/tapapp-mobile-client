
/*<!-- Puntos suspensivos de descripción -->
    var containerHeight = $(".descripcion").height();
    var $text = $(".descripcion p");

    while ($text.outerHeight() > containerHeight) {
        $text.text(function (index, text) {
            return text.replace(/\W*\s(\S)*$/, '...');
        });
    }
*/