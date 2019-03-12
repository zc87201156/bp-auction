Ext.define("WF.view.categoryGoods.editCategoryGoodsBtn", {
    extend: "Ext.Button",
    alias: "editCategoryGoodsBtn",
    text: '编辑',
    iconCls: 'icon-edit',//样式请参考webapp/resources/css/icon.css
    listeners: {
        click: function () {
            var main = Ext.ComponentQuery.query("categoryGoodsMain")[0];
            var grid = main.down('datagrid');
            var records = grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                Ext.MessageBox.alert('提示', '请选择一条记录');
                return;
            }
            if (records[0].data.enable == 1) {
                Ext.MessageBox.alert('提示', '当前类目信息已启用，不可编辑!');
                return;
            }
            var win = Ext.create("WF.view.categoryGoods.editCategoryGoods", {doRefresh: grid.store});
            win.down('dataform').setValues(records[0].data);
            win.show();
        }
    }
});