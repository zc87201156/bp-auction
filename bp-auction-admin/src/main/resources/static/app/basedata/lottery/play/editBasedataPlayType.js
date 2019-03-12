Ext.define('JDD.basedata.lottery.play.editBasedataPlayType', {
    extend: 'Ext.window.Window',
    alias: 'editBasedataPlayType',
    title: '编辑彩种',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 2,
            items: [{
                //xtype: 'textarea',
                name: 'playtypeExample',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 2,
                fieldLabel: '玩法示例'
            }, {
                xtype: 'hidden',
                name: 'playtypeId'
            }, {
                xtype: 'hidden',
                name: 'lotteryId'
            }, {
                xtype: 'hidden',
                name: 'lotteryName'
            }, {
                xtype: 'hidden',
                name: 'endbuyBeforeSecond'
            }, {
                xtype: 'hidden',
                name: 'playtypeName'
            }, {
                xtype: 'hidden',
                name: 'playtypeCode'
            }, {
                xtype: 'hidden',
                name: 'unitPrice'
            }, {
                xtype: 'hidden',
                name: 'maxBetFollow'
            }, {
                xtype: 'hidden',
                name: 'maxBetMultiple'
            }, {
                xtype: 'hidden',
                name: 'maxBetMoney'
            }, {
                xtype: 'hidden',
                name: 'status'
            }]

        });
    },
    buttons: [{
        text: '保存信息',
        iconCls: "icon-ok",
        handler: function () {
            var currentWindow = this.up('window');
            var form = currentWindow.down('dataform').getForm();
            if (!form.isValid()) {
                return;
            }
            var store = currentWindow.store;
            callapi("/basedata/private/basedataPlayTypeController/updateBasedataPlayType.do", form.getValues(),
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