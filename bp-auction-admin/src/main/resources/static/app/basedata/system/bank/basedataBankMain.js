Ext.define('JDD.basedata.system.bank.basedataBankMain', {
    extend: 'Ext.panel.Panel',
    title: '银行',
    xtype: 'basedataBankMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataBankController/listBasedataBank.do',
            autoLoad: true,
            fields: ['bankId', 'bankName', 'order', 'status','bankCode']
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
                name: 'bankName',
                fieldLabel: '银行名称'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '状态:',
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
                    Ext.create('JDD.basedata.system.bank.addBasedataBank', {store: store}).show();
                }
            }],
            columns: [
                {
                    header: '序号',
                    xtype: 'rownumberer',
                    width: 40,
                    align: 'center',
                    sortable: false
                }, {
                    menuDisabled: true,
                    sortable: false,
                    xtype: 'linkColumn',
                    header: '操作',
                    locked: true,
                    width: 60,
                    callback: function (link, record) {
                        return link;
                    },
                    links: [{
                        icon: 'edit',
                        linkText: '编辑',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create("JDD.basedata.system.bank.editBasedataBank", {
                                store: store,
                                id: record.data.id
                            });
                            win.down('dataform').setValues(record.data);
                            win.show();
                        }

                    }]
                }, {
                    text: 'ID',
                    dataIndex: 'bankId'
                }, {
                    text: '银行名称',
                    dataIndex: 'bankName'
                }, {
                    text: '银行Code',
                    dataIndex: 'bankCode'
                }, {
                    text: '排序',
                    dataIndex: 'order'
                }, {
                    text: '状态',
                    dataIndex: 'status',
                    renderer: function (value) {
                        if (value == 0) {
                            return "<span style='color:red;font-weight:bold;'>禁用</span>";
                        } else if (value == 1) {
                            return '启用';
                        }
                    }
                }
            ]
        });
    }
});