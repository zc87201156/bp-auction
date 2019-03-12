Ext.define('JDD.basedata.system.operationLog.basedataSystemOperationLogMain', {
    extend: 'Ext.panel.Panel',
    title: '操作日志',
    xtype: 'basedataSystemOperationLogMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataSystemOperationLogController/listBasedataSystemOperationLog.do',
            autoLoad: true,
            fields: ['id', 'operator', 'ip', 'method', 'parameter', 'payload', 'createTime', 'requestUri']
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
                name: 'operator',
                fieldLabel: '操作员'
            }, {
                name: 'ip',
                fieldLabel: 'ip'
            }, {
                name: 'requestUri',
                fieldLabel: '请求地址'
            }, {
                name: 'method',
                fieldLabel: '请求方式'
            }, {
                name: 'parameter',
                fieldLabel: 'parameter'
            }, {
                name: 'payload',
                fieldLabel: 'payload'
            }, {
                xtype: 'datetimefield',
                name: 'createTime',
                format: 'Y-m-d H:i:s',
                fieldLabel: '创建时间',
                editable: false
            }, {
                xtype: 'datetimefield',
                name: 'createTime1',
                format: 'Y-m-d H:i:s',
                fieldLabel: '至',
                editable: false
            }]
        });
        me.add({
            xtype: 'datagrid',
            store: store,
            name: 'roleListGrid',
            buildField: "Manual",
            forceFit: true,
            columns: [
                {
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
                        linkText: '查看',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create("JDD.basedata.system.operationLog.editBasedataSystemOperationLog", {
                                id: record.data.id,
                                store: store
                            });
                            win.down('dataform').setValues(record.data);
                            win.down('dataform').down("[name='createTime']").setValue(Ext.Date.format(new Date(record.data.createTime), 'Y-m-d H:i:s'));
                            win.show();
                        }

                    }]
                }, {
                    text: '操作员',
                    width: 80,
                    dataIndex: 'operator'
                }, {
                    text: 'ip',
                    dataIndex: 'ip'
                }, {
                    text: '方式',
                    dataIndex: 'method'
                }, {
                    text: '地址',
                    width: 300,
                    dataIndex: 'requestUri'
                }, {
                    text: 'parameter',
                    width: 300,
                    dataIndex: 'parameter'
                }, {
                    text: 'payload',
                    dataIndex: 'payload',
                    width: 300,
                }, {
                    text: '创建时间',
                    dataIndex: 'createTime',
                    width: 150,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        if (!value) {
                            return "";
                        }
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                    }
                }
            ]
        });
    }
});