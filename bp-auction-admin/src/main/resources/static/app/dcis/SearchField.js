Ext.define("DCIS.SearchField", {
	extend : "Ext.form.field.Picker",
	alias : "widget.searchfield",
	control : null,
	store : null,
	triggerCls : "x-form-search-trigger",
	matchFieldWidth : false,
	showId : false,
	config : {
		displayField : null,
		valueField : null,
		gridWidth : null,
		needValidate : null,
		hiddenValue : null,
		baseParams : null
	},
	enableKeyEvents : true,
	constructor : function(cfg) {
		var config = {};
		var me = this;
		if (this.gridWidth == null) {
			this.setGridWidth(240);
		}
		Ext.apply(config, cfg);
		if (config.store) {
			var storeCfg = {};
			if (cfg.pageSize != null) {
				storeCfg.pageSize = cfg.pageSize;
			}
			if (cfg.baseParams != null) {
				storeCfg.baseParams = cfg.baseParams;
			}
			var store = DCIS.StoreMgr.get(config.store, storeCfg);

			if (cfg.baseParams != null) {
				store.getProxy().extraParams = cfg.baseParams;
			}
			this.store = store;
			if (cfg.pageSize != null) {
				this.store.pageSize = cfg.pageSize;
			}
			delete config.store;
		}
		this.callParent([config]);
	},
	initComponent : function() {
		var me = this;
		me.callParent();

		me.on("change", me.searchValue, me);
		me.on('keydown', me.specialKeyAction, me);
		me.on('expand', function() {
					me.firstExpand = true;
				}, me);
		// me.on('blur',me.blur,me);
	},

	blur : function() {
		var me = this;
		var grid = this.picker;
		if (grid != undefined && (me.store.getCount() > 0)) {
			me.onSelectItem(null, grid.store.getAt(0));
		}
	},
	specialKeyAction : function(sender, e, obj) {
		var me = this;
		var grid = this.picker;
		var currentKey = e.getKey();
		var index = -1;

		if (grid == undefined) {
			return;
		}

		if (currentKey != e.UP && currentKey != e.DOWN && currentKey != e.LEFT
				&& currentKey != e.RIGHT && currentKey != e.ENTER) {
			return;
		}
		if (!me.isExpanded) {
			delete me.firstExpand;
			return;
		}
		if (grid == null || grid.rendered == false) {
			return;
		}

		var record = grid.getSelectionModel().getSelection();
		if (record == null || record.length == 0) {
			record = null;
		} else {
			record = record[0];
		}

		if (record != null) {
			index = me.store.indexOf(record);
		}
		var pagingToolBar = grid.query('pagingtoolbar');
		if (pagingToolBar != null && pagingToolBar.length > 0) {
			pagingToolBar = pagingToolBar[0];
		}
		if (currentKey == e.LEFT) {
			pagingToolBar.movePrevious();
		} else if (currentKey == e.RIGHT) {
			pagingToolBar.moveNext();
		} else if (currentKey == e.DOWN) {
			index++;
			if (index >= me.store.getCount()) {
				return;
			}
			grid.getSelectionModel().select(index);
		} else if (currentKey == e.UP) {
			index--;
			if (index <= 0) {
				index = 0;
			}
			grid.getSelectionModel().select(index);
		}
		if (currentKey == e.ENTER) {
			var onlyOne = grid.store.getCount();
			var finalRecord;
			if (onlyOne == 1) {
				record = grid.store.getAt(0);
				grid.getSelectionModel().select(0);
			}
			me.onSelectItem(null, record);
		}
		me.focus();
	},
	cannotClick : function() {
		this.canClickFlag = false;
	},
	canClick : function() {
		this.canClickFlag = true;
	},

	setReadOnly : function() {
		this.callParent(arguments);
		if (arguments.length == 1) {
			if (arguments[0] == true)
				this.canClickFlag = false;
			else
				this.canClickFlag = true;
		} else {
			this.canClickFlag = true;
		}

	},
	searchValue : function(sender, newValue, oldValue, eOpts) {

		var me = this;
		// 如果是由弹窗设置的值，不触发change事件。
		if (newValue == '' || newValue == null) {
			newValue = null;
			me.collapse();
			return;
		}
		if (newValue == oldValue)
			return;
		if (this.setbyWindow) {
			delete this.setbyWindow;
			return;

		}
		if (this.isSetValue) {
			return;
		}
		if (this.isSetValue == true) {
			return;
		}
		if (me.cancelChange == true) {
			me.cancelChange = false;
			return;
		}
		if (!me.isSetLoadEvent) {
			if (me.store != null) {
				me.store.on("load", me.storeLoaded, me);
			}
			me.isSetLoadEvent = true;
		}
		// 复制内容时
		if (newValue.indexOf("(") >= 0 && newValue.indexOf(")") >= 0) {
			var codeValue = newValue.split("(")[1].split(")")[0];
			if (newValue.split("(")[1].split(")")[0] == oldValue
					|| newValue.split("(")[0] == oldValue)
				return;
			me.store.proxy.extraParams = Ext.apply({}, me.baseParams);
			me.store.load({
						params : {
							data : codeValue
						},
						callback : function() {
							if (this.getCount() > 0) {
								// me.expand();
								// me.picker.getSelectionModel().select(0);
								// me.focus();
								me.fireEvent('copyEvent', me.store.getAt(0));
								me.setHiddenValue(codeValue);
								me.setValue(newValue.split("(")[0]);
							} else {
								Ext.MessageBox.alert("提示框", "数据不存在");
								me.setHiddenValue("");
								me.setValue("");
							}
						}
					});
		} else {

			me.store.proxy.extraParams = Ext.apply({}, me.baseParams);
			me.store.load({
						params : {
							data : newValue
						},
						callback : function() {

							if (this.getCount() > 0) {
								me.expand();
								me.picker.getSelectionModel().select(0);
								me.focus();
							}
							else
							{
							me.collapse();
							}
							me.store.proxy.extraParams = Ext.apply(
									me.store.proxy.extraParams, {
										data : newValue
									});
						}
					});
		}

	},
	onDownArrow : function(e) {
		if (!this.isExpanded) {
			return;
		}
	},
	onTriggerClick : function() {
		if (!this.fireEvent('beforeclick', this)) {
			return;
		}
		if ((this.canClickFlag != null) && (!this.canClickFlag)) {
			return;
		}
		var me = this;
		var store = me.store;

		if (store != null) {
			if (this.muitiSelect) {
				var element = Ext.create('DCIS.SearchWindowMultiSelect', {
							store : this.store,
							pageSize : this.pageSize,
							displayField : this.displayField,
							valueField : this.valueField,
							updateStore : this.updateStore,
							value : this.hiddenValue,
							extraParams : this.extraParams,
							baseParams : this.baseParams
						});
				element.searchField = me;
				element.show();
				return;
			} else {
				var storeCfg = {};
				if (this.pageSize != null) {
					storeCfg.pageSize = this.pageSize;
				}
				if (this.windowStore == null) {
					this.windowStore = this.store;
					this.firstLoad = true;
				} else {
					this.firstLoad = false;
				}

				var element = Ext.create('DCIS.SearchWindow', {
							store : this.windowStore,
							pageSize : this.pageSize,
							displayField : this.displayField,
							extraParams : this.extraParams,
							firstLoad : this.firstLoad,
							valueField : this.valueField,
							baseParams : this.baseParams,
							firstLoad : true
						});
				element.searchField = me;
				me.searchField = element;
				element.show();
			}

		} else {
			var control = me.control;
			if (control == null) {
				return;
			}
			if (control instanceof Ext.window.Window) {
				control.show();
				control.searchField = me;
				return;
			}
			if (Ext.typeOf(control) == "string") {
				var element = Ext.create(control, {
							searchField : me
						});
				element.searchField = me;
				element.show();
				return;
			}
			if (control["xtype"] != null) {
				var element = Ext.widget(control);
				element.searchField = me;
				element.show();
				return;
			} else {
				var element = Ext.create("DCIS.SearchFieldWindow", control);
				control.searchField = me;
				element.show();
				return;
			}
		}
	},

	createPicker : function() {
		var me = this;
		var dataGrid = {
			store : me.store,
			pickerField : me,
			width : me.getGridWidth(),
			forceFit : true,
			focusOnToFront : false,
			border : false,
			floating : true
		};
		if (this.multiSelect == true) {
			dataGrid.selModel = {
				mode : "SIMPLE"
			};
		}

		// 复制内容时
		if (this.value.indexOf("(") >= 0 && this.value.indexOf(")") >= 0) {
			var codeValue = this.value.split("(")[1].split(")")[0]
			me.store.load({
						params : {
							data : codeValue
						}
					});
		} else {
			me.store.load({
						params : {
							data : this.getValue()
						}
					});
		}
		me.picker = Ext.create("DCIS.DataGrid", dataGrid);
		me.picker.on("itemclick", me.onSelectItem, me);
		return me.picker;
	},

	setHiddenValue : function(value) {
		this.hiddenValue = value;
	},
	setDisplayValue : function(value) {
		this.displayValue = value;
	},
	storeLoaded : function(sender, records, successful, eOpts) {
		var me = this;
		if (successful == false) {
			return;
		}

	},

	getHiddenValue : function() {
		return this.hiddenValue;
	},
	getDisplayValue : function() {
		return this.displayValue;
	},
	getSubmitData : function() {
		var me = this, data = null;
		if (!me.disabled && me.submitValue && !me.isFileUpload()) {
			data = {};
			var value = me.getHiddenValue();
			if (value == null) {
				var displayValue = me.getValue();
				if (displayValue == null) {
					data[me.getName()] = '';
				} else {
					data[me.getName()] = displayValue;
				}
			} else {
				data[me.getName()] = value;
			}
		}
		return data;
	},

	setValue : function() {
		var me = this;
		this.isSetValue = true;
		this.callParent(arguments);
		this.isSetValue = false;

		if (me.showId) {
			if (me.getHiddenValue() != null && me.getHiddenValue() != ""
					&& me.getValue() != null && me.getValue() != "") {
				if (me.getValue().indexOf("(") >= 0
						&& me.getValue().indexOf(")") >= 0) {
					me.setRawValue(me.getValue());
				} else {
					if (me.getValue() != me.getHiddenValue()) {
						me.setRawValue(me.getValue() + '('
								+ me.getHiddenValue() + ')');
					} else {
						me.setRawValue(me.getValue());
					}
				}
			}
		}

	},
	onSelectItem : function(sender, record, item, index, e) {
		this.fireEvent('gridItemClick', record);

		var me = this;

		if (record == null) {
			return;
		}
		var selModel = me.picker.getSelectionModel();
		if (selModel.isSelected(record)) {
			if (me.multiSelect == true) {
				me.selectRecords.push(record);
			} else {
				me.selectRecords = record;
			}
		} else {
			if (me.multiSelect == true) {
				Ext.Array.remove(me.selectRecords, record);
			} else {
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
			} else {
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
					valueFieldValue += ";"
							+ me.selectRecords[i].get(valueField);
				}
			} else {
				valueFieldValue = me.selectRecords.get(valueField);
			}
		}
		if (Ext.typeOf(displayField) == "function") {
			valueFieldValue = displayField(me.selectRecords);
		}
		// me.cancelChange = true;
		if (this.showId) {
			me.setRawValue(displayValue + "(" + valueFieldValue + ")");
		} else {
			me.setRawValue(displayValue);
		}
		me.setHiddenValue(valueFieldValue);
		me.setDisplayValue(displayValue);
		me.un('blur');
		if (this.multiSelect != true) {
			me.collapse();
		}
	}
});