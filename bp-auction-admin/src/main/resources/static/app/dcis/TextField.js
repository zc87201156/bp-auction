Ext.define('DCIS.TextField',{
	extend : "Ext.form.field.Text",
	alias : 'widget.textField',
	border : true,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	readOnly: true,
	allowBlank : false,
	afterLabelTextTpl : required,
	colspan : 1,
	labelWidth : 100,
	fieldLabel : '商品规格型号',
	name : 'GModel',
	initComponent : function() {}
});