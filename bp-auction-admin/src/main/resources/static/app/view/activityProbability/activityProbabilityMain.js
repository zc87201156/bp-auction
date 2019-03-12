Ext.define('WF.view.activityProbability.activityProbabilityMain', {
    extend: 'Ext.panel.Panel',
    title: '活动概率管理',
    xtype: 'activityProbabilityMain',
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
            url: 'auction/admin/activityProbability/list',
            fields: ['id', 'activityId', 'num', 'probability']
        });
        var activityStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/activity/getAll',
            fields: ['id','name']
        });
        me.add({
            border: false,
            store: store,
            xtype: 'searchpanel',
            title: '查询',
            collapsible: true,
            collapsed: false,
            columns: 1,
            buildField: "Manual",
            forceFit: true,
            items: [{
                name: 'activityId',
                xtype: 'combo',
                editable: false,
                store: activityStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '活动名称'
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
                text: '活动名称',
                dataIndex: 'activityId',
                width: 40,
                menuDisabled: true,
                sortable: false,
                renderer: function(v) {
                    var text = "未知活动";
                    activityStore.each(function(record) {
                        if (record.data.id == v) {
                            text = record.data.name;
                            return false;
                        }
                    });
                    return text;
                }
            },{
                text: '数量',
                dataIndex: 'num',
                width: 40,
                menuDisabled: true,
                sortable: false
            },{
                text: '概率',
                dataIndex: 'probability',
                width: 40,
                menuDisabled: true,
                sortable: false
            }
            ]
        });
    }
});