Ext.define('JDD.basedata.lottery.issue.template.editBasedataIssueTemplate', {
    extend: 'Ext.window.Window',
    alias: 'editBasedataIssueTemplate',
    title: '编辑',
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
                xtype: 'displayfield',
                name: 'lotteryName',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '彩种'
            }, {
                name: 'nameTemplate',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '期号模板'
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
                fieldLabel: '截止时间'
            }, {
                //'id', 'lotteryId', 'lotteryName', 'nameTemplate', 'status', 'startTime', 'endTime'
                xtype: 'hidden',
                name: 'id'
            }, {
                xtype: 'hidden',
                name: 'lotteryId'
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
            callapi("/basedata/private/basedataIssueTemplateController/updateBasedataIssueTemplate.do", form.getValues(),
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