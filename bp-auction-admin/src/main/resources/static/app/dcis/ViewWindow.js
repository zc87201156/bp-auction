Ext.define("DCIS.ViewWindow", {
    extend: "Ext.window.Window",
    alias: "widget.viewWindow",
    	layout : {
		type : 'vbox',
		align : 'stretch'
	},
    canEdit:null,
    resizable: false,
    modal: true,
   // autoScroll:true,
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
         var me=this;
        this.form = this.query("dataform")[0];
        if(this.canEdit){
        	this.setOperationType('add');
        }
        else{
        	this.setOperationType('readOnly');
        }
        me.add(me.lastAppend);
      
    },
    buildButtons: function (config) {
        if (!config.buttons) {
            var buttons = [{
                text: "关闭",
                name: "cancel",
                handler: this.cancel,
                scope: this
            }];
            return buttons;
        }
        else {
            delete config.buttons;
            return config.buttons;
        }
    },
    buildFormPanel: function (config) {
        var formpanel = {
            xtype: "dataform",
            autoScroll:true,
            bodyStyle : {
				background : 'transparent'
			}
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
        var values = this.form.getValues(); ;
        if(this.store.parameter){
        	values.parameter = this.store.warningCodeValue;
        }
        var fn = null;
        var applyValues = this.form.getApplyValues();
        if (me.operationType == "add") {
            fn = function () {
                me.close();
            };
        }
        if (me.operationType == "update") {
            Ext.applyIf(values, me.record.data);
            fn = function (result) {
                Ext.apply(me.record.data, applyValues);
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
        if (type == "readOnly") {
            this.operationType = "readOnly";
            var fields = this.form.getFields();
            for (var i in fields.items) {
            	fields.items[i].setReadOnly(true);
            	fields.items[i].fieldStyle='background-color:#DFE8F6; background-image: none;';
            }
        }
                    this.setTitle("查看" + this.title);
            this.operationType = "update";
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


});