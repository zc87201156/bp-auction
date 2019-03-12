Ext.define('WF.view.fee.addFee', {
  extend: 'Ext.window.Window',
  alias: 'addFee',
  title: '新增',
  modal: true,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  initComponent: function () {
    this.callParent(arguments);
    var me = this;
    me.add({
      xtype: 'dataform',
      baseCls: 'x-plain',
      border: true,
      columns: 2,
      items: [{
          afterLabelTextTpl: required,
          name: 'fee',
          xtype: 'numberfield',
          minValue: 1,
          allowDecimals: false,
          allowBlank: false,
          colspan: 2,
          fieldLabel: '手续费'
      },{
          afterLabelTextTpl: required,
          name: 'price',
          xtype: 'numberfield',
          minValue: 0.01,
          allowDecimals: true,
          decimalPrecision: 2,
          allowBlank: false,
          colspan: 2,
          fieldLabel: '加价幅度(元)'
      }]
    });
  },
  buttons: [{
    text: '保存',
    iconCls: "icon-ok",
    handler: function () {
      var currentWindow = this.up('window');
      var form = currentWindow.down('dataform').getForm();
      if (!form.isValid()) {
        return;
      }
      var doRefresh = currentWindow.doRefresh;
      callapi('/auction/admin/fee/save', form.getValues(),
          function (result) {
            if (result.success) {
              Ext.MessageBox.show({
                title: "提示",
                msg: "保存成功",
                modal: true,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
              });
              doRefresh.reload();
              currentWindow.close();
            }
            else {
              Ext.Msg.show({
                title: '错误',
                msg: result.message,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                modal: true
              });
            }
          });
    }
  }]
});