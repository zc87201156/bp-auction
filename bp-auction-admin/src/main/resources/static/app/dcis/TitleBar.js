Ext.define("DCIS.TitleBar", {
    extend: "Ext.toolbar.Toolbar",
    alias: "widget.titlebar",
    constructor: function (cfg) {
        var config = Ext.apply({}, cfg);
        //设置items
        var items = [ {xtype: 'tbfill'},config.title || ""];
        if (config.items) {
            for (var i in config.items) {
                if (config.scope) {
                    config.items[i].scope = config.scope;
                }
                items.push(config.items[i]);
                items.push("-");
            }
        }
        items.pop();
        Ext.apply(config, {
            items: items,
            border: false
        });
        this.callParent([config]);
    }
});