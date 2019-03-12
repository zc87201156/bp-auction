Ext.define('WF.view.banner.bannerMain', {
    extend: 'Ext.panel.Panel',
    title: '广告图管理',
    xtype: 'bannerMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var pictureFile = null;
        var enableStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {"id": 0, "name": "禁用"},
                {"id": 1, "name": "启用"}
            ]
        });
        var store = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/banner/list',
            fields: ['id', 'image', 'link', 'sort', 'enable']
        });
        me.add({
            border: false,
            store: store,
            xtype: 'searchpanel',
            title: '查询',
            collapsible: true,
            collapsed: false,
            columns: 3,
            buildField: "Manual",
            forceFit: true,
            items: [{
                name: 'enable',
                xtype: 'combo',
                editable: false,
                store: enableStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '状态'
            }]
        });
        me.add({
            xtype: 'datagrid',
            store: store,
            buildField: "Manual",
            forceFit: true,
            columns: [{
                text: 'id',
                dataIndex: 'id',
                width: 30,
                menuDisabled: true,
                sortable: false
            }, {
                text: '图片',
                width: 40,
                dataIndex: 'image',
                menuDisabled: true,
                sortable: false,
                renderer: function (value, cellMeta, record, rowIndex, columnIndex, store) {
                    cellMeta.tdAttr = 'data-qtip="点击查看大图"';
                    return '<img src="' + imgServer + record.data.image + '" width="100" height="80"/>';
                }
            }, {
                text: '图片链接',
                dataIndex: 'link',
                width: 30,
                menuDisabled: true,
                sortable: false
            }, {
                text: '状态',
                dataIndex: 'enable',
                width: 30,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = "未知状态";
                    enableStore.each(function (record) {
                        if (record.data.id == v) {
                            text = v == 1 ? "<span style=\"color:blue\">" : "<span style=\"color:gray\">";
                            text += record.data.name + "</span>";
                            return false;
                        }
                    });
                    return text;
                }
            }, {
                text: '序号',
                width: 20,
                dataIndex: 'sort',
                menuDisabled: true,
                sortable: false
            }
            ],
            listeners: {
                itemclick: function (view, record, item, index, e) {
                    var colIndex = e.getTarget(view.cellSelector).cellIndex;
                    if (colIndex != 1) {//非图片列不处理
                        return;
                    }
                    if (pictureFile) {//关闭上一个图片预览，如果存在
                        pictureFile.close();
                    }
                    pictureFile = Ext.create('Ext.window.Window', {
                        layout: 'fit',
                        resizable: false,
                        plain: true,
                        closable: true,
                        items: [{
                            xtype: 'image',
                            maxWidth: 800,
                            maxHeight: 500,
                            minWidth: 250,
                            minHeight: 100,
                            src: imgServer + record.data.image,
                            listeners: {
                                scope: this,
                                el: {
                                    click: function (e, a) {
                                        if (record.data.image != null && record.data.image != '') {
                                            window.open(imgServer + record.data.image);
                                        }
                                    }
                                }
                            }
                        }]
                    });
                    pictureFile.show();
                }
            }
        });
    }
});