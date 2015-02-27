require( 'should' );
var pquire = require( 'proxyquire' ).noCallThru();
var sinon = require( 'sinon' );

var _noop   = require( 'lodash/utility/noop' );
var _assign = require( 'lodash/object/assign' );
var _clone  = require( 'lodash/lang/clone' );

// Fixtures
var args = require( './fixtures' ).args;
var baseEls  = require( './fixtures' ).els;

var spies = null;

var getSpies = function ( els ) {
    return {
        querySelector: sinon.spy( function ( sel ) {
            return els[ sel ];
        }),
        querySelectorAll: sinon.spy( function ( sel ) {
            return els[ sel ]
        })
    };
}

var getCarousel = function ( overrides, els ) {
    overrides = overrides || {};
    els       = els ? _assign( _clone( baseEls ), els ) : _clone( baseEls );

    spies = getSpies( els );

    return pquire( '../index', {
        './browser-shim': {
            document: {
                querySelector: spies.querySelector,
                querySelectorAll: spies.querySelectorAll
            }
        },
        './lib': {
            toggleDisabled: overrides.toggle || _noop,
            getRotator: function () {
                return _noop;
            }
        }
    });
};

describe( 'Carousel Lite', function () {
    var carousel = null;

    beforeEach( function () {
        carousel = getCarousel();
    });

    it( 'Gets all necessary DOM elements', function () {
        carousel.register( args );

        spies.querySelector.calledWith( args[ 'carousel', 'previous', 'next' ] ).should.be.true;
        spies.querySelectorAll.calledWith( args[ 'items' ] ).should.be.true;
    });

    it( 'Short circuits if one of the DOm elements are not found', function () {
        carousel = getCarousel( false, { items: [] } );
        var result = carousel.register( args );
        ( typeof result === 'undefined' ).should.be.true;
    });

    it( 'Disables the previous button by default', function () {
        var toggleSpy  = sinon.spy();
        var customEls  = _clone( baseEls );
        carousel = getCarousel( { toggle: toggleSpy }, customEls );
        carousel.register( args );
        toggleSpy.calledWith( customEls.previous, true ).should.be.true;
    });

    it( 'Binds all necessary handlers', function () {
        var eventListenerSpy = sinon.spy();
        var customEls = {
            previous: _assign( _clone( baseEls[ 'previous' ] ), { addEventListener: eventListenerSpy } ),
            next: _assign( _clone( baseEls[ 'next'] ), { addEventListener: eventListenerSpy } )
        };
        carousel = getCarousel( false, _assign( baseEls, customEls ) );
        carousel.register( args );
        eventListenerSpy.calledTwice.should.be.true;
    });
});
