Ext.define("WF.view.activity.addActivityBtn", {
    extend: "Ext.Button",
    alias: "addActivityBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("activityMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.activity.addActivity", {doRefresh: doRefresh});
            win.show();
        }
    }
});