Ext.define('WF.view.rollAuction.rollAuctionMain', {
    extend: 'Ext.panel.Panel',
    title: '滚拍管理',
    xtype: 'rollAuctionMain',
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
        //环境名称
        var environmentStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/common/data/environmentList',
            storeId: 'environmentStore',
            fields: ['id', 'name']
        });
        //启用状态
        var enableStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'enableStore',
            url: 'auction/admin/common/data/statusList',
            fields: ['id', 'name']
        });
        //滚拍状态
        var rollAuctionStatusStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'rollAuctionStatusStore',
            url: 'auction/admin/common/data/rollAuctionStatusList',
            fields: ['id', 'name']
        });
        //滚拍状态
        var rollAuctionTypeStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'rollAuctionTypeStore',
            url: 'auction/admin/common/data/rollAuctionTypeList',
            fields: ['id', 'name']
        });

        var store = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/rollAuction/list',
            fields: ['id', 'type', 'categoryId', 'period', 'startTime', 'endTime', 'enable', 'status', 'sort',
                'operator', 'currentAuctionId', 'currentGoodsId', 'currentTurn', 'turns', 'canDeposit', 'environment', 'freeEntryFee', 'freeRaisePrice']
        });
        var yesOrNoStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {"id": 0, "name": "否"},
                {"id": 1, "name": "是"}
            ]
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
                fieldLabel: '类目'
            }, {
                name: 'enable',
                xtype: 'combo',
                editable: false,
                store: enableStore,
                displayField: 'name',
                valueField: 'id',
                fieldLabel: '启用状态'
            },{
                name: 'type',
                xtype: 'combo',
                editable: false,
                store: rollAuctionTypeStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '滚拍类型'
            }, {
                name: 'environment',
                xtype: 'combo',
                editable: false,
                store: environmentStore,
                displayField: 'name',
                valueField: 'id',
                fieldLabel: '所属环境'
            }]
        });
        me.add({
            xtype: 'datagrid',
            store: store,
            buildField: "Manual",
            forceFit: false,
            columns: [{
                text: 'id',
                dataIndex: 'id',
                width: 70,
                menuDisabled: true,
                sortable: false
            }, {
                text: '滚拍类型',
                dataIndex: 'type',
                width: 100,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = '未知类型';
                    rollAuctionTypeStore.each(function (record) {
                        if (record.data.id == v) {
                            text = record.data.name;
                        }
                    });
                    return text;
                }
            }, {
                text: '类目名称',
                dataIndex: 'categoryId',
                width: 135,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = "未知类目";
                    categoryStore.each(function (record) {
                        if (record.data.id == v) {
                            text = record.data.name;
                            return false;
                        }
                    });
                    return text;
                }
            }, {
                text: '滚拍每期时间间隔(秒)',
                width: 140,
                dataIndex: 'period',
                menuDisabled: true,
                sortable: false
            }, {
                text: '滚拍开始时间',
                width: 90,
                dataIndex: 'startTime',
                menuDisabled: true,
                sortable: false
            }, {
                text: '滚拍结束时间',
                width: 90,
                dataIndex: 'endTime',
                menuDisabled: true,
                sortable: false
            }, {
                text: '排序',
                dataIndex: 'sort',
                width: 45,
                menuDisabled: true,
                sortable: false
            }, {
                text: '启用状态',
                dataIndex: 'enable',
                width: 70,
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
                text: '状态',
                dataIndex: 'status',
                width: 60,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = "未知状态";
                    rollAuctionStatusStore.each(function (record) {
                        if (record.data.id == v) {
                            if (v == 0) {
                                text = "<span style=\"color:green\">";
                            } else {
                                text = "<span style=\"color:red\">";
                            }
                            text += record.data.name + "</span>";
                            return false;
                        }
                    });
                    return text;
                }
            }, {
                text: '操作人',
                width: 80,
                dataIndex: 'operator',
                menuDisabled: true,
                sortable: false
            }, {
                text: '最新拍卖期次',
                width: 90,
                dataIndex: 'currentAuctionId',
                menuDisabled: true,
                sortable: false
            }, {
                text: '最新期次商品ID',
                width: 100,
                dataIndex: 'currentGoodsId',
                menuDisabled: true,
                sortable: false
            }, {
                text: '当前轮数',
                width: 80,
                dataIndex: 'currentTurn',
                menuDisabled: true,
                sortable: false
            }, {
                text: '轮数限制',
                width: 70,
                dataIndex: 'turns',
                menuDisabled: true,
                sortable: false
            }, {
                text: '是否支持托管',
                dataIndex: 'canDeposit',
                width: 90,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = "";
                    yesOrNoStore.each(function (record) {
                        if (record.data.id == v) {
                            text = v == 1 ? "<span style=\"color:blue\">" : "<span style=\"color:gray\">";
                            text += record.data.name + "</span>";
                            return false;
                        }
                    });
                    return text;
                }
            }, {
                text: '所属环境',
                dataIndex: 'environment',
                width: 80,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = "未知";
                    environmentStore.each(function (record) {
                        if (record.data.id == v) {
                            text = v == 1 ? "<span style=\"color:gray\">" : "<span style=\"color:blue\">";
                            text += record.data.name + "</span>";
                            return false;
                        }
                    });
                    return text;
                }
            },
                {
                    text: '免手续费场报名费',
                    width: 110,
                    dataIndex: 'freeEntryFee',
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: '免手续费场加价幅度',
                    width: 130,
                    dataIndex: 'freeRaisePrice',
                    menuDisabled: true,
                    sortable: false
                }
            ]
        });
        /*    var coordinatior = Ext.create('DCIS.ux.StoreLoadCoordinator', {
                stores: ['goodsStore', 'categoryStore', 'enableStore','environmentStore'],
                listeners: {
                    load: function () {
                        var store = Ext.create('DCIS.Store', {
                            autoLoad: true,
                            url: 'auction/admin/rollAuction/list',
                            fields: ['id', 'goodsId', 'period', 'startTime', 'endTime', 'enable', 'sort',
                                'operator','currentAuctionId','currentGoodsId','currentTurn','turns', 'environment']
                        });


                    }
                }
            });*/
    }
});