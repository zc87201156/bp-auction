Ext.define("DCIS.StoreMgr", {
	statics : {
		storeList : {},
		get : function(store, cfg) {
			
			if (store instanceof DCIS.Store || Ext.typeOf(store) == "array") {
				return store;
			}
			if (Ext.typeOf(store) == "string") {
				if (store.indexOf('.') == -1) {
					store = window.applicationName + ".store." + store;
				}
				var cache = true;
				if (cfg) {
					if (cfg.cache != null) {
						cache = cfg.cache;
						delete cfg.cache;
					}
					if (cache == true && DCIS.StoreMgr.storeList[store]) {

									return Ext.create(store, cfg);
						// return DCIS.StoreMgr.storeList[store];
					}
						DCIS.StoreMgr.storeList[store] = Ext.create(store, cfg);
						return DCIS.StoreMgr.storeList[store];
				}
				if (DCIS.StoreMgr.storeList[store]) {
					return DCIS.StoreMgr.storeList[store];
				} else {
					DCIS.StoreMgr.storeList[store] = Ext.create(store, cfg);
					return DCIS.StoreMgr.storeList[store];
				}
			}
			
			
		}
	}
});