Ext.define('WF.view.activityProbability.editActivityProbability', {
    extend: 'Ext.window.Window',
    alias: 'editActivityProbability',
    title: '编辑',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var activityStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/activity/getAll.do',
            fields: ['id','name']
        });
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 2,
            items: [{
                afterLabelTextTpl: required,
                name: 'activityId',
                xtype: 'combo',
                allowBlank: false,
                colspan: 1,
                editable: false,
                store: activityStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '活动'
            } ,{
                afterLabelTextTpl: required,
                name: 'num',
                xtype: 'numberfield',
                allowDecimals: false,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '数量'
            },{
                afterLabelTextTpl: required,
                name: 'probability',
                xtype: 'numberfield',
                allowDecimals: true,
                allowBlank: false,
                decimalPrecision: 3,
                colspan: 1,
                fieldLabel: '概率'
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
            callapi("auction/admin/activityProbability/save", form.getValues(),
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