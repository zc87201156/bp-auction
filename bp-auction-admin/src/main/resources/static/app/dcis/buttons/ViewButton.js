Ext.define("DCIS.buttons.ViewButton", {
    extend: "Ext.button.Button",
    alias: "widget.viewbutton",
    constructor: function (cfg) {
        config = {};
        Ext.apply(config, cfg);
        Ext.applyIf(config, {
            text: "查阅",
            iconCls: "icon-search"
        });
        if (config.control && !config.handler) {
            this.handler = this.viewHandler;
        }
        this.callParent([config]);
    },
    viewHandler: function () {
        if (!this.control) {
            return;
        }
        var control = Ext.ComponentManager.create(this.control);
        var result = control.setOperationType("readOnly");
        
        if (result == true) {
            control.show();
        }
    }
});