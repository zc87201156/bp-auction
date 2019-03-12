Ext.define('WF.view.violationUser.violationUserMain', {
    extend: 'Ext.panel.Panel',
    title: '违约名单管理',
    xtype: 'violationUserMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var store = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/violationUser/list',
            fields: [ 'userId', 'violationTime', 'violationAuctionId', 'bailAmount', 'goodsName', 'operator']
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
                name: 'userId',
                fieldLabel: '用户ID'
            }]
        });
        me.add({
            xtype: 'datagrid',
            store: store,
            buildField: "Manual",
            forceFit: true,
            columns: [{
                text: '用户ID',
                dataIndex: 'userId',
                width: 40,
                menuDisabled: true,
                sortable: false
            }, {
                text: '违约时间',
                dataIndex: 'violationTime',
                width: 40,
                menuDisabled: true,
                sortable: false
            }, {
                text: '保释金',
                dataIndex: 'bailAmount',
                width: 40,
                menuDisabled: true,
                sortable: false
            }, {
                text: '违约场次',
                dataIndex: 'violationAuctionId',
                width: 40,
                menuDisabled: true,
                sortable: false
            },{
                text: '违约商品',
                dataIndex: 'goodsName',
                width: 40,
                menuDisabled: true,
                sortable: false
            }
            ]
        });
    }
});