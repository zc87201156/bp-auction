function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined,2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
function format(txt,compress/*是否为压缩模式*/){/* 格式化JSON源码(对象转换为JSON文本) */  
        var indentChar = '    ';   
        if(/^\s*$/.test(txt)){   
            alert('数据为空,无法格式化! ');   
            return;   
        }   
        try{var data=eval('('+txt+')');}   
        catch(e){   
            alert('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');   
            return;   
        };   
        var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;   
           
        var notify=function(name,value,isLast,indent/*缩进*/,formObj){   
            nodeCount++;/*节点计数*/  
            for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */  
            tab=compress?'':tab;/*压缩模式忽略缩进*/  
            maxDepth=++indent;/*缩进递增并记录*/  
            if(value&&value.constructor==Array){/*处理数组*/  
                draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/  
                for (var i=0;i<value.length;i++)   
                    notify(i,value[i],i==value.length-1,indent,false);   
                draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/  
            }else   if(value&&typeof value=='object'){/*处理对象*/  
                    draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/  
                    var len=0,i=0;   
                    for(var key in value)len++;   
                    for(var key in value)notify(key,value[key],++i==len,indent,true);   
                    draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/  
                }else{   
                        if(typeof value=='string')value='"'+value+'"';   
                        draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);   
                };   
        };   
        var isLast=true,indent=0;   
        notify('',data,isLast,indent,false);   
        return draw.join('');   
    }  
function uploadExcel(url, callBack) {
	var _myform = new Ext.form.FormPanel({
				buttonAlign : 'center',
				frame : false,
				fileUpload : true,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : [{
							allowBlank : false,
							xtype : 'fileuploadfield',
							emptyText : '请选择要导入的文件',
							fieldLabel : '请选择文件',
							name : 'file',
							buttonText : '浏览...',
							buttonCfg : {
								iconCls : 'icon-upload'
							}
						}],
				buttons : [{
					text : '提交',
					iconCls : 'icon-ok',
					handler : function() {
						var fileType='xls,xlsx';
						var fileName = this.up('form').down('fileuploadfield[name="file"]').getValue();
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
									url : url,
									waitMsg : '正在导入数据...',
									success : function(fp, o) {
										_win.close();
										if (o.result != null)
											callBack(o.result);
										else
											callBack();
									},
									failure : function() {
										Ext.Msg.show({
													title : '错误',
													msg : '对不起,文件导入失败!',
													buttons : Ext.Msg.OK,
													icon : Ext.MessageBox.ERROR
												});
									}
								});
					}
				}, {
					text : '取消',
					iconCls : 'icon-undo',
					handler : function() {
						_win.close();
					}
				}]
			});
	var _win = new Ext.Window({
				title : '选择导入的文件',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				width : 320,
				modal : true,
				resizable : false,
				closable : true,
				items : [_myform]
			});
	_win.show();
}

function removeImage(id) {
	var newsImageDataView = Ext.ComponentQuery.query('[name="newsImageDataView"]')[0];
	var store = newsImageDataView.getStore();
	for(var i=0;i<store.getCount();i++){
		var re=store.getAt(i);
		if(re.data.id==id){
			store.remove(re);
			return;
		}
	}
}

function appendToContent(imageUrl) {
	var content = Ext.ComponentQuery.query('kindeditor[name="content"]')[0];
	content.ke.insertHtml('<img style="width:200px;height: 140px" src="'+imageUrl +'"/>');
}

function uploadPicture(url, callBack) {
	var _myform = new Ext.form.FormPanel({
		buttonAlign : 'center',
		frame : false,
		fileUpload : true,
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [{
			allowBlank : false,
			xtype : 'fileuploadfield',
			emptyText : '请选择要上传的图片',
			fieldLabel : '请选择图片',
			name : 'imgFile',
			buttonText : '浏览...',
			buttonCfg : {
				iconCls : 'icon-upload'
			}
		}],
		buttons : [{
			text : '提交',
			iconCls : 'icon-ok',
			handler : function() {
				var fileType='jpg,png,gif';
				var fileName = this.up('form').down('fileuploadfield[name="imgFile"]').getValue();
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
					url : url,
					waitMsg : '正在导入数据...',
					success : function(fp, o) {
						_win.close();
						if (o.result != null)
							callBack(o.result);
						else
							callBack();
					},
					failure : function() {
						Ext.Msg.show({
							title : '错误',
							msg : '对不起,文件导入失败!',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.ERROR
						});
					}
				});
			}
		}, {
			text : '取消',
			iconCls : 'icon-undo',
			handler : function() {
				_win.close();
			}
		}]
	});
	var _win = new Ext.Window({
		title : '选择上传图片',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		width : 320,
		modal : true,
		resizable : false,
		closable : true,
		items : [_myform]
	});
	_win.show();
}