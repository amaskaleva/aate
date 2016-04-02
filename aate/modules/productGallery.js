/**
 * Product image viewer
 *
 */

App.productGallery = {

    // Initialize gallery on element
    initGallery: function(elm){

        $(elm).elevateZoom({
            gallery:'imagesList',
            cursor: 'pointer',
            galleryActiveClass: 'active',
            imageCrossfade: true
        });

    },
    initializeGallery: function(elm ) {
        App.productGallery.initGallery(elm);
    }
};