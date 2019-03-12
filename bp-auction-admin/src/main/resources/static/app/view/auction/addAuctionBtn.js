Ext.define("WF.view.auction.addAuctionBtn", {
    extend: "Ext.Button",
    alias: "addAuctionBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("auctionMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.auction.addAuction", {doRefresh: doRefresh});
            win.show();
        }
    }
});