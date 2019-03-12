Ext.define('WF.maincontent.undefinded', {
	extend : 'Ext.panel.Panel',
	alias : "widget.maincontent_undefinded",
	itemId : 'maincontent_undefinded',
	title : '页面找不到',
	closable : true,
	plain : true,
	border : false,
	layout : {
		type : 'vbox',
		align : 'center'
	},
	items:[{
		border : false,
		xtype:'image',
		height:487,
		width:608,
	    src:'./resources/images/error1.jpg'
	}]
});