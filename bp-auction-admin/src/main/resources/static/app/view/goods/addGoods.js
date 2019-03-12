Ext.define('WF.view.goods.addGoods', {
  extend: 'Ext.window.Window',
  alias: 'addGoods',
  title: '新增',
  modal: true,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  initComponent: function () {
    this.callParent(arguments);
    var me = this;
    var auctionFeeStore = Ext.create('DCIS.Store', {
        autoLoad: true,
        url: 'auction/admin/fee/getAll',
        fields: ['id','name']
    });
    me.add({
      xtype: 'dataform',
      baseCls: 'x-plain',
      border: true,
      columns: 2,
      items: [{
          afterLabelTextTpl: required,
          name: 'name',
          allowBlank: false,
          colspan: 2,
          maxLength: 255,
          fieldLabel: '商品名称'
      },{
          afterLabelTextTpl: required,
          name: 'no',
          allowBlank: false,
          colspan: 2,
          maxLength: 50,
          fieldLabel: '商品编号'
      },{
          afterLabelTextTpl: required,
          name: 'defaultImage',
          xtype: 'textarea',
          readOnly: true,
          allowBlank: false,
          colspan: 1,
          maxLength: 500,
          fieldLabel: '默认图片'
      },{
          xtype: 'button',
          text: '上传图片',
          colspan: 1,
          handler: function () {
              var me = this;
              uploadPicture('/auction/admin/common/data/uploadImage', function (re) {
                  var dataform = me.up('dataform');
                  dataform.down("[name='defaultImage']").setValue(re.data.data);
              })
          }
      },{
          name: 'images',
          xtype: 'textarea',
          colspan: 2,
          maxLength: 2000,
          fieldLabel: '图片列表(多个图片逗号隔开)'
      },{
          afterLabelTextTpl: required,
          name: 'marketPrice',
          xtype: 'numberfield',
          minValue: 0,
          allowDecimals: true,
          decimalPrecision: 2,
          allowBlank: false,
          colspan: 2,
          fieldLabel: '市场价'
      },{
          afterLabelTextTpl: required,
          name: 'startPrice',
          xtype: 'numberfield',
          minValue: 0,
          allowDecimals: true,
          decimalPrecision: 2,
          allowBlank: false,
          colspan: 2,
          fieldLabel: '起拍价'
      },{
          afterLabelTextTpl: required,
          name: 'auctionFeeId',
          xtype: 'combo',
          allowBlank: false,
          colspan: 2,
          editable: false,
          store: auctionFeeStore,
          displayField: 'name',
          valueField: 'id',
          queryMode: 'local',
          fieldLabel: '手续费id'
      },{
          afterLabelTextTpl: required,
          name: 'platProductId',
          xtype: 'numberfield',
          minValue: 0,
          allowDecimals: false,
          allowBlank: false,
          colspan: 2,
          fieldLabel: '平台商品id'
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
      callapi('/auction/admin/goods/save', form.getValues(),
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