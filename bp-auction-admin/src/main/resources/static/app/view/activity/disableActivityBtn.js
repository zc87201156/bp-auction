Ext.define("WF.view.activity.disableActivityBtn", {
    extend: "Ext.Button",
    alias: "disableActivityBtn",
    text: '禁用',
    iconCls: 'icon-no',//样式请参考webapp/resources/css/icon.css
    listeners: {
        click: function () {
            var main = Ext.ComponentQuery.query("activityMain")[0];
            var grid = main.down('datagrid');
            var records = grid.getSelectionModel().getSelection();
            if (records.length == 0) {
                Ext.MessageBox.alert('提示', '请选择一条记录');
                return;
            }
            Ext.MessageBox.confirm('警告', '确定禁用这条记录吗 ?', function (btn) {
                if (btn == 'yes') {
                    callapi('auction/admin/activity/disable', records[0].data, function (result) {
                        if (result.success) {
                            Ext.MessageBox.show({
                                title: '提示',
                                msg: '禁用成功',
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