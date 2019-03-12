Ext.define('DCIS.AuditForm', {
	extend : "Ext.panel.Panel",
	alias : 'widget.auditForm',
	border : true,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	isUpdate:1,
	initComponent : function() {
		var me = this;
		var tcode = me.tcode;
		var id = me.bussid;
		var pat=me.pstatus;
		var ust=me.ustatus;
		var isUpdate=me.isUpdate;
		var messageId=me.messageId;
		var _store = new Ext.data.JsonStore({
					totalProperty : 'total',
					autoDestroy : false,
					proxy : {
						type : 'ajax',
						url : "api/systemAuditFacade/listAuditRecord/HTTP_REQ",
						reader : {
							type : 'json',
							root : 'data',
							idProperty : 'name'
						}
					},
					fields : ['auditTime', 'auditMan', 'auditNote', 'auditList']
				});
		_store.load({
					params : {
						tcode : tcode,
						id : id
					}
				});
		this.items = [{
		    xtype:'fieldset',
		    title : '审核记录',
		    height : 250,
			collapsible : true,
		    layout : {
				type : 'vbox',
				align : 'stretch'
			},
		    items:[{
			xtype : 'grid',
			region : 'north',
			forceFit : true,
			store : _store,
			flex:1,
			columns : [new Ext.grid.RowNumberer(), {
				text : '流程走向',
				dataIndex : 'auditList',
				renderer : function(value, p, record) {
					if (value != null) {
						return '<div style="white-space:normal;">' + value
								+ '</div>';
					} else {
						return value;
					}
				}
			}, {
				text : '提交意见',
				dataIndex : 'auditNote',
				renderer : function(value, p, record) {
					if (value != null) {
						return '<div style="white-space:normal;">' + value
								+ '</div>';
					} else {
						return value;
					}
				}
			}, {
				text : '提交时间',
				dataIndex : 'auditTime',
				renderer : function(value, p, record) {
					if (value != null) {
						return '<div style="white-space:normal;">' + value
								+ '</div>';
					} else {
						return value;
					}
				}
			}, {
				text : '提交人',
				dataIndex : 'auditMan'
			}]

		}]}, {
			xtype : 'panel',
			region : 'center',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			hidden:true,
			name : 'auditPanel',
			buttonAlign : 'center',
			buttons : [{
						text : '审核通过',
						iconCls : 'icon-ok',
						handler : function() {
							this.setDisabled(true);
                          var note=me.down('panel[name="auditPanel"]').down('fieldset').down('textareafield').getValue();
							callapi("systemAuditFacade/audit", {
										tcode : tcode,
										id : id,
										ispass:1,
										st:pat,
										note:note,
										isUpdate:isUpdate
									}, function(result) {
										me.callback(1,result.data,messageId,note);
									});

						}
					}, {
						text : '审核不通过',
						iconCls : 'icon-no',
						handler : function() {
								this.setDisabled(true);
                             var note=me.down('panel[name="auditPanel"]').down('fieldset').down('textareafield').getValue();
								callapi("systemAuditFacade/audit", {
										tcode : tcode,
										id : id,
										ispass:0,
										st:ust,
										note:note,
										isUpdate:isUpdate
									}, function(result) {
										me.callback(0,result.data,messageId,note);
									});

						}

					}],
			items : [{
						xtype : 'fieldset',
						title : '审核意见',
						layout : {
							type : 'vbox',
							align : 'stretch'
						},
						collapsible : false,
						items : [{
									xtype : "textareafield",
									height: 100
								}]
					}]
		}];
		callapi("systemAuditFacade/isCanAudit", {
					tcode : tcode,
					id : id
				}, function(result) {
					if (result) {
						me.down('panel[name="auditPanel"]').show();
						if(me.hidePanel){
							me.down('panel[name="auditPanel"]').hide();
						}
					}
				});
		this.superclass.initComponent.call(this);
	},
	hidePanel: false
});