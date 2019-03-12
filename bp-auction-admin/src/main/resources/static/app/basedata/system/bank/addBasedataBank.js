Ext.define('JDD.basedata.system.bank.addBasedataBank', {
  extend: 'Ext.window.Window',
  alias: 'addBasedataBank',
  title: '新增银行',
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
      columns: 1,
      items: [{
        name: 'bankName',
        afterLabelTextTpl: required,
        allowBlank: false,
        colspan: 1,
        fieldLabel: '名称'
      }, {
        name: 'bankCode',
        afterLabelTextTpl: required,
        allowBlank: false,
        colspan: 1,
        fieldLabel: '编码'
      }, {
        xtype: 'numberfield',
        allowDecimals: false,
        decimalPrecision: 0,
        name: 'order',
        afterLabelTextTpl: required,
        allowBlank: false,
        colspan: 1,
        fieldLabel: '排序'
      }, {
        xtype: 'radiogroup',
        fieldLabel: '状态:',
        width: 200,
        colspan: 1,
        items: [
          {boxLabel: '启用', name: 'status', inputValue: '1', checked: true},
          {boxLabel: '禁用', name: 'status', inputValue: '0'}
        ]
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
      var store = currentWindow.store;
      callapi("/basedata/private/basedataBankController/saveBasedataBank.do", form.getValues(),
          function (result) {
            if (result.success) {
              Ext.MessageBox.show({
                title: "提示",
                msg: "保存成功",
                modal: true,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
              });
              store.load();
              currentWindow.close();
            }
            else {
              Ext.Msg.show({
                title: '错误',
                msg: '保存失败!',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                modal: true
              });
            }
          });
    }
  }]
});