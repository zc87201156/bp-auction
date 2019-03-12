Ext.define('JDD.basedata.marketing.hot.basedataHotmatchJczqMain', {
    extend: 'Ext.panel.Panel',
    title: '彩种页',
    xtype: 'basedataHotmatchJczqMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataHotmatchJczqController/listBasedataHotmatchJczq.do',
            autoLoad: true,
            fields: ['id', 'issueMatchName', 'hotStatus', 'createTime', 'updateTime', 'issueName', 'weekday', 'weekdayName', 'matchNo', 'hostTeam', 'visitTeam'
                , 'matchId', 'tournamentId', 'tournamentName']
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
                name: 'tournamentName',
                fieldLabel: '比赛名称'
            }, {
                name: 'matchNo',
                fieldLabel: '比赛编号'
            }, {
                name: 'hostTeam',
                fieldLabel: '主队'
            }, {
                name: 'visitTeam',
                fieldLabel: '客队'
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
                    Ext.create('JDD.basedata.marketing.hot.addBasedataHotmatchJczq', {store: store}).show();
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
                    width: 200,
                    callback: function (link, record) {
                        if (record.data.hotStatus == 1) {
                            link[0].disabled = true;
                            link[1].disabled = false;
                            ;
                        } else {
                            link[0].disabled = false;
                            link[1].disabled = true;
                        }
                        return link;
                    },
                    links: [{
                        icon: 'ok',
                        linkText: '设置热门',
                        handler: function (grid, rowIndex, colIndex, record) {
                            updateStatus(record.data.issueMatchName, " 设置 " + record.data.hostTeam + "VS" + record.data.visitTeam + " 为热门", 1);
                        }
                    }, {
                        icon: 'cancel',
                        linkText: '取消热门',
                        handler: function (grid, rowIndex, colIndex, record) {
                            updateStatus(record.data.issueMatchName, " 取消热门 " + record.data.hostTeam + "VS" + record.data.visitTeam + "", 0);
                        }
                    }, {
                        icon: 'cancel',
                        linkText: '删除',
                        handler: function (grid, rowIndex, colIndex, record) {
                            deleteData(record.data.issueMatchName, "<span style='color:red;font-weight:bold;'> 删除 " + record.data.issueMatchName + "</span> 热门赛事");
                        }
                    }]
                }, {
                    text:'竞彩足球期次号',
                    dataIndex: 'issueMatchName'
                },{
                    text: '星期',
                    dataIndex: 'weekdayName'
                }, {
                    text: '比赛名称',
                    dataIndex: 'tournamentName'
                }, {
                    text: '比赛编号',
                    dataIndex: 'matchNo'
                }, {
                    text: '主队',
                    dataIndex: 'hostTeam'
                }, {
                    text: '客队',
                    dataIndex: 'visitTeam'
                }, {
                    text: '是否热门',
                    dataIndex: 'hotStatus',
                    renderer: function (value) {
                        if (value == 0) {
                            return '否';
                        } else if (value == 1) {
                            return '是';
                        }
                    }
                }
            ]
        });

        function updateStatus(issueMatchName, msg, status) {
            Ext.Msg.confirm("确认", "确定<span style='color:red;font-weight:bold;'>" + msg + " </span>吗?", function (button) {
                if (button == "yes") {
                    callapi('/basedata/private/basedataHotmatchJczqController/updateBasedataHotmatchJczqStatus.do', {
                      issueMatchName: issueMatchName,
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
        function deleteData(issueMatchName, msg) {
            Ext.Msg.confirm("确认", "确定<span style='color:red;font-weight:bold;'>" + msg + " </span>吗?", function (button) {
                if (button == "yes") {
                    callapi('/basedata/private/basedataHotmatchJczqController/deleteBasedataHotmatchJczq.do', {
                        issueMatchName: issueMatchName
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