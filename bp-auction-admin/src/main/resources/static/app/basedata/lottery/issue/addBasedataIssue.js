Ext.define('JDD.basedata.lottery.issue.addBasedataIssue', {
    extend: 'Ext.window.Window',
    alias: 'addBasedataIssue',
    title: '数字彩期次添加',
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
            baseParams: {code: "SZC"},//数字彩
            fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'status', 'gpcStatus']
        });

        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 1,
            items: [{
                //xtype: "searchfield",
                //name: "lotteryId",
                //store: 'lotteryStore',
                //displayField: 'lotteryName',
                //valueField: 'lotteryId',
                //pageSize: 10,
                //fieldLabel: '彩种名称',
                //afterLabelTextTpl: required,
                //colspan: 1,
                //allowBlank: false

                name: 'lotteryId',
                fieldLabel: '数字彩种',
                xtype: 'combo',
                emptyText: "--请选择--",
                displayField: 'lotteryName',
                valueField: "lotteryId",
                editable: false,
                queryMode: "local",
                store: lotteryStore,
                afterLabelTextTpl: required,
                colspan: 1,
                allowBlank: false
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'count',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '添加期数',
                value: 100
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
            callapi("/basedata/private/basedataIssueController/addNumberBasedataIssue.do", form.getValues(),
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
                            msg: result.data,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            modal: true
                        });
                    }
                });
        }
    }]
});