Ext.define('JDD.basedata.lottery.win.basedataWinTypeMain', {
    extend: 'Ext.panel.Panel',
    title: '奖励管理',
    xtype: 'basedataWinTypeMain',
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
            url: '/basedata/private/basedataWinTypeController/listBasedataWinType.do',
            autoLoad: true,
            fields: ['id', 'lotteryId', 'lotteryName', 'wintypeName', 'defaultWinmoney', 'defaultWinmoneyNotax', 'extraWinningsAmount', 'floatWinningsStatus', 'order', 'status']
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
                name: 'wintypeName',
                fieldLabel: '名称'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '是否浮动奖金:',
                width: 200,
                items: [
                    {boxLabel: '浮动', name: 'floatWinningsStatus', inputValue: '1'},
                    {boxLabel: '固定', name: 'floatWinningsStatus', inputValue: '0'}
                ]
            }, {
                xtype: 'radiogroup',
                fieldLabel: '状态:',
                width: 200,
                items: [
                    {boxLabel: '有效', name: 'status', inputValue: '1'},
                    {boxLabel: '无效', name: 'status', inputValue: '0'}
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
                    Ext.create('JDD.basedata.lottery.win.addBasedataWinType', {store: store}).show();
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
                    width: 60,
                    callback: function (link, record) {
                        return link;
                    },
                    links: [{
                        icon: 'edit',
                        linkText: '编辑',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create("JDD.basedata.lottery.win.editBasedataWinType", {
                                store: store,
                                id: record.data.id
                            });
                            win.down('dataform').setValues(record.data);
                            win.show();
                        }

                    }]
                }, {
                    text: '彩种名称',
                    dataIndex: 'lotteryName'
                }, {
                    text: '奖等名称',
                    dataIndex: 'wintypeName'
                }, {
                    text: '中奖金额',
                    dataIndex: 'defaultWinmoney'
                }, {
                    text: '税后金额',
                    dataIndex: 'defaultWinmoneyNotax'
                }, {
                    text: '加奖金额',
                    dataIndex: 'extraWinningsAmount'
                }, {
                    text: '顺序', width: 60,
                    dataIndex: 'order'
                }, {
                    text: '是否浮动奖金', width: 80,
                    dataIndex: 'floatWinningsStatus',
                    renderer: function (value) {
                        if (value == 0) {
                            return '固定';
                        } else if (value == 1) {
                            return '浮动';
                        }
                    }
                }, {
                    text: '状态', width: 60,
                    dataIndex: 'status',
                    renderer: function (value) {
                        if (value == 0) {
                            return "<span style='color:red;font-weight:bold;'>无效</span>";
                        } else if (value == 1) {
                            return '有效';
                        }
                    }
                }
            ]
        });
    }
});