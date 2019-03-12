Ext.define('JDD.basedata.system.pay.basedataPayTypeMain', {
    extend: 'Ext.panel.Panel',
    title: '支付方式',
    xtype: 'basedataPayTypeMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataPayTypeController/listBasedataPayType.do',
            autoLoad: true,
            fields: ['id', 'name', 'code', 'memo', 'serverUrl', 'noticeAsynUrl', 'noticeSyncUrl', 'status', 'order', 'customerName', 'customerCode', 'md5Key', 'rsaPublicKey', 'rsaPrivateKey', 'desKey']
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
                fieldLabel: '支付名称'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '是否可用:',
                width: 200,
                items: [
                    {boxLabel: '启用', name: 'status', inputValue: '1'},
                    {boxLabel: '禁用', name: 'status', inputValue: '0'}
                ]
            }]
        });
        me.add({
            xtype: 'datagrid',
            store: store,
            name: 'roleListGrid',
            buildField: "Manual",
            forceFit: true,
            tbar: [{
                text: '新增',
                iconCls: "icon-add",
                handler: function () {
                    Ext.create('JDD.basedata.system.pay.addBasedataPayType', {store: store}).show();
                }
            }],
            columns: [
                {
                    //    header: '序号',
                    //    xtype: 'rownumberer',
                    //    width: 40,
                    //    align: 'center',
                    //    sortable: false
                    //}, {
                    menuDisabled: true,
                    sortable: false,
                    xtype: 'linkColumn',
                    header: '操作',
                    locked: true,
                    width: 150,
                    callback: function (link, record) {
                        return link;
                    },
                    links: [{
                        icon: 'edit',
                        linkText: '编辑',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create("JDD.basedata.system.pay.editBasedataPayType", {
                                store: store,
                                id: record.data.id
                            });
                            win.down('dataform').setValues(record.data);
                            win.show();
                        }
                    }, {
                        icon: 'edit',
                        linkText: '商户信息',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create('JDD.basedata.system.pay.editMerchantInfo',
                                {
                                    record: record
                                });
                            win.show();
                        }
                    }]
                }, {
                    text: "ID",
                    dataIndex: "id"
                }, {
                    text: '名称',
                    dataIndex: 'name'
                }, {
                    text: '代码',
                    dataIndex: 'code'
                }, {
                    text: '备忘',
                    dataIndex: 'memo'
                }, {
                    text: '请求地址',
                    dataIndex: 'serverUrl'
                }, {
                    text: '通知地址',
                    dataIndex: 'noticeAsynUrl'
                }, {
                    text: '返回地址',
                    dataIndex: 'noticeSyncUrl'
                }, {
                    text: '状态',
                    dataIndex: 'status',
                    renderer: function (value) {
                        if (value == 0) {
                            return "<span style='color:red;font-weight:bold;'>无效</span>";
                        } else if (value == 1) {
                            return '有效';
                        }
                    }
                }
            ]
        });
    }
})
;