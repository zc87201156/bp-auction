Ext.define('JDD.basedata.lottery.play.basedataPlayTypeMain', {
    extend: 'Ext.panel.Panel',
    title: '彩种页',
    xtype: 'basedataPlayTypeMain',
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
            url: '/basedata/private/basedataPlayTypeController/listBasedataPlayType.do',
            autoLoad: true,
            fields: ['playtypeId', 'lotteryId', 'lotteryName', 'endbuyBeforeSecond', 'playtypeName', 'playtypeCode', 'playtypeExample', 'unitPrice', 'maxBetFollow', 'maxBetMultiple', 'maxBetMoney', 'status']
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
                name: 'playtypeName',
                fieldLabel: '玩法名称'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '状态:',
                width: 200,
                items: [
                    {boxLabel: '启用', name: 'status', inputValue: '1'},
                    {boxLabel: '禁用', name: 'status', inputValue: '0'}
                ]
            }]
        });
        me.add({
            xtype: 'datagrid',
            store: store,
            name: 'roleListGrid',
            buildField: "Manual",
            forceFit: true,
            //tbar: [{
            //    text: '新增',
            //    iconCls: "icon-add",
            //    handler: function () {
            //        Ext.create('JDD.basedata.lottery.play.addBasedataPlayType', {store: store}).show();
            //    }
            //}],
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
                            var win = Ext.create("JDD.basedata.lottery.play.editBasedataPlayType", {
                                store: store,
                                id: record.data.id
                            });
                            win.down('dataform').setValues(record.data);
                            win.show();
                        }

                    }]
                }, {
                    text: 'playtypeId',
                    dataIndex: 'playtypeId'
                }, {
                    text: '彩种名称',
                    dataIndex: 'lotteryName'
                }, {
                    text: '名称',
                    dataIndex: 'playtypeName'
                }, {
                    text: '玩法示例',
                    dataIndex: 'playtypeExample'
                }, {
                    text: '销售提前时间',
                    dataIndex: 'endbuyBeforeSecond'
                }, {
                    text: '单注价格',
                    dataIndex: 'unitPrice'
                }, {
                    text: '最大跟单人数',
                    dataIndex: 'maxBetFollow'
                }, {
                    text: '最大倍数',
                    dataIndex: 'maxBetMultiple'
                }, {
                    text: '最大投注金额',
                    dataIndex: 'maxBetMoney'
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
        });
    }
});