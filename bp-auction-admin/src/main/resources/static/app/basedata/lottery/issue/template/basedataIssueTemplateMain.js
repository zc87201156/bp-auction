Ext.define('JDD.basedata.lottery.issue.template.basedataIssueTemplateMain', {
    extend: 'Ext.panel.Panel',
    title: '期次模板管理页',
    xtype: 'basedataIssueTemplateMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataIssueTemplateController/listBasedataIssueTemplate.do',
            autoLoad: true,
            fields: ['id', 'lotteryId', 'lotteryName', 'nameTemplate', 'status', 'startTime', 'endTime']
        });
        var lotteryStore = Ext.create('DCIS.Store', {
            url: 'basedata/private/basedataLotteryTagController/listLotteryTagRelationByLotteryCode.do',
            autoLoad: true,
            baseParams: {code: "GPC"},//高频彩
            fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'auditStatus', 'gpcStatus']
        });
        me.add({
            border: false,
            store: store,
            xtype: 'searchpanel',
            title: '查询',
            collapsible: true,
            collapsed: false,
            columns: 4,
            buildField: "Manual",
            forceFit: true,
            items: [{
                name: 'lotteryId',
                fieldLabel: '彩种',
                xtype: 'combo',
                emptyText: "--请选择--",
                displayField: 'lotteryName',
                valueField: "lotteryId",
                editable: false,
                queryMode: "local",
                store: lotteryStore
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
                    Ext.create('JDD.basedata.lottery.issue.template.addBasedataIssueTemplate', {store: store}).show();
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
                    width: 150,
                    callback: function (link, record) {
                        return link;
                    },
                    links: [{
                        icon: 'edit',
                        linkText: '编辑',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create("JDD.basedata.lottery.issue.template.editBasedataIssueTemplate", {
                                store: store,
                                id: record.data.id
                            });
                            win.down('dataform').setValues(record.data);
                            win.show();
                        }
                    }, {
                        icon: 'cancel',
                        linkText: '删除',
                        handler: function (grid, rowIndex, colIndex, record) {
                            Ext.Msg.confirm("确认", "确定删除吗?", function (button) {
                                if (button == "yes") {
                                    callapi('basedata/private/basedataIssueTemplateController/deleteBasedataIssueTemplate.do', {
                                        id: record.data.id
                                    }, function (result) {
                                        if (result.success) {
                                            Ext.Msg.show({
                                                title: "提示",
                                                msg: msg + "成功",
                                                modal: true,
                                                icon: Ext.Msg.INFO,
                                                buttons: Ext.Msg.OK
                                            });
                                            store.reload();
                                        } else {
                                            Ext.Msg.show({
                                                title: '错误',
                                                msg: msg + "失败",
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.Msg.ERROR,
                                                modal: true
                                            });
                                        }
                                    }, null, null, false);
                                }
                            });
                        }
                    }]
                }, {
                    text: '彩种名称',
                    dataIndex: 'lotteryName'
                }, {
                    text: '期次号名称模板',
                    dataIndex: 'nameTemplate'
                }, {
                    text: '开始时间',
                    dataIndex: 'startTime',
                    width: 180,
                }, {
                    text: '结束时间',
                    dataIndex: 'endTime',
                    width: 180,
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
        })
        ;
    }
});