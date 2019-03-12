Ext.define('JDD.basedata.lottery.issue.editBasedataIssue', {
    extend: 'Ext.window.Window',
    alias: 'editBasedataIssue',
    title: '编辑期次',
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
                name: 'issueName',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '期号'
            }, {
                xtype: 'datetimefield',
                format: 'Y-m-d H:i:s',
                name: 'startTime',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '开售时间'
            }, {
                xtype: 'datetimefield',
                format: 'Y-m-d H:i:s',
                name: 'endTime',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '截止时间',

            }, {
                xtype: 'hidden',
                name: 'issueId'
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
            callapi("/basedata/private/basedataIssueController/updateBasedataIssue.do", form.getValues(),
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