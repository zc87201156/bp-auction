Ext.define('JDD.basedata.system.pay.editTheMerchantInfo', {
    extend: 'Ext.window.Window',
    alias: 'editTheMerchantInfo',
    title: '编辑',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    modal: true,
    width: 650,
    height: 350,
    resizable: false,
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            columns: 2,
            items: [{
                name: 'customerCode',
                fieldLabel: '商户号',
                afterLabelTextTpl: required,
                labelWidth: 95,
                value: '',
                allowBlank: false,
                maxLength: 50,
                colspan:2,
                width: 550
            }, {
                name: 'customerName',
                fieldLabel: '商户名称',
                labelWidth: 95,
                value: '',
                maxLength: 50,
                colspan:2,
                width: 550
            },{
                name: 'md5Key',
                fieldLabel: 'MD5Key',
                value: '',
                maxLength: 200,
                colspan:2,
                width: 550,
                allowBlank: true
            }, {
                name: 'rsaPublicKey',
                fieldLabel: 'RsaPublicKey',
                labelWidth: 95,
                colspan:2,
                value: '',
                maxLength: 2000,
                width: 550
            }, {
                name: 'rsaPrivateKey',
                fieldLabel: 'RsaPrivateKey',
                labelWidth: 95,
                value: '',
                colspan:2,
                maxLength: 2000,
                width: 550
            }, {
                name: "desKey",
                fieldLabel: "DesKey",
                labelWidth: 95,
                value: '',
                colspan:2,
                maxLength: 2000,
                width: 550
            }, {
                xtype:"numberfield",
                name: "order",
                fieldLabel: "排序",
                labelWidth: 95,
                value: '',
                colspan:2,
                maxLength: 50,
                width: 550
            }, {
                xtype: 'hidden',
                name: 'payTypeId'
            },{
                xtype: 'hidden',
                name: 'id'
            }]
        });
    },
    buttons: [{
        xtype: 'tbfill'
    }, {
        text: '保存',
        name: 'btnSave',
        iconCls: "icon-save",
        handler: function () {
            var currentWindow = this.up('window');
            var dataform = currentWindow.down('form');
            var form = dataform.getForm();
            if (!form.isValid()) {
                return;
            }
            var merchantStore = currentWindow.store;
            var data = dataform.getValues();
            callapi("basedata/private/basedataPayTypeController/editMerchant.do", data, function (result) {
                if (result == true) {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "保存成功",
                        modal: true,
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    merchantStore.load();
                    currentWindow.close();
                } else {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "保存失败",
                        modal: true,
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                }
            })
        }
    }, {
        text: '取消',
        iconCls: "icon-no",
        handler: function () {
            this.up('window').close();
        }
    }]
});