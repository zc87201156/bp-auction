Ext.define('DCIS.FileImageForm', {
	extend : "Ext.form.Panel",
	alias : 'widget.fileImageForm',
	layout : 'border',
	border : false,
	bsId : '',
	tableName : '',
	fileType : '',
	infoType : '1',
	store : null,
	buttonHiden : false,
	tbar : [{
		text : '上传',
		iconCls : "icon-add",
		name : 'upLoadButton',
		handler : function() {
			var me = this.up('panel');
			var tableName = me.tableName;
			var path = me.path;
			var fileType = me.fileType;
			var infoType = me.infoType;
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
					},
					listeners : {
						change : function(a, value, c) {
							var filename = "";
							if (value.indexOf('\\') > 0) {
								var obj = value.split('\\');
								if (obj.length > 0) {
									filename = obj[obj.length - 1].split('.')[0];
								}
							} else {
								filename = value.split('.')[0];
							}
							this.up('panel').down('textfield[name="fileName"]').setValue(filename);
						}
					}
				}, {
					xtype : 'textfield',
					fieldLabel : '文件名称',
					name : 'fileName',
					allowBlank : false
				}, {
					xtype : 'hidden',
					name : 'infoType',
					value : infoType
				}],
				buttons : [{
					text : '提交',
					handler : function() {
						var fileName = Ext.getCmp('fileuploadfieldFileName').getValue();
						var fileName1 = this.up('panel').down('textfield[name="fileName"]').getValue();
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
											msg : '对不起,文件格式不符合要求,格式只能是['+ fileType + "]这些格式",
											modal : true,
											icon : Ext.Msg.ERROR,
											buttons : Ext.Msg.OK
										});
								return;
							}
						}
						function getFileSize(target) {
							var isIE = /msie/i.test(navigator.userAgent)&& !window.opera;
							var fs = 0;
							if (isIE && !target.files) {
								var filePath = target.value;
								var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
								var file = fileSystem.GetFile(filePath);
								fs = file.Size;
							} else if (target.files && target.files.length > 0) {
								fs = target.files[0].size;
							} else {
								fs = 0;
							}
							if (fs > 0) {
								fs = fs / 1024;
							}
							return fs;
						} // 取控件DOM对象
						var field = document.getElementById('fileuploadfieldFileName');
						// 取控件中的input元素
						var inputs = field.getElementsByTagName('input');
						var fileInput = null;
						var il = inputs.length;
						// 取出input 类型为file的元素
						for (var i = 0; i < il; i++) {
							if (inputs[i].type == 'file') {
								fileInput = inputs[i];
								break;
							}
						}
						if (fileInput != null) {
							var fileSize = getFileSize(fileInput);
							// 允许上传不大于1M的文件
							if (fileSize > 1000) {
								Ext.MessageBox.show({
											title : "提示",
											msg : '文件太大，请选择小于1M的图片文件',
											modal : true,
											icon : Ext.Msg.INFO,
											buttons : Ext.Msg.OK
										});
								return;
							}
						}
						_myform.submit({
							url : 'api/dsqFileUploadFacade/saveFileUpload/HTTP_RESP?path='+ path+ '&bsid='+ me.bsId+ '&menutable='+ tableName+ '&infoType='+ infoType+ '&fileName=' + fileName1,
							waitMsg : '正在保存文件...',
							success : function(fp, o) {
								_win.close();
								me.down('dataview').getStore().load({
											params : {
												tableName : tableName,
												id : me.bsId,
												fileType : me.infoType
											}
										});
							},
							failure : function() {
								Ext.MessageBox.show({
											title : "提示",
											msg : "上传失败",
											modal : true,
											icon : Ext.Msg.INFO,
											buttons : Ext.Msg.ERROR
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
		text : '删除',
		iconCls : "icon-remove",
		name : 'deleteButton',
		handler : function() {
			var me = this.up('panel');
			if (this.up('panel').down('dataview').getSelectionModel().getSelection().length == 0) {
				Ext.MessageBox.show({
							title : "提示",
							msg : "请选择一个文件",
							modal : true,
							icon : Ext.Msg.INFO,
							buttons : Ext.Msg.OK
						});
				return;
			}
			var id = this.up('panel').down('dataview').getSelectionModel().getSelection()[0].data.id;
			Ext.Msg.confirm("确认", "确定要删除此文件？", function(button) {
						if (button == "yes") {
							callapi("dsqFileUploadFacade/deleteFlie", {fileId : id}, function call(re) {
										me.down('dataview').getStore().load({
													params : {
														tableName : me.tableName,
														id : me.bsId,
														fileType : me.infoType
													}
												});
									}, null, null);
						}
					});

		}
	}],
	initComponent : function() {
		var me = this;
		var tableName = this.tableName;
		var path = this.path;
		var me = this;
		var fileType = this.fileType;
		if (me.buttonHiden == true) {
			me.tbar = [];
		}
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
						id : me.bsId,
						fileType : me.infoType
					}
				});
		var viewer = Ext.create('Ext.view.View', {
			store : _store,
			baseCls : 'x-plain',
			tpl : [ '<tpl for=".">',
					'<div class="thumb-wrap-label-view" id="{id:stripTags}">',
					'<div class="thumb"><img style="width:80;height:50" src="api/dsqFileUploadFacade/readImg/HTTP_RESP?id={id}" title="{filename:htmlEncode}"></div>',
					'<span class="x-editable">{filename}</span>', '</div>',
					'</tpl>', '<div class="x-clear"></div>'],
			height : 310,
			width : 100,
			trackOver : true,
			autoScroll : true,
			overItemCls : 'x-item-over',
			itemSelector : 'div.thumb-wrap-label-view',
			emptyText : '没有图片...',
			listeners : {
				itemdblclick : function(dv, record) {
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
									+ record.data.id+ '"  onmouseover="qsoft.PopBigImage.create(this,1,0,1,1,true);" galleryimg="no"/>'
						}]
					});
					var ons = function() {
						new qsoft.PopBigImage("imageView", 10, 0, 1, 1).render();
					}
					imgPanel.show();
					ons();
				}
			}
		});
		this.items = [viewer];
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