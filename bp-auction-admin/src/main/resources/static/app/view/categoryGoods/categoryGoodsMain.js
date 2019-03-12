Ext.define('WF.view.categoryGoods.categoryGoodsMain', {
    extend: 'Ext.panel.Panel',
    title: '类目商品管理',
    xtype: 'categoryGoodsMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        //类目名称关联
        var categoryStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/categoryConfig/getAll',
            fields: ['id', 'name']
        });
        //商品ID和商品名称关联
        var goodsStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/goods/getAll',
            fields: ['id', 'name']
        });
        var store = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/categoryGoods/list',
            fields: ['id', 'categoryId', 'goodsId', 'sort']
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
                name: 'categoryId',
                xtype: 'combo',
                editable: false,
                store: categoryStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '类目'
            }, {
                name: 'goodsId',
                xtype: 'combo',
                editable: false,
                store: goodsStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '商品'
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
            },  {
                text: '类目',
                dataIndex: 'categoryId',
                width: 30,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = "未知类目";
                    categoryStore.each(function (record) {
                        if (record.data.id == v) {
                            text=record.data.name;
                            return false;
                        }
                    });
                    return text;
                }
            },{
                text: '商品',
                dataIndex: 'goodsId',
                width: 30,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = "未知商品";
                    goodsStore.each(function (record) {
                        if (record.data.id == v) {
                            text=record.data.name;
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
                            src: imgServer + record.data.img,
                            listeners: {
                                scope: this,
                                el: {
                                    click: function (e, a) {
                                        if (record.data.img != null && record.data.img != '') {
                                            window.open(imgServer + record.data.img);
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