Ext.define('DCIS.ux.StoreLoadCoordinator', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    resetStoreLoadStates: function() {
        this.storeLoadStates = {};

        Ext.each(this.stores, function(storeId) {
            this.storeLoadStates[storeId] = false;
        }, this);
    },
    isLoadingComplete: function() {
        for (var i=0; i<this.stores.length; i++) {
            var key = this.stores[i];

            if (this.storeLoadStates[key]==false) {
                return false;
            }
        }

        return true;
    },
    onStoreLoad: function(store, records, successful, eOpts, storeName) {
        this.storeLoadStates[store.storeId] = true;

        if (this.isLoadingComplete()==true) {
            this.fireEvent('load');
            this.resetStoreLoadStates();
        }
    },
    constructor: function (config) {
        this.mixins.observable.constructor.call(this, config);

        this.resetStoreLoadStates();

        Ext.each(this.stores, function(storeId) {
            var store = Ext.StoreManager.lookup(storeId);

            store.on('load', Ext.bind(this.onStoreLoad, this, [storeId], true));
        }, this);

        this.addEvents(
            'load'
        );
    }
});