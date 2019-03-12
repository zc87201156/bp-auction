Ext.define('WF.view.fee.feeMain', {
    extend: 'Ext.panel.Panel',
    title: '手续费管理',
    xtype: 'feeMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var enableStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {"id": 0, "name": "禁用"},
                {"id": 1, "name": "启用"}
            ]
        });
        var store = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/fee/list',
            fields: ['id', 'fee', 'price', 'enable', 'createTime']
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
                name: 'fee',
                xtype: 'numberfield',
                minValue: 0,
                allowDecimals: false,
                fieldLabel: '手续费'
            },{
                name: 'price',
                xtype: 'numberfield',
                minValue: 0,
                allowDecimals: true,
                decimalPrecision: 2,
                fieldLabel: '加价幅度(元)'
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
                text: '手续费',
                dataIndex: 'fee',
                width: 70,
                menuDisabled: true,
                sortable: false
            },{
                text: '加价幅度(元)',
                dataIndex: 'price',
                width: 30,
                menuDisabled: true,
                sortable: false
            },{
                text: '状态',
                dataIndex: 'enable',
                width : 30,
                menuDisabled: true,
                sortable: false,
                renderer: function(v) {
                    var text = "未知";
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
                text: '创建时间',
                width: 50,
                dataIndex: 'createTime',
                menuDisabled: true,
                sortable: false
            }
            ]
        });
    }
});