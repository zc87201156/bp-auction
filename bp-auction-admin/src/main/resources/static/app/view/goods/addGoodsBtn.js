Ext.define("WF.view.goods.addGoodsBtn", {
    extend: "Ext.Button",
    alias: "addGoodsBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("goodsMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.goods.addGoods", {doRefresh: doRefresh});
            win.show();
        }
    }
});