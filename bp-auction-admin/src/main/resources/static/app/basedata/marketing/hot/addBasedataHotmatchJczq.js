Ext.define('JDD.basedata.marketing.hot.addBasedataHotmatchJczq', {
    extend: 'Ext.window.Window',
    alias: 'addBasedataHotmatchJczq',
    title: '新增热门赛事',
    modal: true,
    width: 400,
    height:500,
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
                xtype: "searchfield",
                name: "issueMatchName",
                store: 'jczqStore',
                displayField: 'issueMatchName',
                valueField: 'issueMatchName',
                pageSize: 10,
                fieldLabel: '竞彩足球期次号',
                emptyText: "主队名称:客队名称",
                afterLabelTextTpl: required,
                colspan: 1,
                allowBlank: false,
                labelWidth: 100,
                width:300
            },{
                xtype: 'radiogroup',
                fieldLabel: '是否热门状态:',
                labelWidth: 100,
                width:220,
                items: [
                    {boxLabel: '热门', name: 'hotStatus', inputValue: '1',checked: true},
                    {boxLabel: '否', name: 'hotStatus', inputValue: '0'}
                ]
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
            callapi("/basedata/private/basedataHotmatchJczqController/saveBasedataHotmatchJczq.do", form.getValues(),
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