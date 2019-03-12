Ext.define('DCIS.FileUpload', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.fileupload',
    initComponent: function () {
        this.callParent(arguments);
        this.createWindow();
    },
    onRender: function () {
        var me = this;
        this.callParent();
        this.createButton();
        var link = Ext.get(this.getInputId() + "fileList");
        link.on("mouseover", function () {
            me.buildTips();
        });
        me.buildTips();
    },
    fieldSubTpl: [
        '<div id={id} style="margin-right:10px;text-align:right"><a id="{id}fileList" href=#" style="margin-right:10px">文件列表</a></div>',
        {
            compiled: true,
            disableFormats: true
        }
    ],
    buildTips: function () {
        if (this.tips == null) {
            this.tips = Ext.create('Ext.tip.ToolTip', {
                target: this.getInputId() + "fileList",
                maxWidth: 600,
                maxHeight: 600,
                tpl: [
                    '<tpl for=".">',
                    '文件名:{name}&nbsp&nbsp',
                    '大小:{size}&nbsp&nbsp',
                    '状态:{[DCIS.FileUpload.prototype.formatFileState(values.state)]}<br>',
                    '</tpl>'
                ]
            });
        }
        var value = Ext.decode(this.getValue());
        if (value != null) {
            var maxNameWidth = 0;
            var maxSizeWidth = 0;
            for (var i = 0; i < value.length; i++) {
                var metricsId = this.getInputId() + "fileList";
                var metrics =new Ext.util.TextMetrics(metricsId);
                var width = metrics.getWidth(value[i].name);
                if (maxNameWidth < width) {
                    maxNameWidth = width;
                }
                value[i].size = Ext.util.Format.fileSize(value[i].size);
                var width = metrics.getWidth(value[i].size);
                if (maxSizeWidth < width) {
                    maxSizeWidth = width;
                }
            }

            this.tips.update(value);
        }

    },
    createButton: function () {
        this.button = Ext.create("Ext.button.Button", {
            text: "上传文件",
            renderTo: this.getInputId(),
            handler: this.showWindow,
            scope: this
        });
    },
    showWindow: function () {
        if (!this.window) {
            this.createWindow();
        }
        this.window.show();
    },
    createWindow: function () {
        var me = this;
        me.window = Ext.create("Ext.window.Window", {
            width: 600,
            height: 300,
            title: "文件上传",
            layout: 'fit',
            closeAction: "hide",
            items: [{
                xtype: "datagrid",
                border: false,
                showPaging: false,
                store: new Ext.data.Store({
                    fields: ['id', 'name', 'type', 'size', 'state', 'percent', "fileId"]
                }),
                columns: [
	    	        Ext.create("Ext.grid.RowNumberer", { text: "行号", width: 35 }),
	                { header: '文件名', width: 100, sortable: true, dataIndex: 'name', menuDisabled: true },
	                { header: '类型', width: 70, sortable: true, dataIndex: 'type', menuDisabled: true },
	                { header: '大小', width: 100, sortable: true, dataIndex: 'size', menuDisabled: true, renderer: me.formatFileSize },
	                { header: '进度', width: 150, sortable: true, dataIndex: 'percent', menuDisabled: true, renderer: me.formatProgressBar, scope: me },
	                { header: '状态', width: 70, sortable: true, dataIndex: 'state', menuDisabled: true, renderer: me.formatFileState, scope: me },
                    { header: "删除", width: 32, xtype: "actioncolumn", menuDisabled: true, items: [{ icon: "Resources/themes/icons/cancel.png", iconCls: "actionColumn_Delete", handler: me.deleteFile, scope: me}] }
                //{ header: '&nbsp;', width: 40, dataIndex: 'id', menuDisabled: true, renderer: this.formatDelBtn }
	            ]
            }],
            buttons: [
                { text: "选择文件", iconCls: "icon-add", ref: '../addBtn' },
                { text: "开始上传", iconCls: "icon-upload", handler: me.uploadFile, scope: me }
            ],
            listeners: {
                'afterrender': function () {

                    var em = me.window.query('button[text="选择文件"]')[0].getEl().child('em');
                    var placeHolderId = Ext.id();
                    em.setStyle({
                        position: 'relative',
                        display: 'block'
                    });
                    em.createChild({
                        tag: 'div',
                        id: placeHolderId
                    });


                    me.swfupload = new SWFUpload({
                        upload_url: me.uploadUrl || "api/fileupload/upload",
                        flash_url: me.flashUrl || "Resources/swfupload.swf",
                        button_width: em.getWidth(),
                        button_height: em.getHeight(),
                        button_placeholder_id: placeHolderId,
                        file_size_limit: me.fileSize || (1024 * 50000), //上传文件体积上限，单位MB
                        file_post_name: me.filePostName,
                        file_types: me.fileTypes || "*.*",  //允许上传的文件类型 
                        file_types_description: me.fileTypesDescription || "所有文件",  //文件类型描述
                        file_upload_limit: "0",  //限定用户一次性最多上传多少个文件，在上传过程中，该数字会累加，如果设置为“0”，则表示没有限制 
                        //file_queue_limit : "10",//上传队列数量限制，该项通常不需设置，会根据file_upload_limit自动赋值              
                        post_params: me.postParams || { savePath: 'upload\\' },
                        use_query_string: true,
                        debug: false,
                        button_cursor: SWFUpload.CURSOR.HAND,
                        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                        custom_settings: {//自定义参数
                            scope_handler: me
                        },
                        file_queued_handler: function (file) { me.onFileQueued(file); },
                        file_dialog_start_handler: function () { }, // 当文件选取对话框弹出前出发的事件处理函数
                        file_dialog_complete_handler: function () { }, //this.onDiaogComplete, //当文件选取对话框关闭后触发的事件处理
                        upload_start_handler: function () { }, //this.onUploadStart, // 开始上传文件前触发的事件处理函数
                        upload_success_handler: function (file, serverData) { me.onUploadSuccess(file, serverData); }, //this.onUploadSuccess, // 文件上传成功后触发的事件处理函数 
                        swfupload_loaded_handler: function () { }, // 当Flash控件成功加载后触发的事件处理函数  
                        upload_progress_handler: function (file, bytesComplete, totalBytes) { me.uploadProgress(file, bytesComplete, totalBytes); }, //this.uploadProgress,
                        upload_complete_handler: function (file) { me.onUploadComplete(file); }, //this.onUploadComplete,
                        upload_error_handler: function (file, errorCode, message) { me.onUploadError(file, errorCode, message); }, // this.onUploadError,
                        file_queue_error_handler: function (file, n) { me.onFileError(file, n); } //this.onFileError
                    });
                    this.swfupload.uploadStopped = false;
                    Ext.get(this.swfupload.movieName).setStyle({
                        position: 'absolute',
                        top: 0,
                        left: -2
                    });
                },
                scope: this,
                delay: 100
            }
        });
    },
    uploadFile: function () {
        var btn = this.window.query('button[iconCls="icon-upload"]')[0];
        if (this.currentStatus == null || this.currentStatus == "startupload") {
            if (this.swfupload) {
                if (this.swfupload.getStats().files_queued > 0) {
                    this.swfupload.uploadStopped = false;
                    this.swfupload.startUpload();
                    this.currentStatus = "stopupload";
                    btn.setText("停止上传");
                }
            }
        }
        else {
            if (this.swfupload) {
                this.swfupload.uploadStopped = true;
                this.swfupload.stopUpload();
                this.currentStatus = "startupload";
                btn.setText("开始上传");
            }
        }
    },
    getGrid: function () {
        if (this.window != null) {
            return this.window.query("datagrid")[0];
        }
        else {
            return null;
        }
    },
    onUploadComplete: function (file) {
        var me = this;
        if (file.filestatus == -4) {
            var ds = me.getGrid().getStore();
            for (var i = 0; i < ds.getCount(); i++) {
                var record = ds.getAt(i);
                if (record.get('id') == file.id) {
                    record.set('percent', 100);
                    if (record.get('state') != -3) {
                        record.set('state', file.filestatus);
                    }
                    record.commit();
                }
            }
        }

        if (me.swfupload.getStats().files_queued > 0 && me.swfupload.uploadStopped == false) {
            me.swfupload.startUpload();
        }
    },
    onUploadError: function (file, errorCode, message) {
        var ds = this.getGrid().getStore();
        for (var i = 0; i < ds.getCount(); i++) {
            var rec = ds.getAt(i);
            if (rec.get('id') == file.id) {
                rec.set('percent', 0);
                rec.set('state', file.filestatus);
                rec.commit();
            }
        }
    },
    onFileError: function (file, n) {
        function tip(msg) {
            Ext.Msg.show({
                title: '提示',
                msg: msg,
                width: 280,
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OK
            });
        }

        switch (n) {
            case -100: tip('待上传文件列表数量超限，不能选择！');
                break;
            case -110: tip('文件太大，不能选择！');
                break;
            case -120: tip('该文件大小为0，不能选择！');
                break;
            case -130: tip('该文件类型不可以上传！');
                break;
        }
    },
    onUploadSuccess: function (file, serverData) {
        var me = this;
        var store = this.getGrid().getStore();
        var data = Ext.decode(serverData);
        if (data.success) {
            for (var i = 0; i < store.getCount(); i++) {
                var rec = store.getAt(i);
                if (rec.get('id') == file.id) {
                    rec.set('state', file.filestatus);
                    rec.set("fileId", data.fileId);
                    rec.commit();
                }
            }
        } else {
            for (var i = 0; i < ds.getCount(); i++) {
                var rec = store.getAt(i);
                if (rec.get('id') == file.id) {
                    rec.set('percent', 0);
                    rec.set('state', -3);
                    rec.commit();
                }
            }
        }
        var btn = this.window.query('button[iconCls="icon-upload"]')[0];
        btn.setText("开始上传");
        this.currentStatus = "startupload";

    },
    uploadProgress: function (file, bytesComplete, totalBytes) {//处理进度条
        var me = this;
        var store = me.getGrid().getStore();
        var percent = Math.ceil((bytesComplete / totalBytes) * 100);
        percent = percent == 100 ? 99 : percent;
        for (var i = 0; i < store.getCount(); i++) {
            var record = store.getAt(i);
            if (record.get('id') == file.id) {
                record.set('percent', percent);
                record.set('state', file.filestatus);
                record.commit();
            }
        }
    },
    onFileQueued: function (file) {
        this.getGrid().getStore().add({
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            state: file.filestatus,
            percent: 0
        })
    },
    formatFileSize: function (_v, celmeta, record) {
        return Ext.util.Format.fileSize(_v);
    },
    formatProgressBar: function (v) {
        var progressBarTmp = this.getTplStr(v);
        return progressBarTmp;
    },
    getTplStr: function (v) {
        var bgColor = "orange";
        var borderColor = "#008000";

        return Ext.String.format(
			'<div>' +
				'<div style="border:1px solid {0};height:10px;width:{1}px;margin:4px 0px 1px 0px;float:left;">' +
					'<div style="float:left;background:{2};width:{3}%;height:10px;"><div></div></div>' +
				'</div>' +
			'<div style="text-align:center;float:right;width:40px;margin:3px 0px 1px 0px;height:10px;font-size:12px;">{3}%</div>' +
		'</div>', borderColor, (90), bgColor, v);
    },
    formatFileState: function (n) {//文件状态
        switch (n) {
            case -1: return '未上传';
                break;
            case -2: return '正在上传';
                break;
            case -3: return '<div style="color:red;">上传失败</div>';
                break;
            case -4: return '上传成功';
                break;
            case -5: return '取消上传';
                break;
            default: return n;
        }
    },
    deleteFile: function (grid, rowIndex, colIndex) {
        var me = this;
        var store = me.getGrid().getStore();
        var record = store.getAt(rowIndex);
        me.swfupload.cancelUpload(record.data.id, false);
        store.remove(record);
    },
    getValue: function () {
        var value = this.getSubmitData();
        if (value != null) {
            return value[this.getName()];
        }
        return null;
    },
    getSubmitData: function () {
        var data = new Array();
        this.getGrid().getStore().each(function (record) {
            if (record.data.fileId == null) {
                return;
            }
            var obj = {
                name: record.data.name,
                type: record.data.type,
                size: record.data.size,
                state: record.data.state,
                fileId: record.data.fileId
            };
            data.push(obj);
        });
        if (data.length == 0) {
            return null;
        }
        else {
            var value = Ext.encode(data);
            var obj = {};
            obj[this.getName()] = value;
            return obj;
        }

    },
    setValue: function (value) {
        var data = Ext.decode(value);
        if (data == null) {
            return;
        }
        var store = this.getGrid().getStore();
        for (var i in data) {
            var item = data[i];
            var record = store.find("fileId", item.fileId);
            if (record == null) {
                'id', 'name', 'type', 'size', 'state', 'percent', "fileId"
                store.add({
                    id: Ext.id(),
                    name: item.name,
                    type: item.type,
                    size: item.size,
                    state: -4,
                    percent: 100,
                    fileId: item.fileId
                });
            }
            else {
                Ext.apply(record.data, item);
                record.data.state = -4;
                record.data.percent = 100;
                record.commit();
            }
        }
    }
});