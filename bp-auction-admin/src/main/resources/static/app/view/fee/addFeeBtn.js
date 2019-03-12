Ext.define("WF.view.fee.addFeeBtn", {
    extend: "Ext.Button",
    alias: "addFeeBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("feeMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.fee.addFee", {doRefresh: doRefresh});
            win.show();
        }
    }
});