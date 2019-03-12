Ext.define("WF.view.config.delConfigBtn", {
    extend: "Ext.Button",
    alias: "delConfigBtn",
    text : '删除',
    iconCls : 'icon-remove',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
           var main = Ext.ComponentQuery.query("configMain")[0];
           var grid = mainwn('datagrid');
           var records = grid.getSelectionModel().getSelection();
           if (records.length == 0) {
              Ext.MessageBox.alert('提示', '请选择一条记录');
              return;
           }
           Ext.MessageBox.confirm('警告', '确定删除 ' + records[0].data.name + ' ?', function(btn) {
               if (btn == 'yes') {
                   callapi('/auction/admin/config/delete', records[0].data, function(result) {
                       if (result.success) {
                           Ext.MessageBox.show({
                               title: '提示',
                               msg: '删除成功',
                               modal: true,
                               icon: Ext.Msg.INFO,
                               buttons: Ext.Msg.OK
                           });
                           grid.store.reload();
                       }
                   });
               }
           });
        }
    }
});