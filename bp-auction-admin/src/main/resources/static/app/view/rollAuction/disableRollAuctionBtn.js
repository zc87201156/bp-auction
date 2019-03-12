Ext.define("WF.view.rollAuction.disableRollAuctionBtn", {
    extend: "Ext.Button",
    alias: "disableRollAuctionBtn",
    text: '禁用滚拍',
    iconCls: 'icon-no',//样式请参考webapp/resources/css/icon.css
    listeners: {
        click: function () {
            var main = Ext.ComponentQuery.query("rollAuctionMain")[0];
            var grid = main.down('datagrid');
            var records = grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                Ext.MessageBox.alert('提示', '请选择一条记录');
                return;
            }
            Ext.MessageBox.confirm('警告', '确定禁用滚拍 ' + records[0].data.id + ' ?', function (btn) {
                if (btn == 'yes') {
                    callapi('/auction/admin/rollAuction/disable', records[0].data, function (result) {
                        if (result.success) {
                            Ext.MessageBox.show({
                                title: '提示',
                                msg: '禁用滚拍成功',
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