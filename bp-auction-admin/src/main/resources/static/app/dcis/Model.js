Ext.define("DCIS.Model", {
    extend: "Ext.data.Model",
    constructor: function (cfg) {
        var config = Ext.apply({}, cfg);
        var fields = config.fields || this.fields;
        if (!fields) {
            return;
        }
        for (var i = 0; i < fields.items.length; i++) {
            var field = fields.items[i];
            if (field.store && Ext.typeOf(field.store) == "string") {
                field.store = DCIS.StoreMgr.get(field.store);
            }
        }
        this.callParent(arguments);
    }
});