Ext.define('WF.view.goods.goodsMain', {
    extend: 'Ext.panel.Panel',
    title: '商品管理',
    xtype: 'goodsMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var pictureFile = null;
        var imgServer = 'http://file.beeplay123.com';
        var enableStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {"id": 0, "name": "已下架"},
                {"id": 1, "name": "已上架"}
            ]
        });
        var auctionFeeStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store1',
            url: 'auction/admin/fee/getAll',
            fields: ['id', 'fee', 'price']
        });
        var coordinatior = Ext.create('DCIS.ux.StoreLoadCoordinator', {
            stores: ['store1'],
            listeners: {
                load: function() {
                    var store = Ext.create('DCIS.Store', {
                        autoLoad: true,
                        url: 'auction/admin/goods/list',
                        fields: ['id', 'no', 'name', 'defaultImage', 'marketPrice', 'startPrice',
                            'auctionFeeId', 'platProductId', 'enable', 'operator', 'createTime']
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
                            name: 'name',
                            fieldLabel: '商品名称'
                        },{
                            name: 'no',
                            fieldLabel: '商品编号'
                        },{
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
                        },{
                            text: '商品名称',
                            dataIndex: 'name',
                            width: 70,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '商品编号',
                            dataIndex: 'no',
                            width: 30,
                            menuDisabled: true,
                            sortable: false
                        }, {
                            text: '默认图片',
                            width: 50,
                            dataIndex: 'defaultImage',
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(value, cellMeta, record, rowIndex, columnIndex, store) {
                                cellMeta.tdAttr = 'data-qtip="点击查看大图"';
                                return '<img src="' + imgServer + record.data.defaultImage + '" width="100" height="80"/>';
                            }
                        },{
                            text: '市场价',
                            width: 35,
                            dataIndex: 'marketPrice',
                            menuDisabled: true,
                            sortable: false
                        }, {
                            text: '起拍价',
                            dataIndex: 'startPrice',
                            width: 35,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '手续费id',
                            dataIndex: 'auctionFeeId',
                            width: 50,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = "未知";
                                auctionFeeStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text = "收取 <span style='color:#c81c3f'>" + record.data.fee + "</span> ";
                                        text += "加价 <span style='color:#0006c8'>" + record.data.price + "</span> 元";
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '平台商品id',
                            width: 40,
                            dataIndex: 'platProductId',
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '状态',
                            dataIndex: 'enable',
                            width : 30,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = "未知状态";
                                enableStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text = v == 1 ? "<span style=\"color:blue\">" : "<span style=\"color:gray\">";
                                        text += record.data.name + "</span>";
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '操作人',
                            width: 40,
                            dataIndex: 'operator',
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '创建时间',
                            width: 50,
                            dataIndex: 'createTime',
                            menuDisabled: true,
                            sortable: false
                        }
                        ],
                        listeners: {
                            itemclick: function(view, record, item, index, e) {
                                var colIndex = e.getTarget(view.cellSelector).cellIndex;
                                if (colIndex != 3) {//非图片列不处理
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
                                        src: imgServer + record.data.defaultImage,
                                        listeners: {
                                            scope: this,
                                            el: {
                                                click: function(e, a) {
                                                    if (record.data.defaultImage != null && record.data.defaultImage != '') {
                                                        window.open(imgServer + record.data.defaultImage);
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
            }
        });
    }
});