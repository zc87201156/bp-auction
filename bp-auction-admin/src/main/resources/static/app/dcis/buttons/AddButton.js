Ext.define("DCIS.buttons.AddButton", {
    extend: "Ext.button.Button",
    alias: "widget.addbutton",
    constructor: function (cfg) {
        config = {};
        Ext.apply(config, cfg);
        Ext.applyIf(config, {
            text: "新增",
            name:'addButton',
            iconCls: "icon-add"
        });
        if (config.control && !config.handler) {
            this.handler = this.addhandler;
        }
        this.callParent([config]);
        
    },
    addhandler: function () {
        if (!this.control) {
            return;
        }
        var control = Ext.ComponentManager.create(this.control);
        control.setOperationType("add");
        control.show();
    }
});