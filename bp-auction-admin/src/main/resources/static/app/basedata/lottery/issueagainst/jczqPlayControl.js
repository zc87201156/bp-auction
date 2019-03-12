Ext.define('JDD.basedata.lottery.issueagainst.jczqPlayControl', {
  extend: 'Ext.window.Window',
  alias: 'jczqPlayControl',
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
        items: [
          {
            xtype: "checkbox",
            name: "status", //场次状态
            colspan: 1,
            width: 100,
            margin: '0 0 0 100',
            boxLabel: "<span style='color:red;font-weight:bold;'>整场</span>",
            inputValue: 0,
            uncheckedValue: 1,
            checked: false,
            handler: function (field, checked) {
              var stopSaleReason = me.down('[name="stopSaleReason"]');
              var spfCheckgroup = me.down('checkboxgroup[name="spf"]');
              var rqCheckgroup = me.down('checkboxgroup[name="rq"]');
              var zjqCheckgroup = me.down('checkboxgroup[name="zjq"]');
              var bqcCheckgroup = me.down('checkboxgroup[name="bqc"]');
              var bfCheckgroup = me.down('checkboxgroup[name="bf"]');
              if (checked) {
                stopSaleReason.allowBlank = false;
                Ext.each(spfCheckgroup.items.items, function (item) {
                  item.setValue(true);
                }, this);
                Ext.each(rqCheckgroup.items.items, function (item) {
                  item.setValue(true);
                }, this);
                Ext.each(zjqCheckgroup.items.items, function (item) {
                  item.setValue(true);
                }, this);
                Ext.each(bqcCheckgroup.items.items, function (item) {
                  item.setValue(true);
                }, this);
                Ext.each(bfCheckgroup.items.items, function (item) {
                  item.setValue(true);
                }, this);

              } else {
                stopSaleReason.allowBlank = true;
                Ext.each(spfCheckgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
                Ext.each(rqCheckgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
                Ext.each(zjqCheckgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
                Ext.each(bqcCheckgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
                Ext.each(bfCheckgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }, {
            xtype: "textarea",
            width: 400,
            name: "stopSaleReason",
            colspan: 1
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
          name: "spfStatus", //场次 胜平负 状态
          colspan: 1,
          margin: '0 0 0 100',
          boxLabel: "胜平负",
          width: 100,
          inputValue: 0,
          uncheckedValue: 1,
          checked: false,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="spf"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 3) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'spf',
          colspan: 1,
          columns: 3,
          width: 400,
          items: [
            {
              boxLabel: '主胜', name: 'spf_zs', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.spfPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '平', name: 'spf_p', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.spfPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '客胜', name: 'spf_ks', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.spfPlayCheck(box, checked, me);
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
          name: "rqspfStatus",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "让球",
          inputValue: 0,
          uncheckedValue: 1,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="rq"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 3) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'rq',
          width: 400,
          colspan: 1,
          columns: 3,
          items: [
            {
              boxLabel: '主胜', name: 'rq_zs', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.rqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '平', name: 'rq_p', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.rqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '客胜', name: 'rq_ks', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.rqPlayCheck(box, checked, me);
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
          name: "jqsStatus",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "总进球",
          inputValue: 0,
          uncheckedValue: 1,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="zjq"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 8) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'zjq',
          width: 400,
          colspan: 1,
          columns: 3,
          items: [
            {
              boxLabel: '0球', name: 'zjq_0', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.zjqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '1球', name: 'zjq_1', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.zjqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '2球', name: 'zjq_2', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.zjqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '3球', name: 'zjq_3', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.zjqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '4球', name: 'zjq_4', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.zjqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '5球', name: 'zjq_5', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.zjqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '6球', name: 'zjq_6', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.zjqPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '7+球', name: 'zjq_7', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.zjqPlayCheck(box, checked, me);
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
          name: "bqcStatus",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "半全场",
          inputValue: 0,
          uncheckedValue: 1,
          checked: false,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="bqc"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 9) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'bqc',
          width: 400,
          colspan: 1,
          columns: 3,
          items: [
            {
              boxLabel: '胜胜', name: 'bqc_ss', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '胜平', name: 'bqc_sp', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '胜负', name: 'bqc_sf', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '平胜', name: 'bqc_ps', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '平平', name: 'bqc_pp', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '平负', name: 'bqc_pf', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '负胜', name: 'bqc_fs', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '负平', name: 'bqc_fp', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
            }
            },
            {
              boxLabel: '负负', name: 'bqc_ff', inputValue: 0, uncheckedValue: 1, handler: function (box, checked) {
              me.bqcPlayCheck(box, checked, me);
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
          name: "cbfStatus",
          colspan: 1,
          width: 100,
          margin: '0 0 0 100',
          boxLabel: "比分",
          inputValue: 0,
          uncheckedValue: 1,
          checked: false,
          handler: function (field, checked) {
            var checkgroup = me.down('checkboxgroup[name="bf"]');
            if (checked) {
              Ext.each(checkgroup.items.items, function (item) {
                item.setValue(true);
              }, this);
            } else {
              if (checkgroup.getChecked().length == 31) {
                Ext.each(checkgroup.items.items, function (item) {
                  item.setValue(false);
                }, this);
              }
            }
          }
        }, {
          xtype: 'checkboxgroup',
          name: 'bf',
          colspan: 1,
          columns: 7,
          width: 400,
          layout: {
            type: 'table',
            columns: 7
          },
          items: [
            {
              boxLabel: '1:0',
              name: 'bf_10',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '2:0',
              name: 'bf_20',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '2:1',
              name: 'bf_21',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '3:0',
              name: 'bf_30',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '3:1',
              name: 'bf_31',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '3:2',
              name: 'bf_32',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '4:0',
              name: 'bf_40',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '4:1',
              name: 'bf_41',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '4:2',
              name: 'bf_42',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '5:0',
              name: 'bf_50',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '5:1',
              name: 'bf_51',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '5:2',
              name: 'bf_52',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '胜其他',
              name: 'bf_sqt',
              width: 60,
              colspan: 2,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '0:0',
              name: 'bf_00',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '1:1',
              name: 'bf_11',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '2:2',
              name: 'bf_22',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '3:3',
              name: 'bf_33',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '平其他',
              name: 'bf_pqt',
              width: 60,
              colspan: 3,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '0:1',
              name: 'bf_01',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '0:2',
              name: 'bf_02',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '1:2',
              name: 'bf_12',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '0:3',
              name: 'bf_03',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '1:3',
              name: 'bf_13',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '2:3',
              name: 'bf_23',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '0:4',
              name: 'bf_04',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '1:4',
              name: 'bf_14',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '2:4',
              name: 'bf_24',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '0:5',
              name: 'bf_05',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '1:5',
              name: 'bf_15',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '2:5',
              name: 'bf_25',
              width: 60,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            },
            {
              boxLabel: '负其他',
              name: 'bf_fqt',
              width: 60,
              colspan: 2,
              inputValue: 0,
              uncheckedValue: 1,
              handler: function (box, checked) {
                me.bfPlayCheck(box, checked, me);
              }
            }
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
      me.down('checkbox[name="spfStatus"]').setValue(playState.spfStatus);
      if (playState.spfStatus == 0) {
        me.down('checkboxgroup[name="spf"]').setValue({
          spf_zs: playState.spf_zs,
          spf_p: playState.spf_p,
          spf_ks: playState.spf_ks
        });
      }
      me.down('checkbox[name="rqspfStatus"]').setValue(playState.rqspfStatus);
      if (playState.rqspfStatus == 0) {
        me.down('checkboxgroup[name="rq"]').setValue({
          rq_zs: playState.rq_zs,
          rq_p: playState.rq_p,
          rq_ks: playState.rq_ks
        });
      }
      me.down('checkbox[name="jqsStatus"]').setValue(playState.jqsStatus);
      if (playState.jqsStatus == 0) {
        me.down('checkboxgroup[name="zjq"]').setValue({
          zjq_0: playState.zjq_0,
          zjq_1: playState.zjq_1,
          zjq_2: playState.zjq_2,
          zjq_3: playState.zjq_3,
          zjq_4: playState.zjq_4,
          zjq_5: playState.zjq_5,
          zjq_6: playState.zjq_6,
          zjq_7: playState.zjq_7
        });
      }
      me.down('checkbox[name="bqcStatus"]').setValue(playState.bqcStatus);
      if (playState.bqcStatus == 0) {
        me.down('checkboxgroup[name="bqc"]').setValue({
          bqc_ss: playState.bqc_ss,
          bqc_sp: playState.bqc_sp,
          bqc_sf: playState.bqc_sf,
          bqc_ps: playState.bqc_ps,
          bqc_pp: playState.bqc_pp,
          bqc_pf: playState.bqc_pf,
          bqc_fs: playState.bqc_fs,
          bqc_fp: playState.bqc_fp,
          bqc_ff: playState.bqc_ff
        });
      }
      me.down('checkbox[name="cbfStatus"]').setValue(playState.cbfStatus);
      if (playState.cbfStatus == 0) {
        me.down('checkboxgroup[name="bf"]').setValue({
          bf_10: playState.bf_10,
          bf_20: playState.bf_20,
          bf_21: playState.bf_21,
          bf_30: playState.bf_30,
          bf_31: playState.bf_31,
          bf_32: playState.bf_32,
          bf_40: playState.bf_40,
          bf_41: playState.bf_41,
          bf_42: playState.bf_42,
          bf_50: playState.bf_50,
          bf_51: playState.bf_51,
          bf_52: playState.bf_52,
          bf_sqt: playState.bf_sqt,
          bf_00: playState.bf_00,
          bf_11: playState.bf_11,
          bf_22: playState.bf_22,
          bf_33: playState.bf_33,
          bf_pqt: playState.bf_pqt,
          bf_01: playState.bf_01,
          bf_02: playState.bf_02,
          bf_12: playState.bf_12,
          bf_03: playState.bf_03,
          bf_13: playState.bf_13,
          bf_23: playState.bf_23,
          bf_04: playState.bf_04,
          bf_14: playState.bf_14,
          bf_24: playState.bf_24,
          bf_05: playState.bf_05,
          bf_15: playState.bf_15,
          bf_25: playState.bf_25,
          bf_fqt: playState.bf_fqt
        });
      }
    }

  },
  spfPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="spf"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 3) {
        me.down('checkbox[name="spfStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="spfStatus"]');
      checkbox.setValue(0);
    }
  },
  rqPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="rq"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 3) {
        me.down('checkbox[name="rqspfStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="rqspfStatus"]');
      checkbox.setValue(0);
    }
  },
  zjqPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="zjq"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 8) {
        me.down('checkbox[name="jqsStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="jqsStatus"]');
      checkbox.setValue(0);
    }
  },
  bqcPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="bqc"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 9) {
        me.down('checkbox[name="bqcStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="bqcStatus"]');
      checkbox.setValue(0);
    }
  },
  bfPlayCheck: function (box, checked, me) {
    if (checked) {
      var checkgroup = me.down('checkboxgroup[name="bf"]');
      var checked = checkgroup.getChecked();
      if (checked.length == 31) {
        me.down('checkbox[name="cbfStatus"]').setValue(1);
      }
    } else {
      var checkbox = me.down('checkbox[name="cbfStatus"]');
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
      callapi("basedata/private/basedataIssueAgainstController/updateJCZQPlayTypeControl.do", form.getValues(),
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