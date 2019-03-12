Ext.define("DCIS.DataForm", {
    extend: "Ext.form.FormPanel",
    alias: "widget.dataform",
    layout: {
        type: "table",
        tdAttrs: {
            style: {
                "padding-right": "20px"
            }
        }
    },
   // trackResetOnLoad:true,
    margin: "10 0 0 10",
    border: false,
    baseCls: 'x-plain',
    columnsWidth:250,
    constructor: function (cfg) {
        var config = {};

        config = Ext.apply(config, cfg);

        this.containerFields = config.containerFields = config.containerFields || this.containerFields;
        if (Ext.typeOf(config.store) == "string") {
            config.store = DCIS.StoreMgr.get(config.store);
        }
        if (config.columns) {
            this.layout.columns = config.columns;
            delete config.columns;
        }
        else {
            this.layout.columns = 1;
        }
        if (config.columnsWidth) {
            this.columnsWidth = config.columnsWidth;
            delete config.columnsWidth;
        }
        if (config.columnsLabelWidth) {
            this.columnsLabelWidth = config.columnsLabelWidth;
            delete config.columnsLabelWidth;
        }
        if (config.name) {
            this.name = config.name;
            delete config.name;
        }
        if (config.defaults) {
            this.defaults = config.defaults;
            delete config.defaults;
        }
        else {
            this.defaults = { xtype: "textfield"};
        }
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
        if (config.buildField == null) {
            config.buildField = "auto";
        }
        if (config.buildField == "auto") {
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
            var controlList = null;
            controlList = this.buildFields(fields, config.items);
            
             //追加的面板
        	if(config.lastAppend){
        		controlList.push(config.lastAppend);
        	}
            
            
            var addControl = [];
            if (config.customItems != null) {
                for (var name in config.customItems) {
                    var item = config.customItems[name];
                    var isExist = false;
                    for (var i in controlList) {
                        if (controlList[i].name != null && controlList[i].name == name) {
                            Ext.apply(controlList[i], config.customItems[name]);
                            isExist = true;
                            break;
                        }
                    }
                    if (isExist == false) {
                        var control = config.customItems[name];
                        control.name = name;
                        addControl.push(control);
                    }
                }
            }
            for (var i = 0; i < addControl.length; i++) {
                controlList.push(addControl)
            }
            if (config.sortFields != null) {
                controlList = this.sortControl(config.sortFields, controlList);
                delete config.sortFields;
            }
            config.items = this.buildItems(controlList);
        }

        this.callParent([config]);
    },
    initComponent: function () {
        this.callParent(arguments);
        this.basicForm = this.getForm();
    },
    buildFields: function (fields, customItems) {
        var controlList = new Array();
        var container = new Array();
        for (var i in fields) {
            var field = fields[i];
            if (!this.getIsShow(field)) {
                continue;
            }
            var field = fields[i];
            var control = {};
            var xtype = this.getXtype(field);
            this.controlFormatByXType(control, field, xtype);
            control.name = field.name;
            control.allowBlank = this.getAllowBlank(field);
            if (control.allowBlank == false && control.emptyText == null) {
                control.emptyText = "该项为必输项";
                control.fieldStyle='background-color:#FFFFB9; background-image: none;';
            }
            var maxLength = this.getMaxLength(field);
            if (maxLength != null) {
                control.maxLength = maxLength;
            }
            var fieldLabel = field.display;
            if (fieldLabel != null) {
                control.fieldLabel = fieldLabel;
            }
            var disabled = field.disabled;
            if (disabled != null) {
                control.disabled = disabled;
            }
             var hidden = field.hidden;
            if (hidden != null) {
                control.hidden = hidden;
            }
              var showId = field.showId;
            if (showId != null) {
                control.showId = showId;
            }
            var readOnly = field.readOnly;
            if (readOnly != null) {
                control.readOnly = readOnly;
                control.fieldStyle='background-color:#DFE8F6; background-image: none;';
            }
            var value = field.value;
            if (value != null) {
                control.value = value;
            }
            var emptyText = field.emptyText;
            if (emptyText != null) {
                control.emptyText = emptyText;
            }
            var vType = this.getVType(field)
            if (vType != null) {
                if (typeof (vType) == "string") {
                    control.vType = vType;
                }
                if (typeof (vType) == "object") {
                    control.vType = vType.typeStr;
                    control[vType.typeStr] = control.data;
                }
            }
            if (field.colspan) {
                control.colspan = field.colspan;
            }
            else {
                control.colspan = this.getFieldDisplayLength(field);
            }
            if (field.width) {
                control.width = field.width;
            }

            //checkboxfield的提交值修改
            if (field.inputValue) {
                if (xtype == 'checkboxfield') {
                    control.inputValue = field.inputValue;
                }
            }
            controlList.push(control);
            
        }
		
       
            
        if (customItems == null) {
            this.buildContainerControl(controlList);
            return controlList;
        }
        var addItems = [];
        for (var i = 0; i < customItems.length; i++) {
            var name = customItems[i].name;
            var index = -1;
            for (var j = 0; j < controlList.length; j++) {
                if (controlList[j].name == name) {
                    index = j;
                    break;
                }
            }
            if (index == -1) {
                addItems.push(customItems[i]);
            }
            else {
                if (customItems[i].override == true) {
                    controlList[j] = customItems[i];
                }
                else {
                    Ext.apply(controlList[j], customItems[i]);
                }
            }
        }
        for (var i = 0; i < addItems.length; i++) {
            controlList.push(addItems[i]);
        }
        this.buildContainerControl(controlList);
        return controlList;
    },
//       listeners: {  
//        afterRender: function(thisForm, options){  
//            this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {  
//                enter: function(){
//                
//                keyNav(options);
//                
//                },  
//                scope: this  
//            });  
//        }  
//    },
    buildContainerControl: function (controlList) {
        var me = this;
        var containerFields;
        if (Ext.typeOf(me.containerFields) == "object") {
            containerFields = [me.containerFields];
        }
        if (Ext.typeOf(me.containerFields) == "array") {
            containerFields = me.containerFields;
        }
        if (!containerFields) {
            return controlList;
        }
        for (var i = 0; i < containerFields.length; i++) {
            var containerField = containerFields[i];
            var control = {};
            control.xtype = "fieldcontainer";
            if (containerField.display) {
                control.fieldLabel = containerField.display;
            }
            control.layout = { type: "hbox", align: "middle" };
            control.combineErrors = false;  //合并错误
            control.fieldDefaults = { hideLabel: containerField.hideLabel };
            control.defaultType = "textfield";
            control.items = [];
            if (containerField.colspan) {
                control.colspan = containerField.colspan;
            }
            for (var j = 0; j < containerField.fields.length; j++) {
                var field = containerField.fields[j];
                var result = this.getControl(field, controlList);
                if (result == null) {
                    throw new Error("字段" + field + "在model中不存在");
                }
                if (j == 0) {
                    controlList[result.index] = control;
                }
                else {
                    Ext.Array.remove(controlList, result.control);
                }
                if (Ext.typeOf(field) == "object") {
                    Ext.apply(result.control, field);
                }
                result.control.msgTarget = "none";
                control.items.push(result.control);
            }
        }

    },
    getControl: function (field, controlList) {
        var name;
        if (Ext.typeOf(field) == "string") {
            name = field;
        }
        else {
            name = field.name;
        }
        for (var i = 0; i < controlList.length; i++) {
            if (controlList[i].name == name) {
                return { index: i, control: controlList[i] };
            }
        }
        return null;
    },
    getFieldWidth: function (colspans) {
        var columns = this.layout.columns;
        var columnsWidth = null;
        if (Ext.typeOf(this.columnsWidth) == "number") {
            columnsWidth = new Array();
            for (var i = 0; i < columns; i++) {
                columnsWidth.push(this.columnsWidth);
            }
        }
        if (Ext.typeOf(this.columnsWidth) == "array") {
            if (this.columnsWidth.length < columns) {
                throw new Error('dataForm' + this.getName() + "中的配置项columnsWidth中的长度错误,当前的columns是" + columns + "而columnsWidth的长度是" + columnsWidth.length + ",两者应该保持一致");
            }
            columnsWidth = this.columnsWidth;
        }
        if (!columnsWidth) {
            columnsWidth = [];
            for (var i = 0; i < columns; i++) {
                columnsWidth.push(250);
            }
        }
        var result = 0;
        for (var i = 0; i < colspans.length; i++) {
            result += columnsWidth[colspans[i]];
        }
        return result - 20;
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
    sortControl: function (sortfields, controlList) {
        var newControlList = [];
        for (var i = 0; i < sortfields.length; i++) {
            for (var j = 0; j < controlList.length; j++) {
                if (controlList[j].name == sortfields[i]) {
                    newControlList.push(controlList[j]);
                    controlList.splice(j, 1);
                    break;
                }
            }
        }
        newControlList = newControlList.concat(controlList);
        return newControlList;
    },
    buildItems: function (controlList) {
        var row = 0, column = 0, columns = this.layout.columns;
        var table = new Array();
        for (var i = 0; i < 100; i++) {
            table.push(new Array());
        }
        for (var i = 0; i < controlList.length; i++) {
            var field = controlList[i];
            var length = 1;
            if (field.colspan != null) {
                length = field.colspan;
            }
            for (var x = 0; x < 100; x++) {
                var isBreak = false;
                for (var y = 0; y < columns; y++) {
                    //                    if (table[x][y] != null && table[x][y].xtype == "textfield" && field.xtype != "textfield") {
                    //                        break;
                    //                    }
                    if (table[x][y] != null) {
                        continue;
                    }
                    if (y + length > columns) {
                        break;
                    }
                    var canSet = true;
                    for (var z = 0; z < length; z++) {
                        if (table[x][y + z] != null) {
                            canSet = false;
                            break;
                        }
                    }
                    if (canSet == false) {
                        continue;
                    }
                    var colspans = [];
                    for (var z = 0; z < length; z++) {
                        var columnIndex = y + z;
                        colspans.push(columnIndex);
                        table[x][columnIndex] = field;
                        isBreak = true;
                    }
                    if (!field.width) {
                        field.width = this.getFieldWidth(colspans);
                    }
                    if (!field.labelWidth) {
                        field.labelWidth = this.getLabelWidth(colspans[0]);
                    }
                    break;
                }
                if (isBreak == true) {
                    break;
                }
            }
        }
        var items = new Array();
        var rowLength = x;
        for (var x = 0; x <= rowLength; x++) {
            for (var y = 0; y < columns; y++) {
                var field = table[x][y];
                if (field == null) {
                    items.push({ xtype: "label" });
                }
                var canAdd = true;
                for (var z = 0; z < items.length; z++) {
                    if (items[z] == field) {
                        canAdd = false;
                        break;
                    }
                }
                if (canAdd == true) {
                    items.push(field);
                }
            }
        }
        return items;
    },
    getLabelWidth: function (index) {
        var labelWidth = 60;
        if (this.columnsLabelWidth) {
            for (var i = 0; i < this.columnsLabelWidth.length; i++) {
                if (this.columnsLabelWidth[i][0] == index + 1) {
                    labelWidth = this.columnsLabelWidth[i][1];
                }
            }
        }
        return labelWidth;
    },
    getFieldDisplayLength: function (field) {
        var columns = this.layout.columns;
        if (columns == 2) {
            if (field.xtype == "textareafield") {
                return 2;
            }
            if (field.length == null || field.length <= 50) {
                return 1;
            }
            if (field.length > 50) {
                return 2;
            }
        }
        if (columns == 3) {
            if (field.xtype == "textareafield") {
                return 3;
            }
            if (field.length == null || field.length <= 50) {
                return 1;
            }
            if (field.length > 50 && field.length <= 100) {
                return 2;
            }
            if (field.length > 100) {
                return 3;
            }
        }
        if (columns == 4) {
            if (field.xtype == "textareafield") {
                return 2;
            }
            if (field.length > 50 && field.length <= 100) {
                return 2;
            }
            if (field.length > 100) {
                return 4;
            }
        }
        //            if (columns == 5) {
        //                if (field.length > 50 && field.length <= 100) {
        //                    length = 2;
        //                }
        //                if (field.length > 100 && field.length <= 200) {
        //                    length = 3;
        //                }
        //                if (field.length > 200 || field.xtype == "textareafield") {
        //                    length = columns;
        //                }
        //            }
        //            if (columns == 6) {
        //                if (field.length > 50 && field.length <= 100) {
        //                    length = 2;
        //                }
        //                if (field.length > 100 && field.length <= 200) {
        //                    length = 3;
        //                }
        //                if (field.length > 200 || field.xtype == "textareafield") {
        //                    length = 3;
        //                }
        //            }
    },
    getVType: function (field) {
        if (field.verify == null) {
            return null;
        }
        try {
            var verify = Ext.decode(field.verify);
            return verify;
        }
        catch (err) {
            return null;
        }
    },
    getIsShow: function (field) {
        if (field.formShow == false) {
            return false;
        }
        if (field.show == false) {
            return false;
        }
        return true;
    },
    getMaxLength: function (field) {
        if (field.length != null) {
            return field.length;
        }
        return null;
    },
    getAllowBlank: function (field) {
        if (field.required != null) {
            return !field.required;
        }
        return true;
    },
    controlFormatByXType: function (control, field, xtype) {
        control.xtype = xtype;
        if (xtype == "password") {
            control.xtype = "textfield";
            control.inputType = "password";
            return;
        }
        if (xtype == "datefield") {
            control.format = 'Y-m-d';
            if(field.minValue!=null){
            	control.minValue=field.minValue;
            }
            return;
        }
        if (xtype == "searchfield") {
            control.xtype = "searchfield";
            if (field.control) {
                control.control = field.control;
            }
            if (field.store) {
                control.store = field.store;
            }
            if (field.displayField) {
                control.displayField = field.displayField;
            }
            if (field.valueField) {
                control.valueField = field.valueField;
            }
             if (field.showId!=null&&field.showId!=undefined) {
                control.showId = field.showId;
            }
            if (field.pageSize) {
                control.pageSize = field.pageSize;
            }
            if (field.gridWidth) {
                control.gridWidth = field.gridWidth;
            }
            if (field.muitiSelect){
                control.muitiSelect = field.muitiSelect;
            }
            if (field.updateStore) {
                control.updateStore = field.updateStore;
            }
            if (field.hidden) {
                control.hidden = field.hidden;
            }
            if (field.editable==false) {
                control.editable = field.editable;
            }
            control.firstLoad = field.firstLoad==true?true:false;
            
            return;
        }
        if (xtype == "combo") {
            control.xtype = "dciscombo";
            if(!field.editable){
            	control.editable = field.editable;
            }
            if (field.data) {
                control.store = field.data;
            }
            if (field.multiSelect != null) {
                control.multiSelect = field.multiSelect;
            }
            if (field.unEdit) {
                control.unEdit = field.unEdit;
            }
            if (field.store) {
                field.triggerAction = "all";
                field.queryMode = "remote";
                if (field.store instanceof DCIS.ComboStore) {
                    control.displayField = field.store.getDisplayField();
                    control.valueField = field.store.getValueField();
                    control.store = field.store;
                }
                else {
                    control.store = DCIS.StoreMgr.get(field.store);
                }
            }
            if (field.canInputValue != null) {
                control.canInputValue = field.canInputValue;
            }
            if (field.selectDefault != null) {
                control.selectDefault = field.selectDefault;
            }
            if (field.displayField) {
                control.displayField = field.displayField;
            }
            if (field.valueField) {
                control.valueField = field.valueField;
            } if (field.value) {
                control.value = field.value;
            }
            return;
        }
        if (xtype == "numberfield") {
            control.hideTrigger = true;
            if (field.type.type == "int") {
            	if(field.minValue !=null){
                	control.minValue=0;
                	control.negativeText='该输入项不能为负'
                }
                control.allowDecimals = false;
            }
            if (field.type.type == "float") {
                control.allowDecimals = true;
                if(field.decimalPrecision !=null){
                	control.decimalPrecision=field.decimalPrecision;
                }
                if(field.maxValue !=null){
                	control.maxValue=field.maxValue;
                }
                if(field.minValue !=null){
                	control.minValue=0;
                	control.negativeText='该输入项不能为负'
                }
            }
            if (field.max != null) {
                control.maxValue = field.max;
            }
            if (field.min != null) {
                control.minValue = field.min;
            }
            return;
        }
        if (xtype == "dropdownlist") {
            if (field.store) {
                control.store = field.store;
            }
            if (field.displayField) {
                control.displayField = field.displayField;
            }
            if (field.valueField) {
                control.valueField = field.valueField;
            }
            if (field.pageSize) {
                control.pageSize = field.pageSize;
            }
            if (field.gridWidth) {
                control.gridWidth = field.gridWidth;
            }
            control.needValidate = field.needValidate==true?true:false;
            control.promot = field.promot==true?true:false;
            return;
        }
        if(xtype =="textfield")
        {
            if (field.unEdit) {
                control.unEdit = field.unEdit;
            }
            if (field.vtype) {
                control.vtype = field.vtype;
            }
        }
        if (xtype == "combotree") {
            if (field.treeUrl) {
                control.treeUrl = field.treeUrl;
            }
            if (field.displayField) {
                control.displayField = field.displayField;
            }
            if (field.fieldName) {
                control.fieldName = field.fieldName;
            }
            if (field.nodeParam) {
                control.nodeParam = field.nodeParam;
            }
            if (field.isValue) {
                control.isValue = field.isValue;
            }
            if (field.leafOnly) {
                control.leafOnly = field.leafOnly;
            }
            if (field.rootText) {
                control.rootText = field.rootText;
            }
            if (field.rootId) {
                control.rootId = field.rootId;
            }
            if (field.rootVisible) {
                control.rootVisible = field.rootVisible;
            }
			if (field.valueName) {
                control.valueName = field.valueName;
            }

            return;
        }
        if (xtype == "checkgroup") {
            if (field.store) {
                control.store = field.store;
            }
            if (field.itemWidth) {
                control.itemWidth = field.itemWidth;
            }
            if (field.columns) {
                control.columns = field.columns;
            }
            if (field.displayField) {
                control.displayField = field.displayField;
            }
            if (field.valueField) {
                control.valueField = field.valueField;
            }
            return;
        }
        if (xtype == "checkboxfield") {
            if (field.boxLabel) {
                control.boxLabel = field.boxLabel;
            }
            if (field.checked) {
                control.checked = field.checked;
            }
            return;
        }
    },
    getXtype: function (field) {
        if (field.controlType != null && field.controlType != "auto") {
            return field.controlType;
        }
        //field中的type是object类型,所以要进入他的属性type才能获取type的类型
        if (field.type == null) {
            return "textfield";
        }
        if (field.type.type == "int" || field.type.type == "float") {
            return "numberfield";
        }
        if (field.type.type == "string") {
            if (field.length == null || field.length < 200) {
                return "textfield";
            }
            else {
                return "textareafield";
            }
        }
        if (field.type.type == "date") {
            return "datefield";
        }

        if (field.isShow == true) {
            return "hiddenfield";
        }
    },
    isValid: function () {
        return this.basicForm.isValid();
    },
    getValues: function () {
        return this.basicForm.getValues();
    },
    getApplyValues: function () {
        return this.basicForm.getApplyValues();
    },
    setValues: function (values) {
        return this.basicForm.setValues(values);
    },
    reset: function () {
        return this.basicForm.reset();
    },
    getFields: function () {
        return this.basicForm.getFields();
    },
    setError: function (error) {
        return this.basicForm.setError(error);
    }
});