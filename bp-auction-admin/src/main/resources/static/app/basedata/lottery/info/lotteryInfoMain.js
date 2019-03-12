Ext.define('JDD.basedata.lottery.info.lotteryInfoMain', {
    extend: 'Ext.panel.Panel',
    title: '彩种页',
    xtype: 'lotteryInfoMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataLotteryController/listBasedataLottery.do',
            autoLoad: true,
            fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'status', 'tags']
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
                name: 'lotteryName',
                fieldLabel: '名称'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '加奖:',
                width: 220,
                items: [
                    {boxLabel: '是', name: 'extraWinningsStatus', inputValue: '1'},
                    {boxLabel: '否', name: 'extraWinningsStatus', inputValue: '0'}
                ]
            }, {
                xtype: 'radiogroup',
                fieldLabel: '状态:',
                width: 220,
                items: [
                    {boxLabel: '在售', name: 'status', inputValue: '1'},
                    {boxLabel: '停售', name: 'status', inputValue: '0'}
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
                    Ext.create('JDD.basedata.lottery.info.addLotteryInfo', {store: store}).show();
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
                        if (record.data.status == 1) {
                            link[1].disabled = true;
                            link[2].disabled = false;

                        } else {
                            link[1].disabled = false;
                            link[2].disabled = true;
                        }
                        return link;
                    },
                    links: [{
                        icon: 'edit',
                        linkText: '编辑',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create("JDD.basedata.lottery.info.editlotteryInfo", {
                                store: store,
                                id: record.data.id
                            });
                            var dataForm = win.down('dataform');
                            dataForm.setValues(record.data);
                            var tags = record.data.tags;
                            var tag = tags.split(",");
                            var checkedObj = {};
                            if (tag != null && tag != "") {
                                for (var no in tag) {
                                    var s = tag[no];
                                    checkedObj[s] = true;
                                }
                            }
                            //    //给出票彩种赋值
                            dataForm.down('checkgroup[name="tags"]').setValue(checkedObj);
                            win.show();
                        }
                    },
                        {
                            icon: 'ok',
                            linkText: '开售',
                            handler: function (grid, rowIndex, colIndex, record) {
                                updateStatus(record.data.lotteryId, "<span style='color:red;font-weight:bold;'> 开售 " + record.data.lotteryName + "</span> 彩种", 1);
                            }
                        }
                        ,
                        {
                            icon: 'cancel',
                            linkText: '停售',
                            handler: function (grid, rowIndex, colIndex, record) {
                                updateStatus(record.data.lotteryId, "<span style='color:red;font-weight:bold;'> 停售 " + record.data.lotteryName + "</span> 彩种", 0);
                            }
                        }
                    ]
                },
                {
                    text: 'id',
                    width: 60,
                    locked: true,
                    dataIndex: 'lotteryId'
                }
                ,
                {
                    text: '名称',
                    locked: true,
                    dataIndex: 'lotteryName'
                }
                ,
                {
                    text: '简称',
                    dataIndex: 'shortName'
                }
                ,
                {
                    text: '代码',
                    dataIndex: 'lotteryCode'
                }
                ,
                {
                    text: '开奖号码示例',
                    width: 280,
                    dataIndex: 'winNumberTemplate'
                }
                ,
                {
                    text: '最大追号期次',
                    dataIndex: 'maxChaseCount'
                }
                ,
                {
                    text: '销售提前时间',
                    dataIndex: 'endbuyBeforeSecond'
                }
                ,
                {
                    text: '追号提前时间',
                    dataIndex: 'startbuyAfterChaseSecond'
                }
                ,
                {
                    text: '拆票提前时间',
                    dataIndex: 'endissueAfterOpenSecond'
                }
                ,
                {
                    text: '加奖',
                    dataIndex: 'extraWinningsStatus',
                    renderer: function (value) {
                        if (value == 0) {
                            return "<span style='color:red;font-weight:bold;'>否</span>";
                        } else if (value == 1) {
                            return '是';
                        }
                    }
                }
                ,
                {
                    text: '状态',
                    dataIndex: 'status',
                    renderer: function (value) {
                        if (value == 0) {
                            return "<span style='color:red;font-weight:bold;'>停售</span>";
                        } else if (value == 1) {
                            return '在售';
                        }
                    }
                }
            ]
        })
        ;
        function updateStatus(id, msg, status) {
            Ext.Msg.confirm("确认", "确定" + msg + "吗?", function (button) {
                if (button == "yes") {
                    callapi('basedata/private/basedataLotteryController/updateLotteryStatus.do', {
                        lotteryId: id,
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
})
;