var DISABLED = 'carousel-button-disabled';

function isDisabled ( newIndex, nextPos, maxScroll ) {
    return {
        previous:  newIndex === 0,
        next:      nextPos >= maxScroll
    };
}

function toggleDisabled ( el, add ) {
    el.classList.toggle( DISABLED, add );
}

function getRotator ( carousel, items, next, previous ) {
    return function ( reverse ) {
        var currentIndex = carousel.currentIndex || 0;
        var maxScroll    = carousel.scrollWidth - carousel.clientWidth;
        var incrementor  = reverse ? -1 : 1;
        var direction    = reverse ? previous : next;
        var newIndex     = currentIndex + incrementor;
        var currentItem  = items[ newIndex ];

        if ( direction.classList.contains( DISABLED ) ) {
            return;
        }

        var nextPos  = currentItem.offsetLeft - carousel.offsetLeft;
        var disabled = isDisabled( newIndex, nextPos, maxScroll );

        toggleDisabled( previous, disabled.previous );
        toggleDisabled( next, disabled.next );

        carousel.scrollLeft   = nextPos;
        carousel.currentIndex = newIndex;
    };
}

module.exports.toggleDisabled = toggleDisabled;
module.exports.getRotator     = getRotator;