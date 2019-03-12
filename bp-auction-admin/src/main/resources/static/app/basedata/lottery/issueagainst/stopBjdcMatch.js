Ext.define('JDD.basedata.lottery.issueagainst.stopBjdcMatch', {
    extend: 'Ext.window.Window',
    alias: 'stopBjdcMatch',
    title: '停售',
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
            columns: 1,
            items: [{
                xtype: "textarea",
                name: "stopSaleReason",
                fieldLabel: '停售原因',
                afterLabelTextTpl: required,
                colspan: 1,
                allowBlank: false
            }, {
                xtype:'hidden',
                name:'issueMatchName',
                value:me.issueMatchName
            }, {
                xtype:'hidden',
                name:'lotteryId',
                value:me.lotteryId
            }, {
                xtype:'hidden', 
                name:'issueName',
                value:me.issueName
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
            var loading = new Ext.LoadMask(currentWindow.panel, {
                msg : '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopSaleBJDC.do", form.getValues(),
                function (result) {
                    loading.hide();
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