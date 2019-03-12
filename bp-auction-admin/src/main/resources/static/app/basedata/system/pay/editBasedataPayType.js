Ext.define('JDD.basedata.system.pay.editBasedataPayType', {
    extend: 'Ext.window.Window',
    alias: 'editBasedataPayType',
    title: '编辑支付方式',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var labelWidth = 120;
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 2,
            items: [{
                name: 'name',
                labelWidth: labelWidth,
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 2,
                fieldLabel: '支付名称'
            }, {
                name: 'code',
                afterLabelTextTpl: required,
                allowBlank: false,
                labelWidth: labelWidth,
                colspan: 2,
                fieldLabel: '支付类型Code'
            }, {
                name: 'memo',
                labelWidth: labelWidth,
                colspan: 2,
                fieldLabel: '备注：加密类型'
            }, {
                name: 'serverUrl',
                labelWidth: labelWidth,
                colspan: 2,
                fieldLabel: '支付请求地址'
            }, {
                name: 'noticeAsynUrl',
                labelWidth: labelWidth,
                colspan: 2,
                fieldLabel: '支付通知地址（异步）'
            }, {
                name: 'noticeSyncUrl',
                labelWidth: labelWidth,
                colspan: 2,
                fieldLabel: '支付回调地址(同步)'
            },{
                colspan: 2,
                xtype: 'radiogroup',
                fieldLabel: '是否可用:',
                labelWidth: labelWidth,
                width: 200,
                items: [
                    {boxLabel: '启用', name: 'status', inputValue: '1', checked: true},
                    {boxLabel: '禁用', name: 'status', inputValue: '0'}
                ]
            }, {
                xtype: 'hidden',
                name: 'id'
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
            callapi("/basedata/private/basedataPayTypeController/updateBasedataPayType.do", form.getValues(),
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