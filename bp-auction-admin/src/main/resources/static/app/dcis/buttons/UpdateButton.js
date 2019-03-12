Ext.define("DCIS.buttons.UpdateButton", {
    extend: "Ext.button.Button",
    alias: "widget.updatebutton",
    constructor: function (cfg) {
        config = {};
        Ext.apply(config, cfg);
        Ext.applyIf(config, {
            text: "修改",
            name:'updateButton',
            iconCls: "icon-edit"
        });
        if (config.control && !config.handler) {
            this.handler = this.updateHandler;
        }
        this.callParent([config]);
    },
    updateHandler: function () {
        if (!this.control) {
            return;
        }
        var control = Ext.ComponentManager.create(this.control);
        var result = control.setOperationType("update");
        
        if (result == true) {
            control.show();
        }
    }
});