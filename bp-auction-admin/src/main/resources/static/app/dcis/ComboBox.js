Ext.define("DCIS.ComboBox", {
    extend: "Ext.form.field.ComboBox",
    alias: "widget.dciscombo",
    config: {
        selectDefault: true
    },
    constructor: function (config) {
        this.store = config.store = DCIS.StoreMgr.get(config.store);
        if (config.canInputValue != null) {
            this.canInputValue = config.canInputValue;
        }
        if (this.canInputValue == false) {
            this.inputAttrTpl = 'readonly="true"';
        }
        this.initConfig(config)
        this.callParent([config]);
    },
    //store需要设置为自动加载，否则会因为无数据引发匹配异常。从而只显示 ‘displayfield’
    setDefault: function () {
        var me = this;
        var defaultFun = function () {
            var defaultValue = me.getSelectDefault();
            if (defaultValue == false) {
                return;
            }
            var records = me.store.getRange();
            if (defaultValue == true) {
                if (records.length == 0) {
                    return;
                }
                var record = records[0];
                me.setValue(record.get(me.valueField));
            }
            if (Ext.typeOf(defaultValue) == "array") {
                var index = me.store.findBy(function (record) {
                    if (record.get(me.valueField) == defaultValue[0] && record.get(me.displayField) == defaultValue[1]) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                if (index == -1) {
                    var record = me.store.getNewRecords();
                    if (Ext.typeOf(record) == "array") {
                        record = defaultValue;
                        me.store.insert(0, [record]);
                        me.setValue(defaultValue[0]);
                    }
                    else {
                        record.set(me.valueField, defaultValue[0]);
                        record.set(me.displayField, defaultValue[1]);
                        me.store.insert(0, [record]);
                        me.setValue(record.get(me.valueField));
                    }
                }
                else {
                    var record = me.store.getAt(index);
                    if (Ext.typeOf(record) == "array") {
                        me.setValue(record[0]);
                    }
                    else {
                        me.setValue(record.get(me.valueField));
                    }
                }

            }
        }

        if (me.store instanceof Ext.data.Store) {
            if (me.store.data == null || me.store.data.getCount() == 0) {
                me.store.on("load", defaultFun);
                return;
            }
        }
        defaultFun();
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        this.setDefault();
    },
    reset: function () {
        this.callParent(arguments);
        this.setDefault();
    },
    getValue:function(){
    	return this.callParent(arguments)
    },
    setValue:function(){
    	return this.callParent(arguments)
    },
    getSubmitData:function(){
    	return this.callParent(arguments)
    }
});