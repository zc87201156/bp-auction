Ext.define('WF.view.activityUserLog.activityUserLogMain', {
    extend: 'Ext.panel.Panel',
    title: '活动用户记录',
    xtype: 'activityUserLogMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;

        var activityStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/activity/getAll',
            fields: ['id','name']
        });
        var awardStatusStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {"id": 0, "name": "未发放"},
                {"id": 1, "name": "已发放"}
            ]
        });
        var store = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/activityUserLog/list',
            fields: ['id','activityId','issue', 'userId','num', 'awardNum', 'rankNum','awardStatus']
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
                name: 'activityId',
                xtype: 'combo',
                editable: false,
                store: activityStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '活动名称'
            },{
                name: 'userId',
                fieldLabel: '用户ID'
            },{
                name: 'issue',
                fieldLabel: '期次号'
            }
            ]
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
                text: '期次号',
                dataIndex: 'issue',
                width: 40,
                menuDisabled: true,
                sortable: false
            },{
                text: '用户ID',
                dataIndex: 'userId',
                width: 40,
                menuDisabled: true,
                sortable: false
            },{
                text: '榜单名次',
                dataIndex: 'rankNum',
                width: 40,
                menuDisabled: true,
                sortable: false
            },{
                text: '收集的数量',
                dataIndex: 'num',
                width: 40,
                menuDisabled: true,
                sortable: false
            },{
                text: '奖励数量',
                dataIndex: 'awardNum',
                width: 40,
                menuDisabled: true,
                sortable: false
            },{
                text: '奖励发放状态',
                dataIndex: 'awardStatus',
                width: 30,
                menuDisabled: true,
                sortable: false,
                renderer: function (v) {
                    var text = "未知状态";
                    awardStatusStore.each(function (record) {
                        if (record.data.id == v) {
                            text = v == 1 ? "<span style=\"color:blue\">" : "<span style=\"color:gray\">";
                            text += record.data.name + "</span>";
                            return false;
                        }
                    });
                    return text;
                }
            },
            ]
        });
    }
});