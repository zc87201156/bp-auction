Ext.define('JDD.basedata.system.operationLog.editBasedataSystemOperationLog', {
    extend: 'Ext.window.Window',
    alias: 'editBasedataSystemOperationLog',
    title: '新增彩种',
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
                readOnly: true,
                name: 'operator',
                colspan: 2,
                fieldLabel: 'operator'
            }, {
                readOnly: true,
                name: 'ip',
                colspan: 2,
                fieldLabel: 'ip'
            }, {
                readOnly: true,
                name: 'method',
                colspan: 2,
                fieldLabel: '请求方法'
            }, {
                readOnly: true,
                xtype: 'textarea',
                name: 'requestUri',
                colspan: 2,
                height:60,
                fieldLabel: '请求地址'
            }, {
                readOnly: true,
                xtype: 'textarea',
                name: 'parameter',
                colspan: 2,
                height:200,
                fieldLabel: 'parameter'
            }, {
                readOnly: true,
                xtype: 'textarea',
                name: 'payload',
                colspan: 2,
                height:200,
                fieldLabel: 'payload'
            }, {
                readOnly: true,
                name: 'createTime',
                colspan: 2,
                fieldLabel: '创建时间'
            }]
        });
    },
    buttons: [{
        text: '取消',
        iconCls: "icon-no",
        handler: function () {
            this.up('window').close();
        }
    }]
});