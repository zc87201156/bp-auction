Ext.define("WF.view.activityProbability.addActivityProbabilityBtn", {
    extend: "Ext.Button",
    alias: "addActivityProbabilityBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("activityProbabilityMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.activityProbability.addActivityProbability", {doRefresh: doRefresh});
            win.show();
        }
    }
});