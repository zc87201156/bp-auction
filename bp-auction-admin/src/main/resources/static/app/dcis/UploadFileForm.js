Ext.define('DCIS.UploadFileForm', {
	extend : "Ext.form.Panel",
	alias : 'widget.uploadFileForm',
	layout : 'border',
	border : false,
	bsId : '',
	tableName : '',
	fileType : '',
	store : null,
	hideToolBar : false,
	view : false,
	buttonHidden : false,
	initComponent : function() {
		var me = this;
		var tableName = this.tableName;
		var path = this.path;
		var me = this;
		var fileType = this.fileType;
		var _store = new Ext.data.JsonStore({
					autoDestroy : false,
					proxy : {
						type : 'ajax',
						url : "api/dsqFileUploadFacade/listFlie/HTTP_REQ",
						reader : {
							type : 'json',
							root : 'data',
							idProperty : 'name'
						}
					},
					fields : ['id', 'filename', 'filepath', 'uploader',
							'uploadtime', 'bsid', 'menutable', 'uploaderorg']
				});

		me.store = _store;
		_store.load({
					params : {
						tableName : tableName,
						id : me.bsId
					}
				});

		this.items = [{
			xtype : 'grid',
			forceFit : true,
			columnLines : true,
			store : _store,
			region : 'center',
			border : false,
			autoScroll : true,
			tbar : {
				xtype : 'titlebar',
				hidden : me.hideToolBar,
				items : [{
					text : '上传文件',
					style : $toolBarStyle,
					iconCls : "icon-add",
					hidden : me.buttonHidden,
					handler : function() {
						var _myform = new Ext.form.FormPanel({
							buttonAlign : 'center',
							frame : true,
							border : false,
							fileUpload : true,
							layout : {
								type : 'vbox',
								align : 'stretch'
							},
							items : [{
										allowBlank : false,
										xtype : 'fileuploadfield',
										emptyText : '请选择要上传的文件',
										fieldLabel : '请选择文件',
										name : 'formFile',
										id : 'fileuploadfieldFileName',
										buttonText : '浏览...',
										buttonCfg : {
											iconCls : 'upload-icon'
										}
									}],
							buttons : [{
								text : '提交',
								handler : function() {
									var fileName = Ext.getCmp('fileuploadfieldFileName').getValue();
									var fileH = fileName.split('.');
									var fileHo = fileH[fileH.length - 1];
									if (fileType != '') {
										var items = fileType.split(',');
										var a = 0;
										for (var i = 0; i < items.length; i++) {
											if (fileHo.toUpperCase() == items[i].toUpperCase()) {
												a++;
											}
										}
										if (a == 0) {
											Ext.MessageBox.show({
														title : "错误",
														msg : '对不起,文件格式不符合要求,格式只能是['+ fileType+ "]这些格式",
														modal : true,
														icon : Ext.Msg.ERROR,
														buttons : Ext.Msg.OK
													});
											return;
										}
									}
									_myform.submit({
										url : 'api/dsqFileUploadFacade/saveFileUpload/HTTP_RESP?path='+ path+ '&bsid='+ me.bsId+ '&menutable=' + tableName,
										waitMsg : '正在保存文件...',
										success : function(fp, o) {
											_win.close();
											_store.load({
														params : {
															tableName : tableName,
															id : me.bsId
														}
													});
										},
										failure : function() {
											Ext.MessageBox.show({
														title : "错误",
														msg : '文件上传失败',
														modal : true,
														icon : Ext.Msg.ERROR,
														buttons : Ext.Msg.OK
													});
										}
									});

								}
							}, {
								text : '取消',
								handler : function() {
									_win.close();
								}
							}]
						});
						var _win = new Ext.Window({
									title : '选择上传文件',
									layout : {
										type : 'vbox',
										align : 'stretch'
									},
									width : 320,
									modal : true,
									resizable : false,
									border : false,
									closable : true,
									items : [_myform]
								});
						_win.show();
					}
				}, {
					text : '删除文件',
					style : $toolBarStyle,
					iconCls : "icon-remove",
					hidden : me.buttonHidden,
					handler : function() {
						if (this.ownerCt.ownerCt.getSelectionModel().getSelection().length == 0) {
							Ext.MessageBox.show({
										title : "提示",
										msg : '请选择一个文件',
										modal : true,
										icon : Ext.Msg.INFO,
										buttons : Ext.Msg.OK
									});
							return;
						}
						var id = this.ownerCt.ownerCt.getSelectionModel().getSelection()[0].data.id;
						Ext.Msg.confirm("确认", "确定要删除此文件？", function(button) {
							if (button == "yes") {
								callapi("dsqFileUploadFacade/deleteFlie",{fileId:id},function call(re) {
											_store.load({
														params : {
															tableName : tableName,
															id : me.bsId
														}
													});
										}, null, null);
							}
						});

					}
				}, {
					text : '下载文件',
					style : $toolBarStyle,
					iconCls : "icon-save",
					handler : function() {
						if (this.ownerCt.ownerCt.getSelectionModel().getSelection().length == 0) {
							Ext.MessageBox.show({
										title : "提示",
										msg : '请选择一个文件',
										modal : true,
										icon : Ext.Msg.INFO,
										buttons : Ext.Msg.OK
									});
							return;
						}
						var record = this.ownerCt.ownerCt.getSelectionModel().getSelection()[0];
						var url = 'api/dsqFileUploadFacade/downLoadFlie/HTTP_RESP?id='+ record.data.id;
						imgId = record.data.id;
						location.href = url;
					}
				}]
			},
			listeners : {
				itemdblclick : function(grid, record, item, index, e, eOpts) {
					if (me.view) {
						var imgPanel = Ext.create('Ext.window.Window', {
							title : record.data.filename,
							modal : false,
							closeAction : 'hide',
							layout : 'fit',
							width : 400,
							height : 432,
							items : [{
								border : false,
								html : '<img id="imageView" height="400" width="400" src ="api/dsqFileUploadFacade/downLoadFlie/HTTP_RESP?id='
										+ record.data.id+ '"  onmouseover="qsoft.PopBigImage.create(this,10,0,1,1,true);" galleryimg="no"/>'
							}]
						});
						var ons = function() {
							new qsoft.PopBigImage("imageView", 1, 0, 1, 1).render();
						}
						imgPanel.show();
						ons();
					}
				}
			},
			tooltip : me.tooltip,
			columns : [{
						dataIndex : 'filename',
						text : '文件列表'
					}]
		}]
		this.superclass.initComponent.call(this);
	},
	setBsid : function(bsid) {
		this.bsId = bsid;
	},
	getStore : function() {
		return this.store;
	},
	setTableName : function(tableName) {
		this.tableName = tableName;
	}
})