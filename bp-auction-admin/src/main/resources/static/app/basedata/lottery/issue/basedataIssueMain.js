Ext.define('JDD.basedata.lottery.issue.basedataIssueMain', {
    extend: 'Ext.panel.Panel',
    title: '彩种页',
    xtype: 'basedataIssueMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var issueTime = Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY, -8), "Y-m-d");
        var issueTime1 = Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY, -1), "Y-m-d");
        var lotteryStore = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataLotteryController/listAllBasedataLottery.do',
            autoLoad: true,
            fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'status']
        });
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataIssueController/listBasedataIssue.do',
            autoLoad: true,
            baseParams: {issueTime: issueTime, issueTime1: issueTime1},
            fields: ['issueId', 'lotteryId', 'lotteryName', 'issueName', 'winNumber', 'openResult', 'passStatus', 'chaseExecuteStatus', 'packageStatus', 'openStatus', 'status', 'endTime', 'startTime', 'updateTime']
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
                name: 'lotteryId',
                fieldLabel: '彩种',
                xtype: 'combo',
                emptyText: "--请选择--",
                displayField: 'lotteryName',
                valueField: "lotteryId",
                editable: false,
                queryMode: "local",
                store: lotteryStore
            }, {
                name: 'issueName',
                fieldLabel: '期号'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '开奖状态:',
                width: 220,
                items: [
                    {boxLabel: '开奖', name: 'openStatus', inputValue: '1'},
                    {boxLabel: '未开奖', name: 'openStatus', inputValue: '0'}
                ]
            }, {
                xtype: 'radiogroup',
                fieldLabel: '追号状态:',
                width: 220,
                items: [
                    {boxLabel: '追号', name: 'chaseExecuteStatus', inputValue: '1'},
                    {boxLabel: '未追号', name: 'chaseExecuteStatus', inputValue: '0'}
                ]
            }, {
                xtype: 'datefield',
                name: 'issueTime',
                format: 'Y-m-d',
                fieldLabel: '截止时间',
                editable: false,
                value: issueTime
            }, {
                xtype: 'datefield',
                name: 'issueTime1',
                format: 'Y-m-d',
                fieldLabel: '至',
                editable: false,
                value: issueTime1
            }]
        });
        me.add({
            xtype: 'datagrid',
            store: store,
            name: 'roleListGrid',
            buildField: "Manual",
            forceFit: true,
            tbar: [{
                text: '数字彩期次添加',
                iconCls: "icon-add",
                handler: function () {
                    Ext.create('JDD.basedata.lottery.issue.addBasedataIssue', {store: store}).show();
                }
            }, {
                text: '高频彩期次添加',
                iconCls: "icon-add",
                handler: function () {
                    Ext.create('JDD.basedata.lottery.issue.addBasedataIssueFrequency', {store: store}).show();
                }
            }],
            columns: [
                {
                    menuDisabled: true,
                    sortable: false,
                    xtype: 'linkColumn',
                    header: '操作',
                    locked: true,
                    width: 100,
                    callback: function (link, record) {
                        //if (record.data.status==0) {
                        //    link[1].disabled = true;
                        //} else {
                        //    link[1].disabled = false;
                        //}
                        return link;
                    },
                    links: [{
                        icon: 'edit',
                        linkText: '编辑',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create("JDD.basedata.lottery.issue.editBasedataIssue", {
                                store: store
                            });
                            win.down('dataform').setValues(record.data);
                            win.show();
                        }
                        //}, {
                        //    icon: 'cancel',
                        //    linkText: '停售',
                        //    handler: function (grid, rowIndex, colIndex, record) {
                        //        updateStatus(record.data.lotteryId,"停售 "+record.data.lotteryName+" 彩种",0);
                        //    }
                    }]
                    //}, {
                    //    text: '彩种',
                    //    dataIndex: 'lotteryId'
                }, {
                    text: '彩种',
                    locked: true,
                    dataIndex: 'lotteryName'
                }, {
                    text: '期号',
                    locked: true,
                    dataIndex: 'issueName'
                }, {
                    text: '开售时间',
                    dataIndex: 'startTime',
                    width: 140
                }, {
                    text: '截止时间 ',
                    dataIndex: 'endTime',
                    width: 140
                    //renderer: function (value) {
                    //    //if (value != null) {
                    //    var date = Ext.Date.parse(value, 'Y-m-d H:i:s', true);
                    //        //alert(date);
                    //        var week = Ext.Date.getWeekOfYear(date);
                    //
                    //        return date.getDay()+" "+value;
                    //    //}
                    //}
                }, {
                    text: '开奖号码',
                    width: 280,
                    dataIndex: 'winNumber'
                }, {
                    text: '开奖状态',
                    dataIndex: 'openStatus',
                    renderer: function (value) {
                        if (value == 0) {
                            return '未开奖';
                        } else if (value == 1) {
                            return '开奖';
                        }
                    }
                }, {
                    text: '追号状态',
                    dataIndex: 'chaseExecuteStatus',
                    renderer: function (value) {
                        if (value == 0) {
                            return '未追号';
                        } else if (value == 1) {
                            return '追号';
                        }
                    }
                }, {
                    text: '变更时间',
                    dataIndex: 'updateTime',
                    width: 140
                //}, {
                //    text: '状态',
                //    dataIndex: 'status',
                //    renderer: function (value) {
                //        if (value == 0) {
                //            return "<span style='color:red;font-weight:bold;'>禁用</span>";
                //        } else if (value == 1) {
                //            return '启用';
                //        }
                //    }
                }
            ]

        });
        function updateStatus(id, msg, status) {
            Ext.Msg.confirm("确认", "确定" + msg + "吗?", function (button) {
                if (button == "yes") {
                    callapi('basedata/private/basedataIssueController/updateIssueStatus.do', {
                        issueId: id,
                        status: status
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
        };
    }
});