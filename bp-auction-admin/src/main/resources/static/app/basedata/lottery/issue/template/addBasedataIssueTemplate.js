Ext.define('JDD.basedata.lottery.issue.template.addBasedataIssueTemplate', {
    extend: 'Ext.window.Window',
    alias: 'addBasedataIssueTemplate',
    title: '新增期次模板',
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
            fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'auditStatus', 'gpcStatus']
        });


        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 1,
            items: [{
                name: 'lotteryId',
                fieldLabel: '高频彩种',
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
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'minute',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '多少分钟一期次',
                value:10
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'quantity',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '最大期次数',
                value:10
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'dgidts',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '期次号位数',
                value:2
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
            callapi("/basedata/private/basedataIssueTemplateController/saveBasedataIssueTemplate.do", form.getValues(),
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