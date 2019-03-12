Ext.define('JDD.basedata.lottery.gpc.limit.addBasedataLimitGpc', {
    extend: 'Ext.window.Window',
    alias: 'addBasedataLimitGpc',
    title: '新增限号',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var lotteryStore = Ext.create('DCIS.Store', {
            url: 'basedata/private/basedataLotteryTagController/listLotteryTagRelationByLotteryCode.do',
            autoLoad: true,
            baseParams: {code: "GPC"},//高频彩
            fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'status','gpcStatus']
        });
        var playTypeStore = Ext.create('DCIS.Store', {
            url: 'basedata/private/basedataPlayTypeController/listBasedataPlayTypeByLotteryId.do',
            autoLoad: false,
            fields: ['playtypeId', 'lotteryId', 'lotteryName', 'endbuyBeforeSecond', 'playtypeName', 'playtypeCode', 'unitPrice', 'maxBetFollow', 'maxBetMultiple', 'maxBetMoney', 'status']
        });
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 1,
            items: [{
                name: 'lotteryId',
                fieldLabel: '彩种',
                xtype: 'combo',
                emptyText: "--请选择--",
                displayField: 'lotteryName',
                valueField: "lotteryId",
                editable: false,
                queryMode: "local",
                store: lotteryStore,
                afterLabelTextTpl: required,
                allowBlank: false,
                listeners: {
                    change: function (field, b, c) {
                        var val = field.getValue();
                        playTypeStore.proxy.extraParams = Ext.apply(playTypeStore.proxy.extraParams, {"lotteryId": val});
                        playTypeStore.load();
                        me.down("[name='playtypeId']").setValue([]);
                        me.down("[name='limitDetail']").setValue("");
                    }
                }
            }, {
                xtype: 'combo',
                name: 'playtypeId',
                fieldLabel: '玩法',
                store: playTypeStore,
                editable: false,
                displayField: 'playtypeName',
                valueField: "playtypeId",
                afterLabelTextTpl: required,
                allowBlank: false,
                emptyText: "--请选择--",
                listeners: {
                    change: function (field, b, c) {
                        var val = field.getValue();
                        //alert(val);
                        callapi('/basedata/private/basedataPlayTypeController/findBasedataPlayType.do', {
                            playtypeId: val
                        }, function (result) {
                            if (result.success) {
                                me.down("[name='limitDetailTest']").setValue(result.data.playtypeExample);
                            } else {
                                me.down("[name='limitDetailTest']").setValue("");
                            }
                        }, null, null, false);
                        me.down("[name='limitDetail']").setValue("");
                    }
                }
            }, {
                xtype: 'displayfield',
                name: 'limitDetailTest',
                fieldLabel: '限号示例',
            }, {
                afterLabelTextTpl: required,
                allowBlank: false,
                name: 'limitDetail',
                fieldLabel: '限号详情',
            }, {
                xtype: 'hidden',
                name: 'status',
                value:1

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
            var store = currentWindow.store;
            callapi("/basedata/private/basedataLimitGpcController/saveBasedataLimitGpc.do", form.getValues(),
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