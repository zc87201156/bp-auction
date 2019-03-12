Ext.define("WF.view.goods.enableGoodsBtn", {
    extend: "Ext.Button",
    alias: "enableGoodsBtn",
    text : '上架',
    iconCls : 'icon-ok',//样式请参考webapp/resources/css/icon.css
    listeners : {
        click : function() {
           var main = Ext.ComponentQuery.query("goodsMain")[0];
           var grid = main.down('datagrid');
           var records = grid.getSelectionModel().getSelection();
           if (records.length == 0) {
              Ext.MessageBox.alert('提示', '请选择一条记录');
              return;
           }
           Ext.MessageBox.confirm('警告', '确定上架 ' + records[0].data.name + ' ?', function(btn) {
               if (btn == 'yes') {
                   callapi('/auction/admin/goods/enable', records[0].data, function(result) {
                       if (result.success) {
                           Ext.MessageBox.show({
                               title: '提示',
                               msg: '上架成功',
                               modal: true,
                               icon: Ext.Msg.INFO,
                               buttons: Ext.Msg.OK
                           });
                           grid.store.reload();
                       } else {
                           Ext.MessageBox.show({
                               title: '提示',
                               msg: result.message,
                               modal: true,
                               icon: Ext.Msg.ERROR,
                               buttons: Ext.Msg.OK
                           });
                       }
                   });
               }
           });
        }
    }
});