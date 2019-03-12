Ext.define('DCIS.MsgWindow', {
	extend : 'Ext.window.Window',
	title : '提示',
	alias : 'widget.msgWindow',
	resizable : false,
	modal : true,
	closable : true,
	height : 112,
	width : 308,
	bodyBorder : false,
	frame : true,
	msgText : '',
	layout : {
		type : 'hbox',
		align : 'middle'
	},
	buttonAlign : 'center',
	initComponent : function() {
		var me = this;
		me.callParent();
		this.add({
					xtype : 'label',
					width : 15
				},{
					xtype : 'image',
					border : false,
					frame : true,
					width : 32,
					height : 32,
					src : './resources/themes/images/default/shared/icon-question.gif'
				});
		this.add({
					xtype : 'label',
					width : 15
				}, {
					xtype : 'label',
					border : false,
					text : me.msgText
				});
	},
	buttons : [{
				text : '是',
				handler : function() {
					this.up('window').callback('yes');
					this.up('window').close();
				}
			}, {
				text : '否',
				handler : function() {
					this.up('window').callback('no');
					this.up('window').close();
				}
			}]
});