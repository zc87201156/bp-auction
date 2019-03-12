Ext.define("DCIS.DataGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.datagrid",
    columnLines: true,
//    margin: "0 0 0 0",
//    bodyStyle: { "border": "1  0  0  0 " },
    bodyBorder: false,
    flex: 1,
    pickerField: null,
	    viewConfig:{  
	   enableTextSelection:true
	} ,
    constructor: function (cfg) {
        var config = {};
        Ext.apply(config, cfg);
        var me=this;
        this.pickerField = config.pickerField;
        this.eventScope = cfg.eventScope = cfg.eventScope || this.eventScope;
        Ext.applyIf(config, {
            showPaging: true
        });
        if (Ext.typeOf(config.store) == "string") {
            this.store = config.store = DCIS.StoreMgr.get(config.store); ;
        }
        else {
            this.store = config.store;
        }
        if (config.store && config.showPaging == true) {
            this.bbar = [{ xtype: 'tbfill' }, {
                xtype: "pagingtoolbar",
                displayInfo: true,
                isShowRefresh:cfg.isShowRefresh!=null?cfg.isShowRefresh:true,
                store: config.store,
                border: false
            },{ 
                fieldLabel : "每页显示",
	            xtype:'numberfield',
	            width:110,
	            minValue:1,
	            hidden:config.hiddenPageSize!=null?config.hiddenPageSize:true,
	            value:config.store.pageSize,
	            listeners: {
			    change: function(field, value) {
			    	var store=config.store;
			    	if(value>=1)
			    	{
			       store.pageSize=value;
			       store.load();
			    	}
			    	else
			    	{
			    	field.setValue(1);
			    	store.pageSize=1;
			        store.load();
			    	}
			}
        }},{
            xtype:'label',
            hidden:config.hiddenPageSize!=null?config.hiddenPageSize:true,
            text:'条'
            }, { xtype: 'tbfill'}];
        };
        if (config.buildField == null) {
            config.buildField = "auto";
        };
        var fields = {};
        if (config.store != null) {
            if (config.store.model != null) {
                fields = config.store.model.getFields();
                var id = config.store.model.prototype.idProperty;
                if (fields != null) {
                    for (var i = 0; i < fields.length; i++) {
                        if (fields[i].name == id && fields[i].show == null) {
                            fields[i].show = false;
                            break;
                        }
                    }
                }
            }
        }
        if (config.fields != null) {
            var integrateFieldType = config.integrateFieldType == null ? "override" : config.integrateFieldType;
            fields = this.integrateFields(fields, config.fields, integrateFieldType);
            delete config.integrateFieldType;
        }
        if (config.customFields != null) {
            for (var name in config.customFields) {
                var newfield = config.customFields[name];
                var field = null;
                var index = -1;
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i].name == name) {
                        field = fields[i];
                        index = i;
                    }
                }
                if (newfield.del != null && newfield.del == true) {
                    if (field == null) {
                        continue;
                    }
                    else {
                        fields.splice(index, 1);
                        continue;
                    }
                }
                if (field.override != null && field.override == true) {
                    newfield.name = name;
                    fields.splice(index, 1, newfield);
                }
                else {
                    Ext.apply(field, newfield);
                }
            }
        }

        var columns = null;
        if (config.buildField == "auto") {
            columns = this.buildColumns(fields, config.columns);

            var addControl = [];
            if (config.customColumns != null) {
                for (var name in config.customColumns) {
                    var column = config.customColumns[name];
                    var isExist = false;
                    for (var i in columns) {
                        if (columns[i].dataIndex != null && columns[i].dataIndex == name) {
                            Ext.apply(columns[i], config.customColumns[name]);
                            isExist = true;
                            break;
                        }
                    }
                    if (isExist == false) {
                        var control = config.customColumns[name];
                        control.name = name;
                        addControl.push(control);
                    }
                }
            }
            for (var i = 0; i < addControl.length; i++) {
                columns.push(addControl[i]);
            }
            if (config.sortFields != null) {
                columns = this.sortControl(config.sortFields, columns);
                delete config.sortFields;
            }

            config.columns = columns;
        }
        this.callParent([config]);
    },
    getBubbleTarget: function () {
            return this.pickerField || this.ownerCt;
    },
    buildColumns: function (fields, columns) {
        var newColumns = [];
        for (var i = 0; i < fields.length; i++) {
            var column = {};
            if (fields.gridShow == false || fields[i].show == false) {
                continue;
            }
            column.header = fields[i].display;
            column.dataIndex = fields[i].name;
            if (fields[i].colWidth) {
                column.width = fields[i].colWidth;
            }
            var xtype = this.getColumnXType(fields[i]);
            if (xtype != null) {
                column.xtype = xtype;
            }
            if (fields[i].renderer) {
                column.renderer = fields[i].renderer;
            }
            if (this.eventScope != null) {
                column.scope = this.eventScope;
            }
            this.columnFormatByXType(column, fields[i], xtype);
            newColumns.push(column);
        }
        return newColumns;
    },
    columnFormatByXType: function (column, field, xtype) {
        if (field.controlType == "combo") {
            column.renderer = function (value) {
                if (field.data != null) {
                    for (var i = 0; i < field.data.length; i++) {
                        if (field.data[i][0] == value)
                            return field.data[i][1];
                    }
                }
                else {
                    if (field.store instanceof DCIS.ComboStore) {
                        var record = field.store.findRecord(field.store.getValueField(), value);
                        if (record != null) {
                            return record.get(field.store.getDisplayField());
                        }
                        return "";
                    }
                    else {
                        var record = field.store.findRecord(field.valueField, value);
                        if (record != null) {
                            return record.get(field.displayField);
                        }
                    }
                }
            };
        }
        if (xtype == "numbercolumn") {
            if (field.type.type == "int") {
                column.format = "0,000";
            }
            if (field.type.type == "float") {
                column.format = "0,000.00";
            }
        }
        if (xtype == "datecolumn") {
            column.format = 'Y-m-d';
        }
    },
    getColumnXType: function (field) {
        if (field.type.type == "date") {
            return "datecolumn";
        }
        if (field.type.type == "int" || field.type.type == "float") {
            return "numbercolumn";
        }
    },
    integrateFields: function (storeFields, fields, type) {
        var newFields = [];
        var resultFields = [];
        for (var i = 0; i < fields.length; i++) {
            if (typeof (fields[i]) == "string") {
                newFields.push({ name: fields[i] });
            }
            else {
                newFields.push(fields[i]);
            }
        }
        if (storeFields == null) {
            return newFields;
        }
        if (type == "override") {
            for (var i = 0; i < storeFields; i++) {
                var field = storeFields[i];
                var name = field.name;
                if (name == null) {
                    continue;
                }
                var newField = null;
                for (var j = 0; j < newFields.length; j++) {
                    if (newFields[j].name == name) {
                        newField = newFields[j];
                        break;
                    }
                }
                if (newField != null) {
                    if (newField.override == true) {
                        field = newField;
                    }
                    else {
                        Ext.apply(field, newField);
                    }
                }
                resultFields.push(field);
            }
            for (var i = 0; i < newFields.length; i++) {
                var isExist = false;
                for (var j = 0; j < storeFields.length; j++) {
                    if (newFields[i].name == storeFields[j].name) {
                        isExist = true;
                        break;
                    }
                }
                if (isExist == false) {
                    resultFields.push(newFields[i]);
                }
            }
            return resultFields;
        }
        else {
            for (var i = 0; i < newFields.length; i++) {
                var field = newFields[i];
                var name = field.name;
                if (name == null) {
                    continue;
                }
                var newField = null;
                for (var j = 0; j < storeFields.length; j++) {
                    if (storeFields[j].name == name) {
                        newField = storeFields[j];
                        break;
                    }
                }
                if (newField != null) {
                    if (field.override != true) {
                        Ext.applyIf(field, newField);
                    }
                }
                resultFields.push(field);
            }
            return resultFields;
        }
    },
    initComponent: function () {
        this.callParent(arguments);
        this.on("selectionchange", this.setRecord);
    },
    setRecord: function (model, selects) {
        var store = this.getStore();
        if (!(store instanceof DCIS.Store)) {
            return;
        }
        store.setCurrentRecords(selects)
    }
});