Ext.define('JDD.basedata.lottery.issue.addBasedataIssueFrequency', {
    extend: 'Ext.window.Window',
    alias: 'addBasedataIssueFrequency',
    title: '高频彩期次添加',
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
            fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'auditStatus','gpcStatus']
        });

        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 1,
            items: [{
                //xtype : "searchfield",
                //name : "lotteryId",
                //store : 'lotteryStore',
                //displayField : 'lotteryName',
                //valueField : 'lotteryId',
                //pageSize : 10,
                //fieldLabel : '彩种名称',
                //afterLabelTextTpl: required,
                //colspan: 1,
                //allowBlank: false

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
                colspan: 1,
                allowBlank: false
            }, {
                xtype: 'datefield',
                format: 'Y-m-d',
                name: 'startTime',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '开始日期',
                //var date = Ext.Date.add(new Date('10/29/2006'), Ext.Data.DAY, 5); //增加5天
                //minValue:Ext.util.Format.date(Ext.Date.add(new Date(),Ext.Date.DAY,0),"Y-m-d"),
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'daysCount',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '添加天数',
                value:100
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
            callapi("/basedata/private/basedataIssueController/addFrequencyBasedataIssue.do", form.getValues(),
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