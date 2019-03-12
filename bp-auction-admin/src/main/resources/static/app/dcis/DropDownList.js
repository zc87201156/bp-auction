/// <reference path="../../Resources/ext-all-dev.js" />
Ext.define("DCIS.DropDownList", {
    extend: "Ext.form.field.Picker",
    alias: "widget.dropdownlist",
    matchFieldWidth: false,
    border: false,
    multiSelect: false,
  	needValidate:true,
    valueType: this.valueType || true,
    promot:true,
    selectRecords: [],
    config: {
        displayField: null,
        valueField: null,
        gridWidth: null,
        needValidate:null
    },
    constructor: function (cfg) {
        var config = {};
        if (this.gridWidth == null) {
            this.setGridWidth(240);
        }
        Ext.apply(config, cfg);
        if (config.multiSelect != null) {
            this.multiSelect = config.multiSelect;
        }
        if (config.url) {
            var storeCfg = { autoLoad: true };
            if (cfg.pageSize != null) {
                storeCfg.pageSize = cfg.pageSize;
            }
            storeCfg.url = config.url;
            delete config.url;
            if (config.model) {
                storeCfg.model = config.model;
                delete config.model;
            }
            if (config.fields) {
                storeCfg.fields = config.fields;
                delete config.fields;
            }
            this.store = Ext.create("DCIS.Store", storeCfg);
        }
        if (config.store) {
            var storeCfg = { autoLoad: true };
            if (cfg.pageSize != null) {
                storeCfg.pageSize = cfg.pageSize;
            }
            this.store = DCIS.StoreMgr.get(config.store, storeCfg);
            if (cfg.pageSize != null) {
                this.store.pageSize = cfg.pageSize;
            }
            delete config.store;
        }
        if(config.promot!=null){
        	this.promot=config.promot;
        }
        if(config.needValidate!=null){
        	this.needValidate=config.needValidate;
        }
        this.callParent([config]);
        this.initConfig(config);
    },
    setValue: function () {
        this.isSetValue = true;
        this.callParent(arguments);
        this.isSetValue = false;
    },
    initComponent: function () {
        var me = this;
        me.on("change", me.searchValue, me);
        me.on('specialkey',me.keydown,me);
        me.on('expand',function(){
        	me.firstExpand=true;
        },me);
        if(this.needValidate){
        	me.on('blur',me.blur,me);
        }
        me.callParent();
    },
    
    blur:function(sender,e,obj){
    	var me=this;
    	var grid=this.picker;
    	if(grid!=null){
    		grid.store.load({
    			params: [this.getValue()],
    			callback:function(){
    				if(grid.store.getCount()==0){
	    				me.reset();
			    	}
			    	if(grid.store.getCount()>0){
			    		grid.getSelectionModel().select(0);
			    		me.onSelectItem(null,grid.store.getAt(0));
			    	}
    			}
    		});
    	}
    },
    
    keydown:function(sender,e,obj){
    	var me=this;
    	var grid=this.picker;
    	var currentKey=e.getKey();
    	var index=-1;
    	
    	if(currentKey!=e.UP&&currentKey!=e.DOWN&&currentKey!=e.LEFT&&currentKey!=e.RIGHT&&currentKey!=e.ENTER){
    		return ;
    	}
    	if(!me.isExpanded){
    		delete me.firstExpand;
    		return ;
    	}
    	if(grid==null||grid.rendered==false){
    		return ;
    	}
    	
    	var record=grid.getSelectionModel().getSelection();
    	if(record==null||record.length==0){
    		record=null;
    	}
    	else{
    		record=record[0];
    	}
    	if(record!=null){
    		index=me.store.indexOf(record);
    	}
    	var pagingToolBar=grid.query('pagingtoolbar');
    	if(pagingToolBar!=null&&pagingToolBar.length>0){
    		pagingToolBar=pagingToolBar[0];
    	}
    	if(currentKey==e.LEFT){
    	   pagingToolBar.movePrevious();
    	}
    	else if(currentKey==e.RIGHT){
    		pagingToolBar.moveNext();
    	}
    	else if(currentKey==e.DOWN){
    		index++;
    		if(index>=me.store.getCount()){
    			return ;
    		}
    		grid.getSelectionModel().select(index);
    	}
    	else if(currentKey==e.UP){
    		index--;
    		if(index<=0){
    			index=0;
    		}
    		grid.getSelectionModel().select(index);
    	}
    	if(currentKey==e.ENTER){
    		var onlyOne=grid.store.getCount();
    		var finalRecord ;
    		if(onlyOne==1){
    			record=grid.store.getAt(0);
    			grid.getSelectionModel().select(0);
    		}
    		me.onSelectItem(null,record);
    	}
    },
    storeLoaded: function (sender, records, successful, eOpts) {
        var me = this;
        if (successful == false) {
            return;
        }
        if (records.length > 0) {
            me.expand();
        }
    },
    getSubmitData: function () {
        var data = this.callParent(arguments);
        data[this.getName()] = this.hiddenValue;
        return data;
    },

    searchValue: function (sender, newValue, oldValue, eOpts) {
    	if(this.promot){
        	sender.setHiddenValue(sender.value);
        }
        if (this.isSetValue) {
            return;
        }
        var me = this;
        if (this.isSetValue == true) {

            return;
        }
        if (me.cancelChange == true) {
            me.cancelChange = false;
            return;
        }
        if (!me.isSetLoadEvent) {
            me.store.on("load", me.storeLoaded, me);
            me.isSetLoadEvent = true;
        }
        if (this.valueType) {
            me.store.load({ params: [newValue] });
        }
        else {
            me.store.load({ params: Ext.JSON.decode("{\"" + this.name + "\":\"" + newValue + "\"}") });
        }
    },
    createPicker: function () {
        var me = this;
        var dataGrid = {
            store: me.store,
            pickerField: me,
            width: this.gridWidth,
            forceFit: true,
            focusOnToFront: false,
            border: false,
            floating: true
        };
        if (this.multiSelect == true) {
            dataGrid.selModel = { mode: "SIMPLE" };
        }
        if(this.valueType){
        	me.store.load({ params: [this.getValue()] });
        }
        else{
    		me.store.load({ params: Ext.JSON.decode("{\"" + this.name + "\":\"" + this.getValue() + "\"}") });
    	}
        me.picker = Ext.create("DCIS.DataGrid", dataGrid);

        me.picker.on("itemclick", me.onSelectItem, me);
        return me.picker;
    },
    setHiddenValue: function (value) {
        this.hiddenValue = value;
    },
    setByRecord: function (values) {
        var displayField = this.getDisplayField;
        var valueField = this.getValueField;
        if (values instanceof Ext.data.Model) {
            if (displayField != null) {
                this.setValue(values.get(displayField));
                this.setHiddenValue(values.get(valueField));
            }
            else {
                this.setValue(values[displayField]);
                this.setValue(values[valueField]);
            }
        }
    },
    setValue: function () {
        this.isSetValue = true;
        this.callParent(arguments);
        this.isSetValue = false;
    },
    onSelectItem: function (sender, record, item, index, e) {
        this.fireEvent('gridItemClick', record);
        
        var me = this;
        
        if (record == null) {
            return;
        }
        var selModel = me.picker.getSelectionModel();
        if (selModel.isSelected(record)) {
            if (me.multiSelect == true) {
                me.selectRecords.push(record);
            }
            else {
                me.selectRecords = record;
            }
        }
        else {
            if (me.multiSelect == true) {
                Ext.Array.remove(me.selectRecords, record);
            }
            else {
                me.selectRecords = null;
            }
        }
        var displayField = this.getDisplayField();
        var valueField = this.getValueField();
        var displayValue = null;
        if (Ext.typeOf(displayField) == "string") {
            if (Ext.typeOf(me.selectRecords) == "array") {
                for (var i = 0; i < me.selectRecords.length; i++) {
                    if (i == 0) {
                        displayValue = me.selectRecords[i].get(displayField);
                        continue;
                    }
                    displayValue += ";" + me.selectRecords[i].get(displayField);
                }
            }
            else {
                displayValue = me.selectRecords.get(displayField);
            }
        }
        if (Ext.typeOf(displayField) == "function") {
            displayValue = displayField(me.selectRecords);
        }

        var valueFieldValue = "";
        if (Ext.typeOf(valueField) == "string") {
            if (Ext.typeOf(me.selectRecords) == "array") {
                for (var i = 0; i < me.selectRecords.length; i++) {
                    if (i == 0) {
                        valueFieldValue = me.selectRecords[i].get(valueField);
                        continue;
                    }
                    valueFieldValue += ";" + me.selectRecords[i].get(valueField);
                }
            }
            else {
                valueFieldValue = me.selectRecords.get(valueField);
            }
        }
        if (Ext.typeOf(displayField) == "function") {
            valueFieldValue = displayField(me.selectRecords);
        }
        me.cancelChange = true;
        me.setRawValue(displayValue);
        me.setHiddenValue(valueFieldValue);
        if (this.multiSelect != true) {
            me.collapse();
        }
    }
});