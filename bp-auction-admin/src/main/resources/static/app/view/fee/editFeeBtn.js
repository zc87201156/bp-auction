Ext.define("WF.view.fee.editFeeBtn", {
    extend: "Ext.Button",
    alias: "editFeeBtn",
    text : '编辑',
    iconCls : 'icon-edit',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
           var main = Ext.ComponentQuery.query("feeMain")[0];
           var grid = main.down('datagrid');
           var records = grid.getSelectionModel().getSelection();
           if (records.length == 0) {
               Ext.MessageBox.alert('提示', '请选择一条记录');
               return;
           }
           if (records[0].data.enable == 1) {
               Ext.MessageBox.alert('提示', '当前手续费已启用，不可编辑!');
               return;
           }
           var win = Ext.create("WF.view.fee.editFee", {doRefresh: grid.store});
           win.down('dataform').setValues(records[0].data);
           win.show();
        }
    }
});