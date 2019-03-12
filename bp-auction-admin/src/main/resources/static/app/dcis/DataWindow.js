Ext.define("DCIS.DataWindow", {
    extend: "Ext.window.Window",
    alias: "widget.datawindow",
    layout: 'fit',
    resizable: false,
    modal: true,
    constructor: function (cfg) {
        var config = Ext.apply({}, cfg);
        if (Ext.typeOf(config.store) == "string") {
            config.store = DCIS.StoreMgr.get(config.store);
        }
        this.store = config.store;
        var formpanel = this.buildFormPanel(config);
        var buttons = this.buildButtons(config);
        config.buttons = buttons;
        config.items = formpanel;
        this.callParent([config]);
    },
    initComponent: function () {
        this.callParent(arguments);
        this.form = this.query("dataform")[0];
    },
    buildButtons: function (config) {
        if (!config.buttons) {
            var buttons = [{
                text: "确认",
                name: "save",
                scope: this,
                listeners:{
                	'click':{
                		fn:this.confirm,
                		scope:this
                	}
                }
            }, {
                text: "取消",
                name: "cancel",
                handler: this.cancel,
                scope: this
            }];
            return buttons;
        }
        else {
            return config.buttons;
        }
    },
    buildFormPanel: function (config) {
        var formpanel = {
            xtype: "dataform"
        };
        if (config.columns) {
            formpanel.columns = config.columns;
            delete config.columns;
        }
        else {
            formpanel.columns = 1;
        }
        if (config.columnsWidth) {
            formpanel.columnsWidth = config.columnsWidth;
            delete config.columnsWidth;
        }
        if (config.containerFields) {
            formpanel.containerFields = config.containerFields;
            delete config.containerFields;
        }
        if (config.columnsLabelWidth) {
            formpanel.columnsLabelWidth = config.columnsLabelWidth;
            delete config.columnsLabelWidth;
        }
        if (config.store) {
            formpanel.store = config.store;
            delete config.store;
        }
        if (config.fields) {
            formpanel.fields = config.fields;
            delete config.fields;
        }
        if (config.buildField) {
            formpanel.buildField = config.buildField;
            delete config.buildField;
        }
        if (config.customFields) {
            formpanel.customFields = config.customFields;
            delete config.customFields;
        }
        if (config.customItems) {
            formpanel.customItems = config.customItems;
            delete config.customItems;
        }
        if (config.items) {
            formpanel.items = config.items;
            config.items = formpanel;
        };
        if (config.defaults) {
            formpanel.defaults = config.defaults;
            delete config.defaults;
        }
        return formpanel;
    },
    confirm: function () {
        var me = this;
        if (!this.form.isValid()) {
            return;
        }
        var values = this.form.getValues();
        if(!me.fireEvent('beforeSubmit',values)){
        	return ;
        }
        if(this.store.parameter){
        	values.parameter = this.store.parameter;
        }
        if(this.store.objectType){
        	values.objectType = this.store.objectType;
        }
        var fn = null;
        var applyValues = this.form.getApplyValues();
        if (me.operationType == "add") {
            fn = function () {
                me.close();
            };
        }
        if (me.operationType == "update") {
            fn = function (result) {
                Ext.apply(me.record.data, result);
               	me.record.commit();
                me.close();
            };
        }
        var error = function (error) {
            me.form.setError(error);
        };

        this.store[this.operationType + "Data"](values, applyValues, fn, error);
    },
    cancel: function () {
        this.close();
    },
    setValues: function (data) {
        this.form.setValues(data);
    },
    setOperationType: function (type) {
        if (type == "add") {
            this.setTitle("新增" + this.title);
            this.operationType = "add";
            this.form.reset();
            return true;
        }
        if (type == "readOnly") {
            this.operationType = "readOnly";
            var fields = this.form.getFields();
            for (var i in fields.items) {
                if (fields.items[i].setReadOnly) {
                    fields.items[i].setReadOnly(true);
                }
            }
        }
        
        if (type == "update") {
            this.setTitle("修改" + this.title);
            this.operationType = "update";
          	var fields = this.form.getFields();
            for (var i in fields.items) {
                if (fields.items[i].unEdit) {
                    fields.items[i].setReadOnly(true);
                    fields.items[i].fieldStyle='background-color:#DFE8F6; background-image: none;';
                }
            }
            var record = this.store.getCurrentRecord();
            if (record == null) {
                Ext.MessageBox.show({
                    title: "错误",
                    msg: "请选择一条记录",
                    modal: true,
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
                return false;
            }
            else {
                this.form.setValues(record.data);
                this.record = record;
                this.fireEvent('bindDropDownList',record);
                return true;
            }
        }
    }


});