Ext.define('WF.view.banner.addBanner', {
    extend: 'Ext.window.Window',
    alias: 'addBanner',
    title: '新增',
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
            columns: 2,
            items: [{
                afterLabelTextTpl: required,
                name: 'image',
                allowBlank: false,
                colspan: 1,
                maxLength: 500,
                readOnly: true,
                fieldLabel: '图片URL'
            }, {
                xtype: 'button',
                text: '上传图片',
                colspan: 1,
                handler: function () {
                    var me = this;
                    uploadPicture('/auction/admin/common/data/uploadImage', function (re) {
                        var dataform = me.up('dataform');
                        dataform.down("[name='image']").setValue(re.data.data);
                    })
                }
            },{
                name: 'link',
                xtype: 'textarea',
                allowBlank: true,
                colspan: 2,
                maxLength: 2000,
                fieldLabel: '图片链接'
            }, {
                afterLabelTextTpl: required,
                name: 'sort',
                xtype: 'numberfield',
                allowDecimals: false,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '序号'
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
            var doRefresh = currentWindow.doRefresh;
            callapi('/auction/admin/banner/save', form.getValues(),
                function (result) {
                    if (result.success) {
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "保存成功",
                            modal: true,
                            icon: Ext.Msg.INFO,
                            buttons: Ext.Msg.OK
                        });
                        doRefresh.reload();
                        currentWindow.close();
                    }
                    else {
                        Ext.Msg.show({
                            title: '错误',
                            msg: result.message,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            modal: true
                        });
                    }
                });
        }
    }]
});