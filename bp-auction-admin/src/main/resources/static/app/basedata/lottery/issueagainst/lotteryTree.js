Ext.define("JDD.basedata.lottery.issueagainst.lotteryTree", {
  extend: "Ext.panel.Panel",
  alias: "widget.lotteryTree",
  region: 'lotteryTree',
  collapsible: false,
  split: true,
  width: 200,
  autoScroll: true,
  defaults: {
    bodyStyle: 'padding:5px 0px 10px 0px'
  },
  layout: {
    type: 'accordion',
    titleCollapse: false,
    animate: false
  },
  animate: true,
  initComponent: function () {
    this.callParent(arguments);
    var me = this;
    var ctzc = [1, 2, 15, 19]; //传统足彩ID
    callapi("basedata/private/basedataIssueAgainstController/listAllAgainstLotterys.do", {}, function (result) {
      var gr = result;
      for (var i = 0; i < gr.length; i++) {
        var panel = Ext.create("Ext.tree.Panel", {
          title: gr[i].text,
          rootVisible: false,
          icon: gr[i].icon,
          titleCollapse: true,
          autoScroll: true,
          store: Ext.create('Ext.data.TreeStore', {
            proxy: {
              type: 'ajax',
              url: 'basedata/private/basedataIssueAgainstController/listIssueByLotteryId.do'
            },
            nodeParam: 'code',
            root: {
              expanded: false,
              text: gr[i].text,
              id: gr[i].id,
              leaf: false
            },
            autoLoad: true,
            fields: ['id', 'lotteryId', 'issueName', 'text', 'leaf', 'icon', 'expanded', 'moduleLink', 'billType']
          }),
          listeners: {
            cellclick: function (tree, td, cellIndex,
                                 record, tr, rowIndex, e, eo) {
              var issuePanel = Ext.ComponentQuery.query("#issuePanel")[0];
              issuePanel.removeAll();
              if (ctzc.indexOf(record.data.lotteryId) > -1) {
                me.showCTZCIssue(issuePanel, record.data.lotteryId, record.data.issueName);
              } else if (record.data.lotteryId == 45) { //足彩单场
                me.showBJDCIssue(issuePanel, record.data.issueName);
              } else if (record.data.lotteryId == 90) { //竞彩足球
                me.showJCZQIssue(issuePanel, record.data.issueName);
              } else if (record.data.lotteryId = 91) { //竞彩篮球
                me.showJCLQIssue(issuePanel, record.data.issueName);
              }
            }
          }
        });
        me.add(panel);
      }
    });
  },
  showBJDCIssue: function (panel, issueName) {
    var store = Ext.create('DCIS.Store', {
      url: 'basedata/private/basedataIssueAgainstController/getBJDCList.do',
      baseParams: {issueName: issueName},
      autoLoad: true,
      fields: ['id', 'issueMatchName', 'issueName', 'matchNo', 'hostTeam', 'hostTeamId', 'visitTeam', 'visitTeamId', 'buyEndTime', 'halfScore', 'fullScore', 'matchResult', 'finalSp', 'auditStatus', 'status']
    });
    panel.add({
      xtype: 'grid',
      store: store,
      title: '当前期号: <span style="color:red">' + issueName + '</span>',
      buildField: "Manual",
      forceFit: false,
      autoScroll: true,
      flex: 1,
      listeners: {
        cellclick: function (table, td, cellindex, record) {
          if (cellindex == 7) {
            if (record.data.status == 1) {
              Ext.Msg.confirm("确认", "确定要停售[" + record.data.hostTeam + " VS " + record.data.visitTeam + "]？", function (button) {
                if (button == "yes") {
                  Ext.create('JDD.basedata.lottery.issueagainst.stopBjdcMatch', {
                    store: store,
                    issueMatchName: record.data.issueMatchName,
                    issueName: record.data.issueName,
                    panel: panel
                  }).show();
                }
              })
            }
            if (record.data.status == 0) {
              Ext.Msg.confirm("确认", "确定要开售[" + record.data.hostTeam + " VS " + record.data.visitTeam + "]？", function (button) {
                if (button == "yes") {
                  var loading = new Ext.LoadMask(panel, {
                    msg: '请稍等...'
                  });
                  loading.show();

                  callapi("basedata/private/basedataIssueAgainstController/saleBJDC.do", {
                        issueMatchName: record.data.issueMatchName,
                        issueName: record.data.issueName
                      },
                      function (result) {
                        loading.hide();
                        if (result.success) {
                          Ext.MessageBox.show({
                            title: "提示",
                            msg: "保存成功",
                            modal: true,
                            icon: Ext.Msg.INFO,
                            buttons: Ext.Msg.OK
                          });
                          store.load();
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
              })
            }
          }
        }
      },
      columns: [
        {
          text: '序号',
          dataIndex: 'matchNo',
          width: 40,
          align: 'center',
          sortable: false
        }, {
          text: '主队',
          dataIndex: 'hostTeam'
        }, {
          text: '客队',
          dataIndex: 'visitTeam'
        }, {
          text: '停售时间',
          width: 150,
          dataIndex: 'buyEndTime'
        }, {
          text: '半场比分',
          dataIndex: 'halfScore'
        }, {
          text: '全场比分',
          dataIndex: 'fullScore'
        }, {
          text: '赛果',
          dataIndex: 'matchResult'
        }, {
          text: '开售',
          dataIndex: 'status',
          renderer: function (value) {
            if (value == 0) {
              return '<input type="button" value="开售" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">禁售</span>';
            } else if (value == 1) {
              return '<input type="button" value="禁售" style="cursor:hand"/>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }
      ]
    });

  },
  showJCZQIssue: function (panel, issueName) {
    var store = Ext.create('DCIS.Store', {
      url: 'basedata/private/basedataIssueAgainstController/getJCZQList.do',
      baseParams: {issueName: issueName},
      autoLoad: true,
      fields: ['id', 'issueMatchName', 'issueName', 'matchNo', 'hostTeam', 'visitTeam', 'dgRqspfStatus', 'dgJqsStatus', 'dgBqcStatus', 'dgSpfStatus', 'rqspfStatus', 'jqsStatus', 'cbfStatus', 'bqcStatus', 'spfStatus', 'matchId', 'buyEndTime', 'halfScore', 'fullScore', 'matchId', 'matchResult', 'finalSp', 'auditStatus', 'status']
    });

    //单关让球胜平负 
    window.updateDgRqspfStatus = function (matchNo, hostTeam, issueName, issueMatchName, dgRqspfStatus) {
      if (dgRqspfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[单关让球胜平负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopDgRqspf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {

                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (dgRqspfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[单关让球胜平负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startDgRqspf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //单关总进球
    window.updateDgJqsStatus = function (matchNo, hostTeam, issueName, issueMatchName, dgJqsStatus) {
      if (dgJqsStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[单关总进球]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopDgJqs.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      } else if (dgJqsStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[单关总进球]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startDgJqs.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //单关半全场
    window.updateDgBqcStatus = function (matchNo, hostTeam, issueName, issueMatchName, dgBqcStatus) {

      if (dgBqcStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[单关半全场]？", function (button) {
          if (button == "yes") {

            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();

            callapi("basedata/private/basedataIssueAgainstController/stopDgBqc.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (dgBqcStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[单关半全场]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startDgBqc.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };

    // 单关胜平负
    window.updateDgSpfStatus = function (matchNo, hostTeam, issueName, issueMatchName, dgSpfStatus) {
      if (dgSpfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[单关胜平负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopDgSpf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (dgSpfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[单关胜平负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startDgSpf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //让球胜平负
    window.updateRqspfStatus = function (matchNo, hostTeam, issueName, issueMatchName, rqspfStatus) {
      if (rqspfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[让球胜平负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopRqspf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (rqspfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[让球胜平负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startRqspf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    }
    //总进球
    window.updateJqsStatus = function (matchNo, hostTeam, issueName, issueMatchName, jqsStatus) {
      if (jqsStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[总进球]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopJqs.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (jqsStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[总进球]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startJqs.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //猜比分
    window.updateCbfStatus = function (matchNo, hostTeam, issueName, issueMatchName, cbfStatus) {
      if (cbfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[猜比分]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopCbf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (cbfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[猜比分]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startCbf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //半全场
    window.updateBqcStatus = function (matchNo, hostTeam, issueName, issueMatchName, bqcStatus) {
      if (bqcStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[半全场]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopBqc.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (bqcStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[半全场]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startBqc.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //胜平负
    window.updateSpfStatus = function (matchNo, hostTeam, issueName, issueMatchName, spfStatus) {

      if (spfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[胜平负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopSpf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (spfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[胜平负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startSpf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };

    panel.add({
      xtype: 'grid',
      name: 'jczqgrid',
      store: store,
      autoScroll: true,
      title: '当前期号: <span style="color:red">' + issueName + '</span>',
      buildField: "Manual",
      flex: 1,
      columns: [{
        menuDisabled: true,
        sortable: false,
        xtype: 'linkColumn',
        header: '操作',
        locked: true,
        width: 100,
        links: [{
          icon: 'edit',
          linkText: '玩法控制',
          handler: function (grid, rowIndex, colIndex, record) {
            var matchName = record.data.issueMatchName;
            callapi("basedata/private/basedataIssueAgainstController/getJCZQPlayTypeControl.do", {issueMatchName: matchName}, function (ret) {
              if (ret.success) {
                var win = Ext.create('JDD.basedata.lottery.issueagainst.jczqPlayControl', {
                  store: store,
                  issueName: issueName,
                  issueMatchName: matchName,
                  headName: '序号' + record.data.matchNo + ' [' + record.data.hostTeam + ']',
                  playState: ret.data
                }).show();
              }
            });
          }
        }]
      },
        {
          text: '序号',
          dataIndex: 'matchNo',
          width: 100,
          align: 'center',
          locked: true
        }, {
          text: '主队 VS 客队',
          dataIndex: 'hostTeam',
          width: 200,
          locked: true
        }, {
          text: '开售',
          dataIndex: 'status',
          width: 80,
          renderer: function (value) {
            if (value == 1) {
              return '是';
            } else if (value == 0) {
              return '否';
            }
          }
        }, {
          text: '单关让球胜平负',
          dataIndex: 'dgRqspfStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateDgRqspfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgRqspfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateDgRqspfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgRqspfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '单关总进球',
          dataIndex: 'dgJqsStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateDgJqsStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgJqsStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售"  onclick="updateDgJqsStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgJqsStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '单关半全场',
          dataIndex: 'dgBqcStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateDgBqcStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgBqcStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateDgBqcStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgBqcStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '单关胜平负',
          dataIndex: 'dgSpfStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick ="updateDgSpfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgSpfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick ="updateDgSpfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgSpfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '让球胜平负',
          dataIndex: 'rqspfStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick ="updateRqspfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.rqspfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick ="updateRqspfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.rqspfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '总进球',
          dataIndex: 'jqsStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick ="updateJqsStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.jqsStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick ="updateJqsStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.jqsStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '猜比分',
          dataIndex: 'cbfStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick ="updateCbfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.cbfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick ="updateCbfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.cbfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '半全场',
          dataIndex: 'bqcStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick ="updateBqcStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.bqcStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick ="updateBqcStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.bqcStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '胜平负',
          dataIndex: 'spfStatus',
          width: 100,
          renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick ="updateSpfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.spfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick ="updateSpfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.spfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '场次ID',
          dataIndex: 'matchId',
          width: 70
        }, {
          text: '停售时间',
          width: 150,
          dataIndex: 'buyEndTime'
        }
      ]
    });
  },
  showJCLQIssue: function (panel, issueName) {
    var store = Ext.create('DCIS.Store', {
      url: 'basedata/private/basedataIssueAgainstController/getJCLQList.do',
      baseParams: {issueName: issueName},
      autoLoad: true,
      fields: ['id', 'issueMatchName', 'issueName', 'matchNo', 'hostTeam', 'dgRfsfStatus', 'dgSfStatus', 'dgDxfStatus', 'rfsfStatus', 'sfStatus', 'sfcStatus', 'dxfStatus', 'buyEndTime', 'fullScore', 'matchResult', 'auditStatus', 'status']
    });
    panel.add({
          xtype: 'panel',
          title: '当前期号: <span style="color:red">' + issueName + '</span>'
        }
    );
    //单关让分胜负
    window.updateJclqDgrfsfStatus = function (matchNo, hostTeam, issueName, issueMatchName, dgRfsfStatus) {
      if (dgRfsfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[单关让分胜负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopDgRfsf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (dgRfsfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[单关让分胜负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startDgRfsf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //单关胜负
    window.updateJclqDgSfStatus = function (matchNo, hostTeam, issueName, issueMatchName, dgSfStatus) {
      if (dgSfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[单关胜负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopDgSf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (dgSfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[单关胜负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startDgSf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
//单关大小分
    window.updateJclqDgDxfStatus = function (matchNo, hostTeam, issueName, issueMatchName, dgDxfStatus) {
      if (dgDxfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[单关大小分]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopDgDxf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (dgDxfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[单关大小分]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startDgDxf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };

    //让分胜负
    window.updateJclqRfsfStatus = function (matchNo, hostTeam, issueName, issueMatchName, rfsfStatus) {
      if (rfsfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[让分胜负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopRfsf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (rfsfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[让分胜负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startRfsf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //胜负
    window.updateJclqSfStatus = function (matchNo, hostTeam, issueName, issueMatchName, sfStatus) {
      if (sfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[胜负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopSf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (sfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[胜负]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startSf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //胜分差
    window.updateJclqSfcStatus = function (matchNo, hostTeam, issueName, issueMatchName, sfcStatus) {
      if (sfcStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[胜分差]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopSfc.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (sfcStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[胜分差]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startSfc.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };
    //大小分
    window.updateJclqDxfStatus = function (matchNo, hostTeam, issueName, issueMatchName, dxfStatus) {
      if (dxfStatus == 1) {
        Ext.Msg.confirm("确认", "确定要停售[" + matchNo + "]-[" + hostTeam + "]-[大小分]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/stopDxf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "停售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
      else if (dxfStatus == 0) {
        Ext.Msg.confirm("确认", "确定要开售[" + matchNo + "]-[" + hostTeam + "]-[大小分]？", function (button) {
          if (button == "yes") {
            var loading = new Ext.LoadMask(panel, {
              msg: '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataIssueAgainstController/startDxf.do", {
                  issueMatchName: issueMatchName,
                  issueName: issueName
                },
                function (result) {
                  loading.hide();
                  if (result.success) {
                    Ext.MessageBox.show({
                      title: "提示",
                      msg: "开售成功",
                      modal: true,
                      icon: Ext.Msg.INFO,
                      buttons: Ext.Msg.OK
                    });
                    store.load();
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
                }
            );
          }
        })
      }
    };

    panel.add({
      xtype: 'grid',
      name: 'jclqgrid',
      store: store,
      buildField: "Manual",
      flex: 1,
      columns: [{
        menuDisabled: true,
        sortable: false,
        xtype: 'linkColumn',
        header: '操作',
        locked: true,
        width: 100,
        links: [{
          icon: 'edit',
          linkText: '玩法控制',
          handler: function (grid, rowIndex, colIndex, record) {
            var matchName = record.data.issueMatchName;
            callapi("basedata/private/basedataIssueAgainstController/getJCLQPlayTypeControl.do", {issueMatchName: matchName}, function (ret) {
              if (ret.success) {
                Ext.create('JDD.basedata.lottery.issueagainst.jclqPlayControl', {
                  store: store,
                  issueName: record.data.issueName,
                  issueMatchName: matchName,
                  headName: '序号' + record.data.matchNo + ' [' + record.data.hostTeam + ']',
                  playState: ret.data
                }).show();
              }
            });
          }
        }]
      },
        {
          text: '序号',
          dataIndex: 'matchNo',
          locked: true,
          width: 100,
          align: 'center'
        }, {
          text: '客队 VS 主队',
          dataIndex: 'hostTeam',
          locked: true,
          width: 120
        }, {
          text: '开售',
          dataIndex: 'status',
          locked: true,
          width: 45,
          renderer: function (value) {
            if (value == 1) {
              return '是';
            } else if (value == 0) {
              return '否';
            }
          }
        }, {
          text: '单关让分胜负',
          locked: true,
          width: 100,
          dataIndex: 'dgRfsfStatus',
          renderer: function (value, cellmeta, record) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateJclqDgrfsfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgRfsfStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateJclqDgrfsfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgRfsfStatus + '\')"   style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '单关胜负',
          dataIndex: 'dgSfStatus',
          locked: true,
          width: 100,
          renderer: function (value, cellmeta, record) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateJclqDgSfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgSfStatus + '\')"   style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateJclqDgSfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgSfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '单关大小分',
          dataIndex: 'dgDxfStatus',
          locked: true,
          width: 100,
          renderer: function (value, cellmeta, record) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateJclqDgDxfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgDxfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateJclqDgDxfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dgDxfStatus + '\')" style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '让分胜负',
          dataIndex: 'rfsfStatus',
          locked: true,
          width: 100,
          renderer: function (value, cellmeta, record) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateJclqRfsfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.rfsfStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateJclqRfsfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.rfsfStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '胜负',
          dataIndex: 'sfStatus',
          locked: true,
          width: 100,
          renderer: function (value, cellmeta, record) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateJclqSfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.sfStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateJclqSfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.sfStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '胜分差',
          dataIndex: 'sfcStatus',
          locked: true,
          width: 100,
          renderer: function (value, cellmeta, record) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateJclqSfcStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.sfcStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateJclqSfcStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.sfcStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '大小分',
          dataIndex: 'dxfStatus',
          locked: true,
          width: 100,
          renderer: function (value, cellmeta, record) {
            if (value == 0) {
              return '<input type="button" value="开售" onclick="updateJclqDxfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dxfStatus + '\')"  style="cursor:hand" />&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;font-weight:bold;">停售</span>';
            } else if (value == 1) {
              return '<input type="button" value="停售" onclick="updateJclqDxfStatus(\'' + record.data.matchNo + '\', \'' + record.data.hostTeam + '\',\'' + record.data.issueName + '\',\'' + record.data.issueMatchName + '\',\'' + record.data.dxfStatus + '\')"  style="cursor:hand"/>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;font-weight:bold;">开售</span>';
            }
          }
        }, {
          text: '停售时间',
          width: 150,
          locked: true,
          dataIndex: 'buyEndTime'
        }
      ]
    });
  },
  showCTZCIssue: function (panel, lotteryId, issueName) {
    var store = Ext.create('DCIS.Store', {
      url: 'basedata/private/basedataIssueAgainstController/getCTZCList.do',
      baseParams: {lotteryId: lotteryId, issueName: issueName},
      autoLoad: true,
      fields: ['id', 'lotteryId', 'issueName', 'matchNo', 'hostTeam', 'hostTeamId', 'visitTeam', 'visitTeamId', 'matchStartTime', 'euroOdds', 'fullScore', 'matchResult', 'auditStatus', 'passStatus']
    });
    panel.add({
          xtype: 'panel',
          title: '当前期号: <span style="color:red">' + issueName + '</span>'
        }
    );
    panel.add({
      xtype: 'grid',
      width: 1200,
      store: store,
      buildField: "Manual",
      forceFit: true,
      columns: [
        {
          text: '序号',
          dataIndex: 'matchNo',
          width: 40,
          align: 'center'
        }, {
          text: '主队',
          dataIndex: 'hostTeam'
        }, {
          text: '客队',
          dataIndex: 'visitTeam'
        }, {
          text: '比赛时间',
          width: 150,
          dataIndex: 'matchStartTime'
        }, {
          text: '欧赔',
          dataIndex: 'euroOdds'
        }, {
          text: '比分',
          dataIndex: 'fullScore'
        }, {
          text: '赛果',
          dataIndex: 'matchResult'
        }, {
          text: '审核状态',
          dataIndex: 'auditStatus',
          renderer: function (value) {
            if (value == 0) {
              return '未审核';
            } else if (value == 1) {
              return '已审核';
            }
          }
        }, {
          text: '过关状态',
          dataIndex: 'passStatus',
          renderer: function (value) {
            if (value == 0) {
              return '未过关';
            } else if (value == 1) {
              return '过关中';
            } else if (value == 2) {
              return '已过关'
            }
          }
        }
      ]
    });
  }

});