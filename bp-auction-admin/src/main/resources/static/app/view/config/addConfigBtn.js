Ext.define("WF.view.config.addConfigBtn", {
    extend: "Ext.Button",
    alias: "addConfigBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("configMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.config.addConfig", {doRefresh: doRefresh});
            win.show();
        }
    }
});