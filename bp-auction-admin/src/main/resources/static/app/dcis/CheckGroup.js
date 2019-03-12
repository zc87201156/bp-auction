Ext.define("DCIS.CheckGroup", {
    extend: "Ext.form.CheckboxGroup",
    alias: "widget.checkgroup",
    config: {
        displayField: null,
        valueField: null
    },
    itemWidth: 70,
    constructor: function (cfg) {
        var me = this;
        if (cfg.itemWidth) {
            me.itemWidth = cfg.itemWidth;
            delete cfg.itemWidth;
        }
        if (cfg.store) {
            var items = [];
            if (Ext.typeOf(cfg.store) == "array") {
                for (var i in cfg.store) {
                    items.push({ boxLabel: cfg.store[i][1], name: cfg.store[i][0], width: me.itemWidth });
                }
            }
            else {
                items = me.buildItemsByStore(cfg.store);
                cfg.store.on("load", function (store) {
                    me.removeAll();
                    me.add(me.buildItemsByStore(store));
                });
            }
            delete cfg.store;
            cfg.items = items;
            cfg.maxWidth = 200;
        }
        me.callParent(arguments);
    },
    configField: function (cfg) {
        var me = this;
        var displayField;
        var valueField;
        if (cfg.displayField && cfg.valueField) {
            me.setDisplayField(displayField);
            me.setValueField(valueField);
            return;
        }
        if (cfg.store instanceof DCIS.ComboStore) {
            me.setDisplayField(cfg.store.getDisplayField());
            me.setValueField(cfg.store.getValueField());
            return;
        }
    },
    buildItemsByStore: function (store) {
        var me = this;
        var items = [];
        if (!store || !store.data || store.data.getCount() == 0) {
            return items;
        }
        var displayField = me.getDisplayField();
        var valueField = me.getValueField();
        store.data.each(function (record) {
            items.push({ boxLabel: record.get(displayField), name: record.get(valueField), width: me.itemWidth });
        });
        return items;
    },
    getValue: function () {
        return this.getSubmitData();
    },
    getSubmitData: function () {
        var chkBoxs = this.query("checkboxfield");
        var obj = {};
        for (var i = 0; i < chkBoxs.length; i++) {
            obj[chkBoxs[i].getName()] = chkBoxs[i].getValue();
        }
        return obj;
    },
    setValue: function (value) {
        for (var name in value) {
            var chkBoxs = this.query("checkboxfield[name='" + name + "']");
            if (chkBoxs.length > 0) {
                chkBoxs[0].setValue(value[name]);
            }
        }
    }
});