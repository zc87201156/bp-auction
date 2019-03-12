Ext.define('WF.view.categoryConfig.addCategoryConfig', {
    extend: 'Ext.window.Window',
    alias: 'addCategoryConfig',
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
                name: 'name',
                allowBlank: false,
                colspan: 1,
                maxLength: 100,
                fieldLabel: '类目名称'
            }, {
                name: 'img',
                allowBlank: true,
                colspan: 1,
                maxLength: 500,
                readOnly: true,
                fieldLabel: '图片'
            },{
                xtype: 'button',
                text: '上传图片',
                colspan: 1,
                handler: function () {
                    var me = this;
                    uploadPicture('/auction/admin/common/data/uploadImage', function (re) {
                        var dataform = me.up('dataform');
                        dataform.down("[name='img']").setValue(re.data.data);
                    })
                }
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
            callapi('/auction/admin/categoryConfig/save', form.getValues(),
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