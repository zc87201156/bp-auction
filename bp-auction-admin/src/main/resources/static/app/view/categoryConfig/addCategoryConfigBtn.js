Ext.define("WF.view.categoryConfig.addCategoryConfigBtn", {
    extend: "Ext.Button",
    alias: "addCategoryConfigBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("categoryConfigMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.categoryConfig.addCategoryConfig", {doRefresh: doRefresh});
            win.show();
        }
    }
});