Ext.define("WF.view.rollAuction.addRollAuctionBtn", {
    extend: "Ext.Button",
    alias: "addRollAuctionBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("rollAuctionMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.rollAuction.addRollAuction", {doRefresh: doRefresh});
            win.show();
        }
    }
});