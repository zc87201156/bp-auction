Ext.define('JDD.basedata.lottery.win.editBasedataWinType', {
    extend: 'Ext.window.Window',
    alias: 'editBasedataWinType',
    title: '编辑奖励',
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
                name: 'wintypeName',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '奖等名称'
            }, {
                xtype: 'numberfield',
                allowDecimals: true,
                decimalPrecision: 4,
                name: 'defaultWinmoney',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '税前奖金'
            }, {
                xtype: 'numberfield',
                allowDecimals: true,
                decimalPrecision: 4,
                name: 'defaultWinmoneyNotax',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '税后奖金'
            }, {
                xtype: 'numberfield',
                allowDecimals: true,
                decimalPrecision: 4,
                name: 'extraWinningsAmount',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '加奖金额'
            }, {
                colspan: 1,
                xtype: 'radiogroup',
                fieldLabel: '是否浮动奖金:',
                width: 200,
                items: [
                    {boxLabel: '浮动', name: 'floatWinningsStatus', inputValue: '1'},
                    {boxLabel: '固定', name: 'floatWinningsStatus', inputValue: '0'}
                ]
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'order',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '顺序'
            }, {
                colspan: 1,
                xtype: 'radiogroup',
                fieldLabel: '状态:',
                width: 200,
                items: [
                    {boxLabel: '有效', name: 'status', inputValue: '1'},
                    {boxLabel: '无效', name: 'status', inputValue: '0'}
                ]
            }, {
                xtype: 'hidden',
                name: 'id'
            }, {
                xtype: 'hidden',
                name: 'lotteryId'
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
            callapi("/basedata/private/basedataWinTypeController/updateBasedataWinType.do", form.getValues(),
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