Ext.define("WF.view.banner.addBannerBtn", {
    extend: "Ext.Button",
    alias: "addBannerBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("bannerMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.banner.addBanner", {doRefresh: doRefresh});
            win.show();
        }
    }
});