Ext.define('JDD.basedata.lottery.issueagainst.jclqPlayControl', {
  extend: 'Ext.window.Window',
  alias: 'jclqPlayControl',
  title: '玩法控制',
  modal: true,
  width: 800,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  initComponent: function () {
    this.callParent(arguments);
    var me = this;
    me.setTitle(me.headName + '玩法控制');
    me.add({
      xtype: 'dataform',
      baseCls: 'x-plain',
      border: true,
      columns: 2,
      items: [{
        xtype: 'fieldset',
        collapsible: false,
        width: 760,
        colspan: 2,
        columns: 2,
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: "checkbox",
          name: "status",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "<span style='color:red;font-weight:bold;'>整场</span>",
          inputValue: 0,
          uncheckedValue: 1,
          checked: false,
          handler: function (field, checked) {
            var stopSaleReason = me.down('[name="stopSaleReason"]');
            var sfCheckgroup = me.down('checkboxgroup[name="sf"]');
            var rfCheckgroup = me.down('checkboxgroup[name="rf"]');
            var dxfCheckgroup = me.down('checkboxgroup[name="dxf"]');
            var sfcCheckgroup = me.down('checkboxgroup[name="sfc"]');
            if (checked) {
              stopSaleReason.allowBlank = false;
              Ext.each(sfCheckgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
              Ext.each(rfCheckgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
              Ext.each(dxfCheckgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
              Ext.each(sfcCheckgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              stopSaleReason.allowBlank = true;
              Ext.each(sfCheckgroup.items.items, function (item) {
                item.setValue(false);
              }, this);
              Ext.each(rfCheckgroup.items.items, function (item) {
                item.setValue(false);
              }, this);
              Ext.each(dxfCheckgroup.items.items, function (item) {
                item.setValue(false);
              }, this);
              Ext.each(sfcCheckgroup.items.items, function (item) {
                item.setValue(false);
              }, this);
            }
          }
        }, {
          xtype: "textarea",
          name: "stopSaleReason",
          colspan: 1,
          width: 400
        }
        ]
      }, {
        xtype: 'fieldset',
        collapsible: false,
        width: 760,
        colspan: 2,
        columns: 2,
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: "checkbox",
          name: "sfStatus",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "胜负",
          inputValue: 0,
          uncheckedValue: 1,
          checked: false,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="sf"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 2) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'sf',
          colspan: 1,
          width: 400,
          columns: 3,
          items: [
            {
              boxLabel: '客胜', name: 'sf_ks', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.sfPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '主胜', name: 'sf_zs', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.sfPlayCheck(box, checked, me);
            }
            }
          ]
        }]
      }, {
        xtype: 'fieldset',
        collapsible: false,
        width: 760,
        colspan: 2,
        columns: 2,
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: "checkbox",
          name: "rfsfStatus",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "让分",
          inputValue: 0,
          uncheckedValue: 1,
          checked: false,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="rf"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 2) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'rf',
          colspan: 1,
          columns: 3,
          width: 400,
          items: [
            {
              boxLabel: '让客胜', name: 'rf_rks', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.rfPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '让主胜', name: 'rf_rzs', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.rfPlayCheck(box, checked, me);
            }
            }
          ]
        }]
      }, {
        xtype: 'fieldset',
        collapsible: false,
        width: 760,
        colspan: 2,
        columns: 2,
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: "checkbox",
          name: "dxfStatus",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "大小分",
          inputValue: 0,
          uncheckedValue: 1,
          checked: false,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="dxf"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 2) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'dxf',
          colspan: 1,
          columns: 3,
          width: 400,
          items: [
            {
              boxLabel: '大于', name: 'dxf_dy', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.dxfPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '小于', name: 'dxf_xy', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.dxfPlayCheck(box, checked, me);
            }
            }
          ]
        }]
      }, {
        xtype: 'fieldset',
        collapsible: false,
        width: 760,
        colspan: 2,
        columns: 2,
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: "checkbox",
          name: "sfcStatus",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "胜分差",
          inputValue: 0,
          uncheckedValue: 1,
          checked: false,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="sfc"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 12) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'sfc',
          colspan: 1,
          columns: 3,
          width: 400,
          items: [
            {
              boxLabel: '客胜1-5',
              name: 'sfc_ks_1_5',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '客胜6-10',
              name: 'sfc_ks_6_10',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '客胜11-15',
              name: 'sfc_ks_11_15',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '客胜16-20',
              name: 'sfc_ks_16_20',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '客胜21-25',
              name: 'sfc_ks_21_25',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '客胜26+', name: 'sfc_ks_26', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '主胜1-5',
              name: 'sfc_zs_1_5',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '主胜6-10',
              name: 'sfc_zs_6_10',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '主胜11-15',
              name: 'sfc_zs_11_15',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '主胜16-20',
              name: 'sfc_zs_16_20',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '主胜21-25',
              name: 'sfc_zs_21_25',
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            }, {
              boxLabel: '主胜26+', name: 'sfc_zs_26', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
                me.sfcPlayCheck(box, checked, me);
              }
            },
          ]
        }]
      }, {
        xtype: 'hidden',
        name: 'issueName',
        value: me.issueName
      }, {
        xtype: 'hidden',
        name: 'issueMatchName',
        value: me.issueMatchName
      }]
    });

    var playState = me.playState;
    me.down('[name="issueMatchName"]').setValue(playState.issueMatchName);
    me.down('[name="stopSaleReason"]').setValue(playState.stopSaleReason);
    me.down('checkbox[name="status"]').setValue(playState.status);
    if (playState.status == 0) {
      me.down('checkbox[name="sfStatus"]').setValue(playState.sfStatus);
      if (playState.sfStatus == 0) {
        me.down('checkboxgroup[name="sf"]').setValue({sf_ks: playState.sf_ks, sf_zs: playState.sf_zs});
      }
      me.down('checkbox[name="rfsfStatus"]').setValue(playState.rfsfStatus);
      if (playState.rfsfStatus == 0) {
        me.down('checkboxgroup[name="rf"]').setValue({rf_rks: playState.rf_rks, rf_rzs: playState.rf_rzs});
      }
      me.down('checkbox[name="dxfStatus"]').setValue(playState.dxfStatus);
      if (playState.dxfStatus == 0) {
        me.down('checkboxgroup[name="dxf"]').setValue({dxf_dy: playState.dxf_dy, dxf_xy: playState.dxf_xy});
      }
      me.down('checkbox[name="sfcStatus"]').setValue(playState.sfcStatus);
      if (playState.sfcStatus == 0) {
        me.down('checkboxgroup[name="sfc"]').setValue({
          sfc_ks_1_5: playState.sfc_ks_1_5,
          sfc_ks_6_10: playState.sfc_ks_6_10,
          sfc_ks_11_15: playState.sfc_ks_11_15,
          sfc_ks_16_20: playState.sfc_ks_16_20,
          sfc_ks_21_25: playState.sfc_ks_21_25,
          sfc_ks_26: playState.sfc_ks_26,
          sfc_zs_1_5: playState.sfc_zs_1_5,
          sfc_zs_6_10: playState.sfc_zs_6_10,
          sfc_zs_11_15: playState.sfc_zs_11_15,
          sfc_zs_16_20: playState.sfc_zs_16_20,
          sfc_zs_21_25: playState.sfc_zs_21_25,
          sfc_zs_26: playState.sfc_zs_26
        });
      }

    }

  },
  sfPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="sf"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 2) {
        me.down('checkbox[name="sfStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="sfStatus"]');
      checkbox.setValue(0);
    }
  },
  rfPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="rf"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 2) {
        me.down('checkbox[name="rfsfStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="rfsfStatus"]');
      checkbox.setValue(0);
    }
  },
  dxfPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="dxf"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 2) {
        me.down('checkbox[name="dxfStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="dxfStatus"]');
      checkbox.setValue(0);
    }
  },
  sfcPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="sfc"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 12) {
        me.down('checkbox[name="sfcStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="sfcStatus"]');
      checkbox.setValue(0);
    }
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
      callapi("basedata/private/basedataIssueAgainstController/updateJCLQPlayTypeControl.do", form.getValues(),
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
                msg: result.data,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                modal: true
              });
            }
          });
    }
  }, {
    text: '取消',
    iconCls: "icon-cancel",
    handler: function () {
      var currentWindow = this.up('window');
      currentWindow.close();
    }
  }]
});