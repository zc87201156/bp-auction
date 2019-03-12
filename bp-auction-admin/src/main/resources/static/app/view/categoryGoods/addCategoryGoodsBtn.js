Ext.define("WF.view.categoryGoods.addCategoryGoodsBtn", {
    extend: "Ext.Button",
    alias: "addCategoryGoodsBtn",
    text : '新增',
    iconCls : 'icon-add',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
            var main = Ext.ComponentQuery.query("categoryGoodsMain")[0];
            var doRefresh = main.down('datagrid').store;
            var win = Ext.create("WF.view.categoryGoods.addCategoryGoods", {doRefresh: doRefresh});
            win.show();
        }
    }
});