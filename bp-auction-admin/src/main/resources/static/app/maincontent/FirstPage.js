Ext.define('WF.maincontent.FirstPage', {
	extend : 'Ext.panel.Panel',
	alias : "widget.maincontent_firstpage",
	itemId : 'firstPageItemId',
	title : '首页',
	plain : true,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	border : false,
	statics : {
		openAl : function(code) {

		}
	},
	initComponent : function() {
    var me=this;
	this.callParent(arguments);
	document.getElementById('defaultLoading').style.display = 'none';
	}
});