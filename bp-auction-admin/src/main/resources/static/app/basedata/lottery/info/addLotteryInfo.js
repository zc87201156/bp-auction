Ext.define('JDD.basedata.lottery.info.addLotteryInfo', {
    extend: 'Ext.window.Window',
    alias: 'addLotteryInfo',
    title: '新增彩种',
    modal: true,
    width: 400,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var lotteries = Ext.create('DCIS.Store', {
            url: 'basedata/private/basedataLotteryTagController/listAllBasedataLotteryTag.do',
            autoLoad: true,
            fields: ['code', 'name']
        });
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            items: [{
                name: 'lotteryName',
                afterLabelTextTpl: required,
                allowBlank: false,
                labelWidth: 100,
                fieldLabel: '彩种名称'
            }, {
                name: 'shortName',
                afterLabelTextTpl: required,
                allowBlank: false,
                labelWidth: 100,
                fieldLabel: '彩种简称'
            }, {
                name: 'lotteryCode',
                afterLabelTextTpl: required,
                allowBlank: false,
                labelWidth: 100,
                fieldLabel: '彩种代码'
            }, {
                name: 'winNumberTemplate',
                afterLabelTextTpl: required,
                allowBlank: false,
                labelWidth: 100,
                fieldLabel: '开奖号码示例'
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                labelWidth: 100,
                decimalPrecision: 0,
                name: 'maxChaseCount',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '最大追号期次'
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                labelWidth: 100,
                name: 'endbuyBeforeSecond',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '销售提前时间'
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                labelWidth: 100,
                name: 'startbuyAfterChaseSecond',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '追号提前时间'
            }, {
                colspan: 1,
                xtype: 'radiogroup',
                fieldLabel: '加奖:',
                width: 200,
                items: [
                    {boxLabel: '是', name: 'extraWinningsStatus', inputValue: '1', checked: true},
                    {boxLabel: '否', name: 'extraWinningsStatus', inputValue: '0'}
                ]
            }, {
                xtype: 'checkgroup',
                name: 'tags',
                fieldLabel: '所属标签',
                displayField: "name",
                valueField: "code",
                columns: 3,
                itemWidth: 70,
                store: lotteries
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
            var lotteryIds = [];
            var ckbx = currentWindow.down('dataform').down('checkgroup[name="tags"]');
            for (var i = 0; i < ckbx.items.length; i++) {
                var checkObject = ckbx.items.get(i);
                if (checkObject.checked) {
                    lotteryIds.push(checkObject.name);
                }
            }
            datas.tags = lotteryIds.join(",");
            var store = currentWindow.store;
            callapi("/basedata/private/basedataLotteryController/saveBasedataLottery.do", datas,
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