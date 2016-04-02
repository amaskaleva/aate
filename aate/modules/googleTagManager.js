App.googleTagManager={
    getTypeIdByBlockType: function (blockType) {
        switch (blockType) {
            case 'ACCESSORIES':
                return 305;
            case 'SPAREPART':
                return 306;
            case 'SIMILAR':
                return 309;
            default:
                return -1;
        }
    }
};