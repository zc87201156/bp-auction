Ext.define('WF.view.activity.activityMain', {
    extend: 'Ext.panel.Panel',
    title: '活动管理',
    xtype: 'activityMain',
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
            url: 'auction/admin/activity/list',
            fields: ['id', 'name', 'awardNum', 'startTime', 'endTime', 'enable', 'rankNum']
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
                fieldLabel: '活动名称'
            }, {
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
            }, {
                text: '活动名称',
                dataIndex: 'name',
                width: 40,
                menuDisabled: true,
                sortable: false
            }, {
                text: '奖池总数量',
                dataIndex: 'awardNum',
                width: 40,
                menuDisabled: true,
                sortable: false
            }, {
                text: '活动开始时间',
                dataIndex: 'startTime',
                width: 40,
                menuDisabled: true,
                sortable: false
            }, {
                text: '活动结束时间',
                dataIndex: 'endTime',
                width: 40,
                menuDisabled: true,
                sortable: false
            }, {
                text: '状态',
                dataIndex: 'enable',
                width: 30,
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
                text: '榜单用户数',
                width: 20,
                dataIndex: 'rankNum',
                menuDisabled: true,
                sortable: false
            }
            ]
        });
    }
});