Ext.define('WF.view.auction.auctionMain', {
    extend: 'Ext.panel.Panel',
    title: '拍卖管理',
    xtype: 'auctionMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var goodsStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store1',
            url: 'auction/admin/goods/getAll',
            fields: ['id','name']
        });
        var auctionStatusStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store2',
            url: 'auction/admin/common/data/auctionStatusList',
            fields: ['id','name']
        });
        var paymentStatusStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store3',
            url: 'auction/admin/common/data/paymentStatusList',
            fields: ['id','name']
        });
        var enableStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store4',
            url: 'auction/admin/common/data/statusList',
            fields: ['id','name']
        });
        var environmentStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store5',
            url: 'auction/admin/common/data/environmentList',
            fields: ['id','name']
        });
        var deliveryStatusStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store6',
            url: 'auction/admin/common/data/deliveryStatusList',
            fields: ['id','name']
        });
        var auctionTypeStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store7',
            url: 'auction/admin/common/data/auctionTypeList',
            fields: ['id','name']
        });
        var auctionClassStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'store8',
            url: 'auction/admin/common/data/auctionClassList',
            fields: ['id','name']
        });
        var yesOrNoStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {"id": 0, "name": "否"},
                {"id": 1, "name": "是"}
            ]
        });
        var coordinatior = Ext.create('DCIS.ux.StoreLoadCoordinator', {
            stores: ['store1', 'store2', 'store3', 'store4', 'store5', 'store6','store7','store8'],
            listeners: {
                load: function() {
                    var store = Ext.create('DCIS.Store', {
                        autoLoad: true,
                        url: 'auction/admin/auction/list',
                        fields: ['id', 'goodsId', 'startTime', 'endTime', 'currentPrice', 'currentUserId', 'nickname',
                            'paymentEndTime', 'auctionStatus', 'paymentStatus', 'paymentOrderNo', 'paymentTime',
                            'deliveryStatus', 'sort', 'nextId', 'enable', 'type', 'rollAuctionId', 'auctionClass',
                            'canDeposit', 'freeEntryFee', 'freeRaisePrice', 'operator', 'environment', 'createTime']
                    });

                    me.add({
                        border: false,
                        store: store,
                        xtype: 'searchpanel',
                        title: '查询',
                        collapsible: true,
                        collapsed: false,
                        columns: 4,
                        buildField: "Manual",
                        forceFit: true,
                        beforeSearch: function() {
                            var orderNo = me.query('[name=paymentOrderNo]')[0];
                            orderNo.setValue($.trim(orderNo.getValue()));
                            return true;
                        },
                        items: [{
                            name: 'searchById',
                            xtype: 'numberfield',
                            allowDecimals: false,
                            minValue: 1,
                            fieldLabel: '拍卖ID'
                        },{
                            name: 'goodsId',
                            xtype: 'combo',
                            editable: false,
                            store: goodsStore,
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local',
                            fieldLabel: '商品'
                        },{
                            name: 'auctionStatus',
                            xtype: 'combo',
                            editable: false,
                            store: auctionStatusStore,
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local',
                            fieldLabel: '拍卖状态'
                        },{
                            name: 'enable',
                            xtype: 'combo',
                            editable: false,
                            store: enableStore,
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local',
                            fieldLabel: '状态'
                        },{
                            name: 'environment',
                            xtype: 'combo',
                            editable: false,
                            store: environmentStore,
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local',
                            fieldLabel: '所属环境'
                        },{
                            name: 'type',
                            xtype: 'combo',
                            editable: false,
                            store: auctionTypeStore,
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local',
                            fieldLabel: '拍卖类型'
                        },{
                            name: 'auctionClass',
                            xtype: 'combo',
                            editable: false,
                            store: auctionClassStore,
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local',
                            fieldLabel: '场次类型'
                        },{
                            name: 'currentUserId',
                            xtype: 'numberfield',
                            allowDecimals: false,
                            minValue: 1,
                            fieldLabel: '成交人'
                        },{
                            name: 'paymentOrderNo',
                            fieldLabel: '订单号'
                        }]
                    });
                    me.add({
                        xtype: 'datagrid',
                        store: store,
                        buildField: "Manual",
                        //forceFit: true,
                        columns: [{
                            text: 'id',
                            dataIndex: 'id',
                            width: 70,
                            locked: true,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '商品名称',
                            dataIndex: 'goodsId',
                            width: 120,
                            locked: true,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = "未知商品";
                                goodsStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text = record.data.name;
                                        return false;
                                    }
                                });
                                return text;
                            }
                        }, {
                            text: '拍卖开始时间',
                            width: 135,
                            locked: true,
                            dataIndex: 'startTime',
                            menuDisabled: true,
                            sortable: false
                        }, {
                            text: '拍卖(预计)结束时间',
                            width: 135,
                            locked: true,
                            dataIndex: 'endTime',
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '成交价格',
                            width: 70,
                            locked: true,
                            dataIndex: 'currentPrice',
                            menuDisabled: true,
                            sortable: false
                        }, {
                            text: '成交人',
                            dataIndex: 'currentUserId',
                            width: 65,
                            locked: true,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '成交人昵称',
                            dataIndex: 'nickname',
                            width: 100,
                            locked: true,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '付款截止时间',
                            width: 135,
                            dataIndex: 'paymentEndTime',
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '拍卖类型',
                            dataIndex: 'type',
                            width : 70,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = "未知拍卖类型";
                                auctionTypeStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text=record.data.name;
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '场次类型',
                            dataIndex: 'auctionClass',
                            width : 80,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = "未知类型";
                                auctionClassStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text=record.data.name;
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '滚拍ID',
                            dataIndex: 'rollAuctionId',
                            width: 60,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '拍卖状态',
                            dataIndex: 'auctionStatus',
                            width : 80,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = "未知拍卖状态";
                                auctionStatusStore.each(function(record) {
                                    if (record.data.id == v) {
                                        switch (v) {
                                            case 0:
                                                text = "<span style='color:green'>";
                                                break;
                                            case 1:
                                                text = "<span style='color:red'>";
                                                break;
                                            case 2:
                                                text = "<span style='color:blue'>";
                                                break;
                                            case 3:
                                                text = "<span style='color:gray'>";
                                                break;
                                        }
                                        text += record.data.name + "</span>";
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '支付状态',
                            dataIndex: 'paymentStatus',
                            width : 70,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = "未知支付状态";
                                paymentStatusStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text = v == 1 ? "<span style='color:blue'>" : "<span style='color:gray'>";
                                        text += record.data.name + "</span>";
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '免手续费场报名费',
                            width: 110,
                            dataIndex: 'freeEntryFee',
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '免手续费场加价幅度',
                            width: 130,
                            dataIndex: 'freeRaisePrice',
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '订单号',
                            dataIndex: 'paymentOrderNo',
                            width: 150,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '支付时间',
                            width: 135,
                            dataIndex: 'paymentTime',
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '发货状态',
                            dataIndex: 'deliveryStatus',
                            width : 70,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = v;
                                deliveryStatusStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text = record.data.name;
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '下一期',
                            dataIndex: 'nextId',
                            width: 70,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '排序',
                            dataIndex: 'sort',
                            width: 70,
                            menuDisabled: true,
                            sortable: false
                        },{
                            text: '状态',
                            dataIndex: 'enable',
                            width : 70,
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
                            text: '是否支持托管',
                            dataIndex: 'canDeposit',
                            width : 90,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text="";
                                yesOrNoStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text = v == 1 ? "<span style=\"color:blue\">" : "<span style=\"color:gray\">";
                                        text += record.data.name + "</span>";
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '所属环境',
                            dataIndex: 'environment',
                            width : 70,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function(v) {
                                var text = "未知";
                                environmentStore.each(function(record) {
                                    if (record.data.id == v) {
                                        text = v == 1 ? "<span style=\"color:gray\">" : "<span style=\"color:blue\">";
                                        text += record.data.name + "</span>";
                                        return false;
                                    }
                                });
                                return text;
                            }
                        },{
                            text: '操作人',
                            width: 70,
                            dataIndex: 'operator',
                            menuDisabled: true,
                            sortable: false
                        }
                        ]
                    });
                }
            }
        });
    }
});