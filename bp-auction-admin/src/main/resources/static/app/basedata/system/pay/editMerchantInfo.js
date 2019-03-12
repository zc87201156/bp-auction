Ext.define('JDD.basedata.system.pay.editMerchantInfo', {
    extend: 'Ext.window.Window',
    alias: 'editMerchantInfo',
    title: '商户信息',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    modal: true,
    width: 650,
    height: 500,
    resizable: false,
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
        var record = me.record.data;
        var merchantStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'basedata/private/basedataPayTypeController/getMerchantInfo.do?payTypeId=' + record.id,
            fields: [
                'id',
                'customerCode',
                "customerName",
                "payTypeId",
                'md5Key',
                'isDelete',
                "rsaPublicKey",
                "rsaPrivateKey",
                "desKey",
                "order"
            ]
        });

        me.add({
            xtype: 'datagrid',
            store: merchantStore,
            forceFit: true,
            buildField: "Manual",
            tbar: [{
                text: '新增',
                iconCls: "icon-add",
                handler: function () {
                    Ext.create('JDD.basedata.system.pay.addMerchantInfo', {
                        merchantStore: merchantStore,
                        record: me.record
                    }).show();
                }
            }],
            columns: [{
                menuDisabled: true,
                sortable: false,
                xtype: 'linkColumn',
                header: '操作',
                width: 100,
                links: [{
                    icon: 'delete',
                    linkText: '删除',
                    handler: function (grid, rowIndex, colIndex, record) {
                        callapi("basedata/private/basedataPayTypeController/deleteMerchantInfo.do?id=" + record.data.id, {},
                            function (result) {
                                if (result == true) {
                                    Ext.Msg.show({
                                        title: "提示",
                                        msg: "删除成功",
                                        modal: true,
                                        icon: Ext.Msg.INFO,
                                        buttons: Ext.Msg.OK
                                    });
                                    grid.store.remove(record);
                                }
                                else {
                                    Ext.Msg.show({
                                        title: '错误',
                                        msg: "修改失败！",
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        modal: true
                                    });
                                }
                            });
                    }
                },{
                    icon: 'edit',
                    linkText: '编辑',
                    handler: function (grid, rowIndex, colIndex, record) {
                        var win = Ext.create('JDD.basedata.system.pay.editTheMerchantInfo',
                            {
                                store:merchantStore
                            });
                        win.down('dataform').setValues(record.data);
                        win.show();
                    }
                }]
            },
            {
                dataIndex: 'customerCode',
                text: '商户号'
            }, {
                dataIndex: 'md5Key',
                text: 'MD5Key'
            }, {
                dataIndex: "customerName",
                text: "商户名称"
            }, {
                dataIndex: "order",
                text: "排序"
            }]
        });
    }
});