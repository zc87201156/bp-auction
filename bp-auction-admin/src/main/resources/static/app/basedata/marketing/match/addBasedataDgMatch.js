Ext.define('JDD.basedata.marketing.match.addBasedataDgMatch', {
    extend: 'Ext.window.Window',
    alias: 'addBasedataDgMatch',
    title: '新增单关配活动',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var playTypeStore = Ext.create('DCIS.Store', {
            url: 'basedata/private/basedataPlayTypeController/listBasedataPlayTypeByLotteryId.do',
            autoLoad: true,
            baseParams: {lotteryId: 90},
            fields: ['playtypeId', 'lotteryId', 'lotteryName', 'endbuyBeforeSecond', 'playtypeName', 'playtypeCode', 'unitPrice', 'maxBetFollow', 'maxBetMultiple', 'maxBetMoney', 'status']
        });
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 2,
            items: [{
                xtype: "searchfield",
                store: 'jczqStore',
                displayField: 'id',
                valueField: 'id',
                name: 'jczqQueryId',
                pageSize: 10,
                //disabled: true,
                fieldLabel: '竞彩足球比赛',
                emptyText: "主队名称:客队名称",

                colspan: 1,

                //labelWidth: 100,
                width: 250,
                listeners: {
                    change: function (field, b, c) {
                        var val = field.getValue();
                        //alert(val);
                        callapi('basedata/private/basedataMatchJczqController/findBasedataMatchJczq.do', {
                            matchId: val
                        }, function (result) {
                            if (result.success) {
                                me.down("[name='hostTeam']").setValue(result.data.hostTeam);
                                me.down("[name='visitTeam']").setValue(result.data.visitTeam);
                                me.down("[name='issueMatchName']").setValue(result.data.issueMatchName);
                                //me.down("[name='queryId']").setValue("");
                                //alert(result.data.issueMatchName);
                            } else {
                                me.down("[name='hostTeam']").setValue("");
                                me.down("[name='visitTeam']").setValue("");
                                me.down("[name='issueMatchName']").setValue("");
                            }
                        }, null, null, false);
                    }
                }
            }, {
                name: 'issueMatchName',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '比赛编号'
            }, {
                //xtype: 'combo',
                //name: 'playtypeId',
                //fieldLabel: '玩法',
                //store: playTypeStore,
                //afterLabelTextTpl: required,
                //allowBlank: false,
                //colspan: 1,
                ////queryMode: "local",
                //displayField: 'playtypeName',
                //valueField: "playtypeId",
                //emptyText: "--请选择--",

                allowBlank: false,
                afterLabelTextTpl: required,
                name: 'playtypeId',
                fieldLabel: '活动玩法',
                minValue: 0,
                value: 9006,
                allowDecimals: true,
                decimalPrecision: 3,
                xtype: 'combo',
                editable: false,
                store: [[9006, '胜平负'], [9001, '让球胜平负'], [9002, '总进球'], [9003, '猜比分'], [9004, '半全场'], [90062, '不中免单'], [9005, '单关固定']]
            }, {
                name: 'ptype',
                xtype: 'checkgroup',
                fieldLabel: '彩种玩法',
                displayField: "name",
                valueField: "code",
                columns: 2,
                itemWidth: 80,
                value: 6,
                checked: 6
                , store: [[1, '让球胜平负'], [2, '总进球'], [3, '猜比分'], [4, '半全场'], [6, '胜平负']]
                //1：让球胜平负，2：总进球，3：猜比分，4：半全场，6：胜平负
                //ptype注释
            }, {
                name: 'hostTeam',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '主队名称'
            }, {
                name: 'visitTeam',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '客队名称'

            }, {
                name: 'recommResult',
                fieldLabel: '推荐彩果'
            }, {
                name: 'supportRate',
                fieldLabel: '支持率'
            }, {
                xtype: 'datetimefield',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                editable: false,
                name: 'recommBeginTime',
                format: 'Y-m-d H:i:s',
                fieldLabel: '推荐开始时间'
            }, {
                xtype: 'datetimefield',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                editable: false,
                name: 'recommEndTime',
                format: 'Y-m-d H:i:s',
                fieldLabel: '推荐结束时间'
            }, {
                //name: 'bgImgUrl',
                //afterLabelTextTpl: required,
                //allowBlank: false,
                //colspan: 2,
                //fieldLabel: '显示背景色'

                xtype: 'textfield',
                name: 'bgImgUrl',
                blankText: '请上传大图',
                fieldLabel: '显示背景色',
                //maxLength: 100,
                readOnly: true,
                maxLengthText: '最大长度100',
                //labelWidth: 100,
                //width: 400
            }, {
                xtype: 'button',
                text: '上传图片',
                iconCls: "icon-upload",
                colspan: 1,
                width: 80,
                handler: function () {
                    var me = this;
                    uploadPicture("basedata/private/picture/uploadPicture.do", function (re) {
                        var dataform = me.up('dataform');
                        dataform.down("[name='bgImgUrl']").setValue(re.data);
                    })
                }
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'order',
                colspan: 2,
                fieldLabel: '排序号',
                width: 230

            }, {
                xtype: 'radiogroup',
                fieldLabel: '是否热门:',
                width: 200,
                colspan: 1,
                items: [
                    {boxLabel: '是', name: 'hotStatus', inputValue: '1', checked: true},
                    {boxLabel: '否', name: 'hotStatus', inputValue: '0'}
                ]
            }, {
                xtype: 'radiogroup',
                fieldLabel: '状态:',
                width: 200,
                colspan: 1,
                items: [
                    {boxLabel: '启用', name: 'status', inputValue: '1', checked: true},
                    {boxLabel: '禁用', name: 'status', inputValue: '0'}
                ]
            }]
        });
    },
    buttons: [{
        text: '保存',
        iconCls: "icon-ok",
        handler: function () {
            var currentWindow = this.up('window');
            var form = currentWindow.down('dataform').getForm();
            if (!form.isValid()) {
                return;
            }
            var datas = form.getValues();
            var ptypes = [];
            var ckbx = currentWindow.down('dataform').down('checkgroup[name="ptype"]');
            for (var i = 0; i < ckbx.items.length; i++) {
                var checkObject = ckbx.items.get(i);
                if (checkObject.checked) {
                    ptypes.push(checkObject.name);
                }
            }
            var match = callapiAsync("basedata/private/basedataMatchController/findBasedataMatchJczqByIssueMatchName.do", {issueMatchName: datas.issueMatchName});
            if (match.success) {
                //alert("match.data.buyEndTime "+match.data.buyEndTime);
                ////Ext.util.Format.date(new Date(parseInt(value)),fmt);
                //alert("datas.recommEndTime "+new Date(datas.recommEndTime).getTime());
                //alert("datas.recommEndTime "+datas.recommEndTime);
                if (match.data.buyEndTime < new Date(datas.recommEndTime).getTime()) {
                    Ext.Msg.show({
                        title: '错误',
                        msg:"推荐结束时间不能大于购买结束时间",
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        modal: true
                    });
                    return;
                }
            } else {
                Ext.Msg.show({
                    title: '错误',
                    msg: match.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    modal: true
                });
                return;
            }
            if (9005 == datas.playtypeId) {
                if (ptypes.length < 1) {
                    Ext.Msg.show({
                        title: '错误',
                        msg: '单关固定,必须选择玩法细项!',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        modal: true
                    });
                    return;
                }
                var result = callapiAsync("basedata/private/basedataMatchController/findBasedataSalestateJczq.do", {issueMatchName: datas.issueMatchName});
                if (result.success) {
                    for (var i = 0; i < ckbx.items.length; i++) {
                        var checkObject = ckbx.items.get(i);
                        if (checkObject.checked) {
                            //[[1, '让球胜平负'], [2, '总进球'], [3, '猜比分'], [4, '半全场'], [6, '胜平负']]
                            var msgText = "该比赛没有开";
                            if (checkObject.name == 1) {
                                if (result.data.dgRqspfStatus == 0) {
                                    Ext.Msg.show({
                                        title: '错误',
                                        msg: msgText + " 让球胜平负 ",
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        modal: true
                                    });
                                    return;
                                }
                            }
                            if (checkObject.name == 2) {
                                if (result.data.dgJqsStatus == 0) {
                                    Ext.Msg.show({
                                        title: '错误',
                                        msg: msgText + " 总进球 ",
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        modal: true
                                    });
                                    return;
                                }
                            }
                            if (checkObject.name == 3) {
                                if (result.data.dgCbfStatus == 0) {
                                    Ext.Msg.show({
                                        title: '错误',
                                        msg: msgText + " 猜比分 ",
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        modal: true
                                    });
                                    return;
                                }
                            }
                            if (checkObject.name == 4) {
                                if (result.data.dgBqcStatus == 0) {
                                    Ext.Msg.show({
                                        title: '错误',
                                        msg: msgText + " 半全场 ",
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        modal: true
                                    });
                                    return;
                                }
                            }
                            if (checkObject.name == 6) {
                                if (result.data.dgSpfStatus == 0) {
                                    Ext.Msg.show({
                                        title: '错误',
                                        msg: msgText + " 胜平负 ",
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        modal: true
                                    });
                                    return;
                                }
                            }
                        }
                    }
                } else {
                    Ext.Msg.show({
                        title: '错误',
                        msg: result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        modal: true
                    });
                    return;
                }
            }
            datas.ptypes = ptypes.join(",");
            var store = currentWindow.store;
            callapi("/basedata/private/basedataDgMatchController/saveBasedataDgMatch.do", datas,
                function (result) {
                    if (result.success) {
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "保存成功",
                            modal: true,
                            icon: Ext.Msg.INFO,
                            buttons: Ext.Msg.OK
                        });
                        store.load();
                        currentWindow.close();
                    }
                    else {
                        Ext.Msg.show({
                            title: '错误',
                            msg: '保存失败!',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            modal: true
                        });
                    }
                });
        }
    }]
});