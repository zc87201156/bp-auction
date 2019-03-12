Ext.define("DCIS.ComplexWindow", {
    extend: "Ext.window.Window",
    alias: "widget.complexwindow",
    layout: 'fit',
    modal: true,
    layout: {
        type: "vbox",
        align: 'stretch'
    },
    constructor: function (cfg) {
        var config = {};
        Ext.apply(config, cfg);
        var formpanel = {
            xtype: "panel",
            border: false,
            frame: false,
            margin: "5 5 5 5",
            baseCls: 'x-plain', //背景透明
            defaults: {
                xtype: "dataform",
                columns: 1,
                labelSeparator: ""
            }
        };
        if (config.items) {
            formpanel.items = config.items;
            config.items = formpanel;
        }
        if (config.layout) {
            formpanel.layout = config.layout;
            delete config.layout;
        }
        this.callParent([config]);
    },
    initComponent: function () {
        this.callParent(arguments);
        this.forms = this.query("form");

    },
    setValues: function (data) {
        for (var i in this.forms) {
            var name = this.forms[i].name;
            var values = data[name];
            if (values) {
                var basicForm = this.forms[i].getForm();
                basicForm.setValues(values);
            }
        }
    }
});