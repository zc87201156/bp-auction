Ext.define('JDD.basedata.redisManagerlMain', {
  extend: 'Ext.panel.Panel',
  title: 'RedisKey',
  xtype: 'redisManagerlMain',
  closable: true,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  initComponent: function () {
    this.callParent(arguments);
    var me = this;


    var typeMethod = Ext.create('DCIS.Store', {
      autoLoad: true,
      url: 'basedata/private/redisManagerController/getTypeMethod.do',
      fields: ['key', 'name']
    });

    me.add({
      xtype: 'dataform',
      baseCls: 'x-plain',
      columns: 2,
      items: [{
        xtype: 'combobox',
        name: 'redisName',
        colspan: 2,
        fieldLabel: 'Redis实例',
        editable:false,
        value:0,
        store: [[0,'shardedRedisManager'],[1,'netRedisManager']]
      }, {
        name: 'key',
        fieldLabel: 'KEY',
        afterLabelTextTpl: required,
        allowBlank: false,
        colspan: 2,
        listeners: {
          blur: function (sender, e, obj) {
            //失去焦点事件
            var val = sender.getValue();
            var redisName = me.down("dataform").down("combobox[name='redisName']").getValue();
            // alert(val);
            callapi('basedata/private/redisManagerController/getType.do', {
              key: val, redisName:redisName
            }, function (result) {
              if (result.success) {
                var type = result.data.type;
                var show = result.data.show;
                me.down("[name='type']").setValue(show);
                if (type != null && type != "none") {
                  typeMethod.proxy.extraParams = Ext.apply(typeMethod.proxy.extraParams, {"type": type});
                  typeMethod.load();
                }
              } else {
                me.down("[name='limitDetailTest']").setValue("");
              }
            }, null, null, false);


          },
          focus: function () {
            //获取焦点
          }
        }
      }, {
        xtype: 'combobox',
        name: 'method',
        fieldLabel: '方法',
        store: typeMethod,
        displayField: 'key',
        valueField: "name",
        colspan: 1
      }, {
        name: 'type',
        fieldLabel: '类型',
        xtype: 'displayfield',
        colspan: 1
      }, {
        name: 'param1',
        fieldLabel: 'param1',
        colspan: 2
      }, {
        name: 'param2',
        fieldLabel: 'param2',
        colspan: 2
      }, {
        xtype: 'button',
        text: '执行',
        // iconCls: 'icon-delete',
        colspan: 1,
        width: 100,
        margin: "0 0 0 65",
        listeners: {
          'click': {
            fn: this.submit,
            scope: this
          }
        }
      }, {
        xtype: 'button',
        text: '重置',
        // iconCls: 'icon-delete',
        colspan: 1,
        width: 100,
        margin: "0 0 0 65",
        listeners: {
          'click': {
            fn: this.searchCancel,
            scope: this
          }
        }
      }]
    });
  },

  submit: function () {
    var dataform = this.down('dataform');
    var form = dataform.getForm();
    if (!form.isValid()) {
      return;
    }

    Ext.Msg.confirm("确定", "确定执行该操作！", function (button) {
      if (button == "yes") {
        callapi('basedata/private/redisManagerController/execute.do', form.getValues(), function (ret) {
          if (ret.success) {
            try {
              var data = eval('(' + ret.data + ')');
            }
            catch (e) {
              ret.data = '{msg: "' + ret.data + '"}';
            }

            var tmp = syntaxHighlight(format(ret.data, false));
            var result = dataform.down('panel[name="result"]');
            if (result) {
              dataform.remove(result);
            }
            dataform.add({
              xtype: 'panel',
              region: 'center',
              name: 'result',
              colspan:2,
              height: 500,
              autoScroll: true,
              html: '<pre>' + tmp + '</pre>'
            });
            // alert(ret.data);
            dataform.show();
          } else {
            Ext.Msg.show({
              title: '错误',
              msg: ret.data,
              buttons: Ext.Msg.OK,
              icon: Ext.MessageBox.ERROR,
              modal: true
            });
          }
        })
      }
    });
  },

  searchCancel: function () {
    var dataform = this.down('dataform');
    dataform.reset();
    var result = dataform.down('panel[name="result"]');
    if (result) {
      dataform.remove(result);
    }
  }
});