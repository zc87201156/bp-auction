Ext.define('WF.view.activity.editActivity', {
    extend: 'Ext.window.Window',
    alias: 'editActivity',
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
            columns: 2,
            items: [{
                afterLabelTextTpl: required,
                name: 'name',
                allowBlank: false,
                colspan: 1,
                maxLength: 100,
                fieldLabel: '活动名称'
            }, {
                afterLabelTextTpl: required,
                name: 'awardNum',
                xtype: 'numberfield',
                allowDecimals: false,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '奖池数量'
            },{
                afterLabelTextTpl: required,
                name: 'startTime',
                xtype: 'datetimefield',
                allowBlank: false,
                colspan: 1,
                editable: false,
                format: 'Y-m-d H:i:s',
                fieldLabel: '活动开始时间'
            },{
                afterLabelTextTpl: required,
                name: 'endTime',
                xtype: 'datetimefield',
                allowBlank: false,
                colspan: 1,
                editable: false,
                format: 'Y-m-d H:i:s',
                fieldLabel: '活动结束时间'
            }, {
                afterLabelTextTpl: required,
                name: 'rankNum',
                xtype: 'numberfield',
                allowDecimals: false,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '榜单用户数'
            },{
                xtype: 'hidden',
                name: 'id'
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
            callapi("auction/admin/activity/save", form.getValues(),
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