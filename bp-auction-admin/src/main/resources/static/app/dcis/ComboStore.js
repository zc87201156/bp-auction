Ext.define("DCIS.ComboStore", {
    extend: "DCIS.Store",
    alias: "widget.combostore",
    config: {
        displayField: "Name",
        valueField: "ID"
    },
    constructor: function (cfg) {
        this.initConfig(cfg);
        var fields = [this.getDisplayField(), this.getValueField()];
        cfg.fields = fields;
        delete cfg.model;
        this.callParent([cfg]);
    }
});