Ext.define('JDD.basedata.marketing.match.basedataDgMatchMain', {
    extend: 'Ext.panel.Panel',
    title: '单关配置页',
    xtype: 'basedataDgMatchMain',
    closable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var store = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataDgMatchController/listBasedataDgMatch.do',
            autoLoad: true,
            fields: ['id', 'issueMatchName', 'hostTeam', 'visitTeam', 'playtypeId', 'playtypeName', 'ptypes', 'recommResult', 'supportRate', 'hotStatus', 'recommBeginTime', 'recommEndTime', 'bgImgUrl', 'order', 'status', 'createTime']
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
                name: 'issueMatchName',
                fieldLabel: '比赛编号'
            }, {
                name: 'hostTeam',
                fieldLabel: '主队名称'
            }, {
                name: 'visitTeam',
                fieldLabel: '客队名称'
            }, {
                name: 'playtypeId',
                fieldLabel: '活动玩法',
                xtype: 'combo',
                editable: false,
                store: [[9006, '胜平负'], [9001, '让球胜平负'], [9002, '总进球'], [9003, '猜比分'], [9004, '半全场'], [90062, '不中免单'], [9005, '单关固定']]
            }, {
                xtype: 'datefield',
                name: 'recommEndTime',
                format: 'Y-m-d',
                fieldLabel: '推荐结束时间',
                editable: false
            }, {
                xtype: 'datefield',
                name: 'recommEndTime1',
                format: 'Y-m-d',
                fieldLabel: '至',
                editable: false
            },{
                xtype: 'datefield',
                name: 'createTime',
                format: 'Y-m-d',
                fieldLabel: '创建时间',
                editable: false
            }, {
                colspan: 2,
                xtype: 'datefield',
                name: 'createTime1',
                format: 'Y-m-d',
                fieldLabel: '至',
                editable: false
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
                    Ext.create('JDD.basedata.marketing.match.addBasedataDgMatch', {store: store}).show();
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
                    width: 120,
                    callback: function (link, record) {
                        return link;
                    },
                    links: [{
                        icon: 'edit',
                        linkText: '编辑',
                        handler: function (grid, rowIndex, colIndex, record) {
                            var win = Ext.create("JDD.basedata.marketing.match.editBasedataDgMatch", {
                                store: store,
                                id: record.data.id
                            });
                            var dataForm = win.down('dataform');
                            dataForm.setValues(record.data);
                            var tags = record.data.ptypes;
                            if (tags != null && tags != "") {
                                var tag = tags.split(",");
                                var checkedObj = {};
                                if (tag != null && tag != "") {
                                    for (var no in tag) {
                                        var s = tag[no];
                                        checkedObj[s] = true;

                                    }
                                }
                                dataForm.down('checkgroup[name="ptype"]').setValue(checkedObj);
                            }
                            win.show();
                        }
                    }, {
                        icon: 'cancel',
                        linkText: '删除',
                        handler: function (grid, rowIndex, colIndex, record) {
                            deleteData(record.data.issueMatchName, "<span style='color:red;font-weight:bold;'> 删除  " + record.data.issueMatchName + "</span> ");
                        }
                    }]
                }, {
                    //    text: 'id',
                    //    dataIndex: 'id'
                    //}, {
                    text: '比赛编号',
                    locked: true,
                    dataIndex: 'issueMatchName'
                }, {
                    text: '主队名称',
                    locked: true,
                    dataIndex: 'hostTeam'
                }, {
                    text: '客队名称',
                    locked: true,
                    dataIndex: 'visitTeam'
                }, {
                    text: '活动玩法',
                    dataIndex: 'playtypeId',
                    //[[9006, '胜平负'], [9001, '让球胜平负'], [9002, '总进球'], [9003, '猜比分'], [9004, '半全场'], [90062, '不中免单'], [9005, '单关固定']],
                    renderer: function (value) {
                        if (value == 9006) {
                            return '胜平负';
                        } else if (value == 9001) {
                            return '让球胜平负';
                        } else if (value == 9002) {
                            return '总进球';
                        } else if (value == 9003) {
                            return '猜比分';
                        } else if (value == 9004) {
                            return '半全场';
                        } else if (value == 90062) {
                            return '不中免单';
                        } else if (value == 9005) {
                            return '单关固定';
                        }
                    }
                }, {
                    text: '彩种玩法',
                    dataIndex: 'ptypes',
                    renderer: function (value) {
                        if (value == null) {
                            value = "";
                        }
                        //[[1, '让球胜平负'], [2, '总进球'], [3, '猜比分'], [4, '半全场'], [6, '胜平负']]
                        value=value.replace('1',"让球胜平负");
                        value=value.replace('2',"总进球");
                        value=value.replace('3',"猜比分");
                        value=value.replace('4',"半全场");
                        value=value.replace('6',"胜平负");
                        return value;
                    }
                }, {
                    text: '推荐彩果',
                    dataIndex: 'recommResult'
                }, {
                    text: '支持率',
                    dataIndex: 'supportRate'
                }, {
                    text: '推荐开始时间',
                    dataIndex: 'recommBeginTime',
                    width: 150
                }, {
                    text: '推荐结束时间 ',
                    dataIndex: 'recommEndTime',
                    width: 150
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
                }, {
                    text: '顺序',
                    dataIndex: 'order'
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
                }, {
                    text: '创建时间',
                    dataIndex: 'createTime',
                    width: 150
                }
            ]
        });

        function deleteData(issueMatchName, msg) {
            Ext.Msg.confirm("确认", "确定<span style='color:red;font-weight:bold;'>" + msg + " </span>吗?", function (button) {
                if (button == "yes") {
                    callapi('/basedata/private/basedataDgMatchController/deleteBasedataDgMatch.do', {
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