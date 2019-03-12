Ext.define('JDD.basedata.marketing.activity.basedataActivityRecommendMatchMain', {
    extend: 'Ext.panel.Panel',
    title: '活动赛事推荐管理',
    xtype: 'basedataActivityRecommendMatchMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var lotteryStore = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataLotteryController/listAllBasedataLottery.do',
            autoLoad: true,
            fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'status']
        });
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataActivityRecommendMatchController/listBasedataActivityRecommendMatch.do',
            autoLoad: true,
            fields: ['id', 'lotteryId', 'lotteryName', 'issueMatchName','matchId', 'hostTeam', 'visitTeam', 'hostTeamImgUrl', 'visitTeamImgUrl', 'recommendType', 'rq', 'startTime', 'endTime', 'cardTitle', 'title', 'content', 'useStatus', 'delStatus']
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
            },{
                name: 'hostTeam',
                fieldLabel: '主队'
            }, {
                name: 'visitTeam',
                fieldLabel: '客队'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '推荐玩法:',
                width: 350,
                items: [
                    {boxLabel: '推荐2串1', name: 'recommendType', inputValue: '0'},
                    {boxLabel: '推荐单关', name: 'recommendType', inputValue: '1'},
                    {boxLabel: '推荐赛事', name: 'recommendType', inputValue: '2'}
                ]
            }, {
                xtype: 'radiogroup',
                fieldLabel: '让球:',
                width: 250,
                items: [
                    {boxLabel: '让球', name: 'rq', inputValue: '1'},
                    {boxLabel: '不让球', name: 'rq', inputValue: '0'}
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
                    Ext.create('JDD.basedata.marketing.activity.addBasedataActivityRecommendMatch', {store: store}).show();
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
                            var win = Ext.create("JDD.basedata.marketing.activity.editBasedataActivityRecommendMatch", {
                                store: store,
                                id: record.data.id
                            });
                            win.down('dataform').setValues(record.data);
                            win.show();
                        }

                    }]
                }, {
                    text: '彩种名称',
                    locked: true,
                    dataIndex: 'lotteryName'
                }, {
                    text: '主队',
                    locked: true,
                    dataIndex: 'hostTeam',
                    width: 150
                }, {
                    text: '客队',
                    locked: true,
                    dataIndex: 'visitTeam',
                    width: 150
                }, {
                    text: '标题',
                    dataIndex: 'title',
                    width: 150
                }, {
                    text: '开始时间',
                    dataIndex: 'startTime',
                    width: 150
                }, {
                    text: '结束时间',
                    dataIndex: 'endTime',
                    width: 150
                }, {
                    text: '推荐玩法',
                    dataIndex: 'recommendType',
                    renderer: function (value) {
                        if (value == 0) {
                            return '推荐2串1';
                        } else if (value == 1) {
                            return '推荐单关';
                        } else if (value == 2) {
                            return '推荐赛事';
                        }
                    }
                }, {
                    text: '让球',
                    dataIndex: 'rq',
                    renderer: function (value) {
                        if (value == 0) {
                            return '不让球';
                        } else if (value == 1) {
                            return '让球';
                        }
                    }
                }
            ]
        });
    }
});