Ext.define("JDD.basedata.pass.passagainst.lotteryTree", {
  extend: "Ext.panel.Panel",
  alias: "widget.passAgainstLotteryTree",
  region: 'passAgainstLotteryTree',
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
    callapi("basedata/private/basedataPassAgainstController/listAllAgainstLotterys.do", {}, function (result) {
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
              url: 'basedata/private/basedataPassAgainstController/listIssueByLotteryId.do'
            },
            nodeParam: 'code',
            root: {
              expanded: false,
              text: gr[i].text,
              id: gr[i].id,
              leaf: false
            },
            autoLoad: true,
            fields: ['id', 'lotteryId', 'issueName', 'text', 'leaf', 'icon', 'expanded', 'moduleLink', 'billType', 'passStatus']
          }),
          listeners: {
            cellclick: function (tree, td, cellIndex,
                                 record, tr, rowIndex, e, eo) {
              var issuePanel = Ext.ComponentQuery.query("#passAgainstIssuePanel")[0];
              issuePanel.removeAll();
              if (ctzc.indexOf(record.data.lotteryId) > -1) {
                me.showCTZCIssue(issuePanel, record.data.lotteryId, record.data.issueName, record.data.id);
              } else if (record.data.lotteryId == 45) { //足彩单场
                me.showBJDCIssue(issuePanel, record.data.issueName, record.data.id);
              } else if (record.data.lotteryId == 90) { //竞彩足球
                me.showJCZQIssue(issuePanel, record.data.issueName, record.data.id);
              } else if (record.data.lotteryId = 91) { //竞彩篮球
                me.showJCLQIssue(issuePanel, record.data.issueName, record.data.id);
              }
            }
          }
        });
        me.add(panel);
      }
    });
  },
  showBJDCIssue: function (panel, issueName, issueId) {
    var passStatusObj = {
      0: '未过关',
      1: '过关中',
      2: '已过关'
    };

    var openStatusObj = {
      0:'未开奖',
      1:'已开奖'
    };

    var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});

    var store = Ext.create('DCIS.Store', {
      url: 'basedata/private/basedataIssueAgainstController/getBJDCList.do',
      baseParams: {issueName: issueName},
      autoLoad: true,
      fields: ['id', 'issueMatchName', 'issueName', 'matchNo', 'hostTeam', 'visitTeam', 'teamVs', 'matchStartTime', 'buyEndTime', 'rq', 'halfScore', 'fullScore', 'matchResult', 'spfSp', 'jqsSp', 'cbfSp', 'sxpSp', 'bqcSp', 'finalSp', 'auditStatus', 'status']
    });

    var title = '当前期号: <span style="color:red">' + issueName + '</span>' + '&nbsp;&nbsp;&nbsp;&nbsp;当前期号: <span style="color:red">' + passStatusObj[issue.passStatus] + '-' + openStatusObj[issue.openStatus] +'</span>';
    panel.add({
      xtype: 'grid',
      store: store,
      title: title,
      buildField: "Manual",
      forceFit: false,
      autoScroll: true,
      flex: 1,
      listeners: {
        beforeedit: function (editor, e) {
          if (e.record.data.auditStatus == 1) {
            return false;
          }
        }
      },
      tbar: [
        {
          text: '保存',
          iconCls: "icon-save",
          handler: function () {
            if (store.getCount() == 0) {
              Ext.MessageBox.show({
                title: "提示",
                msg: "无需要更新比赛",
                modal: true,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
              });
              return;
            }
            var matchs = [];
            for (var i = 0; i < store.getCount(); i++) {
              var match = store.getAt(i);
              if (match.data.auditStatus == 1) {
                continue;
              }
              var matchObj = {
                id: match.data.id,
                issueMatchName: match.data.issueMatchName,
                issueName : issueName,
                auditStatus: 1,
                rq: match.data.rq
              };
              var canPush = false;
              if (match.data.halfScore && match.data.fullScore) { //半全场比分
                matchObj.halfScore = match.data.halfScore;
                matchObj.fullScore = match.data.fullScore;
                canPush = true;
              } else {
                matchObj.auditStatus = 0;
                continue;
              }
              if (match.data.spfSp && match.data.jqsSp && match.data.cbfSp && match.data.sxpSp && match.data.bqcSp) { //胜平负SP
                matchObj.spfSp = match.data.spfSp;
                matchObj.jqsSp = match.data.jqsSp;
                matchObj.cbfSp = match.data.cbfSp;
                matchObj.sxpSp = match.data.sxpSp;
                matchObj.bqcSp = match.data.bqcSp;
              } else {
                matchObj.auditStatus = 0;
              }
              if (canPush) {
                matchs.push(matchObj);
              }
            }

            if (matchs.length == 0) {
              Ext.MessageBox.show({
                title: "提示",
                msg: "无需要更新期次",
                modal: true,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
              });
              return;
            }

            callapi("basedata/private/basedataPassAgainstController/updateBJDCMatchAuditStatus.do", matchs, function (result) {
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
            })

          }
        },
        {
          text: '过关',
          iconCls: "icon-undo",
          handler: function () {
            var panel = this.up("grid").up('panel');
            var loading = new Ext.LoadMask(panel, {
              msg : '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataPassAgainstController/updateBJDCIssuePassStatus.do", {issueId: issueId}, function (result) {
              loading.hide();
              if (result.success) {
                var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});
                var title = '当前期号: <span style="color:red">' + issueName + '</span>' + '&nbsp;&nbsp;&nbsp;&nbsp;当前期号: <span style="color:red">' + passStatusObj[issue.passStatus] + '-' + openStatusObj[issue.openStatus] +'</span>';
                var p = panel.down('grid');
                p.setTitle(title);
                Ext.MessageBox.show({
                  title: "提示",
                  msg: "后台过关中,请稍后查看",
                  modal: true,
                  icon: Ext.Msg.INFO,
                  buttons: Ext.Msg.OK
                });
              } else {
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
        }
      ],
      plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
        })
      ],
      columns: [
        {
          text: '序号',
          dataIndex: 'matchNo',
          width: 40,
          align: 'center',
          sortable: false,
          locked: true
        }, {
          text: '主队 VS 客队',
          dataIndex: 'teamVs',
          width: 150,
          locked: true
        }, {
          text: '比赛时间',
          width: 150,
          dataIndex: 'matchStartTime'
        }, {
          text: '让球',
          dataIndex: 'rq',
          width: 50
        }, {
          text: '半场比分',
          dataIndex: 'halfScore',
          tdCls: 'caneditcolumn',
          width: 70,
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true,
            regex: /^(\d{1,2}:\d{1,2}|-1:-1)$/,
            regexText: '请输入正确的比分！ 示例[1:2][-1:-1]'
          }
        }, {
          text: '全场比分',
          dataIndex: 'fullScore',
          tdCls: 'caneditcolumn',
          width: 100,
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true,
            regex: /^(\d{1,2}:\d{1,2}|-1:-1)$/,
            regexText: '请输入正确的比分！ 示例[1:2][-1:-1]'
          }
        }, {
          text: '胜平负',
          dataIndex: 'spfSp',
          tdCls: 'caneditcolumn',
          width: 100,
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true
          }
        }, {
          text: '总进球',
          dataIndex: 'jqsSp',
          tdCls: 'caneditcolumn',
          width: 100,
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true
          }
        }, {
          text: '上下盘',
          dataIndex: 'sxpSp',
          tdCls: 'caneditcolumn',
          width: 100,
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true
          }
        }, {
          text: '猜比分',
          dataIndex: 'cbfSp',
          tdCls: 'caneditcolumn',
          width: 100,
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true
          }
        }, {
          text: '半全场',
          dataIndex: 'bqcSp',
          tdCls: 'caneditcolumn',
          width: 100,
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true
          }
        }, {
          text: '审核',
          dataIndex: 'auditStatus',
          width: 80,
          renderer: function (value) {
            if (value == 0) {
              return '未审核';
            } else if (value == 1) {
              return '<span style="color:red;font-weight:bold;cursor:hand">已审核</span>';
            }
          }
        }
      ]
    });

  },
  showJCZQIssue: function (panel, issueName, issueId) {
    var passStatusObj = {
      0: '未过关',
      1: '过关中',
      2: '已过关'
    };
    var openStatusObj = {
      0:'未开奖',
      1:'已开奖'
    };
    var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});
    var store = Ext.create('DCIS.Store', {
      url: 'basedata/private/basedataIssueAgainstController/getJCZQList.do',
      baseParams: {issueName: issueName},
      autoLoad: true,
      fields: ['id', 'issueMatchName', 'issueName', 'matchNo', 'hostTeam', 'visitTeam', 'dgRqspfStatus', 'dgJqsStatus', 'dgBqcStatus', 'dgSpfStatus', 'rqspfStatus', 'jqsStatus', 'cbfStatus', 'bqcStatus', 'spfStatus', 'matchId', 'matchStartTime', 'buyEndTime', 'rq', 'halfScore', 'fullScore', 'matchId', 'matchResult', 'finalSp', 'auditStatus', 'status']
    });
    var title = '当前期号: <span style="color:red">' + issueName + '</span>' + '&nbsp;&nbsp;&nbsp;&nbsp;当前期号: <span style="color:red">' + passStatusObj[issue.passStatus] + '-' + openStatusObj[issue.openStatus] +'</span>';

    panel.add({
      xtype: 'grid',
      name: 'jczqgrid',
      store: store,
      title: title,
      buildField: "Manual",
      forceFit: false,
      autoScroll: true,
      flex: 1,
      listeners: {
        beforeedit: function (editor, e) {
          if (e.record.data.auditStatus == 1) {
            return false;
          }
        }
      },
      tbar: [{
        text: '保存',
        iconCls: "icon-save",
        handler: function () {
          if (store.getCount() == 0) {
            Ext.MessageBox.show({
              title: "提示",
              msg: "无需要更新比赛",
              modal: true,
              icon: Ext.Msg.INFO,
              buttons: Ext.Msg.OK
            });
            return;
          }
          var matchs = [];
          for (var i = 0; i < store.getCount(); i++) {
            var match = store.getAt(i);
            var matchObj = {
              id: match.data.id,
              issueName: issueName,
              issueMatchName: match.data.issueMatchName,
              auditStatus: 1,
              rq: match.data.rq
            };
            if (match.data.halfScore) { //半全场比分
              matchObj.halfScore = match.data.halfScore;
            } else {
              matchObj.auditStatus = 0;
              continue;
            }
            if (match.data.fullScore) { //全场比分
              matchObj.fullScore = match.data.fullScore;
            } else {
              matchObj.auditStatus = 0;
              continue;
            }
            
            matchs.push(matchObj);
          }

          if (matchs.length == 0) {
            Ext.MessageBox.show({
              title: "提示",
              msg: "请填写半场比分，全场比分",
              modal: true,
              icon: Ext.Msg.INFO,
              buttons: Ext.Msg.OK
            });
            return;
          }

          callapi("basedata/private/basedataPassAgainstController/updateJCZQMatchAuditStatus.do", matchs, function (result) {
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
          })
        }
      },
        {
          text: '过关',
          iconCls: "icon-undo",
          handler: function () {
            callapi("basedata/private/basedataPassAgainstController/updateJCZQIssuePassStatus.do", {issueId: issueId}, function (result) {
              if (result.success) {
                var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});
                var title = '当前期号: <span style="color:red">' + issueName + '</span>' + '&nbsp;&nbsp;&nbsp;&nbsp;当前期号: <span style="color:red">' + passStatusObj[issue.passStatus] + '-' + openStatusObj[issue.openStatus] +'</span>';
                var p = panel.down('grid');
                p.setTitle(title);
                Ext.MessageBox.show({
                  title: "提示",
                  msg: "后台过关中,请稍后查看",
                  modal: true,
                  icon: Ext.Msg.INFO,
                  buttons: Ext.Msg.OK
                });
              } else {
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
        }
      ],
      plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
        })
      ],
      columns: [
        {
          text: '序号',
          dataIndex: 'matchNo',
          width: 100,
          align: 'center'
        }, {
          text: '主队 VS 客队',
          dataIndex: 'hostTeam',
          width: 200
        }, {
          text: '比赛时间',
          width: 150,
          dataIndex: 'matchStartTime'
        }, {
          text: '让球',
          dataIndex: 'rq',
          width: 50
        }, {
          text: '半场比分',
          dataIndex: 'halfScore',
          width: 60,
          tdCls: 'caneditcolumn',
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true,
            regex: /^(\d{1,2}:\d{1,2}|-1:-1)$/,
            regexText: '请输入正确的比分！ 示例[1:2][-1:-1]'
          }
        }, {
          text: '全场比分',
          dataIndex: 'fullScore',
          width: 60,
          tdCls: 'caneditcolumn',
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true,
            regex: /^(\d{1,2}:\d{1,2}|-1:-1)$/,
            regexText: '请输入正确的比分！ 示例[1:2][-1:-1]'
          }
        }, {
          text: '审核状态',
          dataIndex: 'auditStatus',
          width: 60,
          renderer: function (value) {
            if (value == 0) {
              return '未审核';
            } else if (value == 1) {
              return '<span style="color:red;font-weight:bold;cursor:hand">已审核</span>';
            }
          }
        }
      ]
    });
  },
  showJCLQIssue: function (panel, issueName, issueId) {
    var passStatusObj = {
      0: '未过关',
      1: '过关中',
      2: '已过关'
    };
    var openStatusObj = {
      0:'未开奖',
      1:'已开奖'
    };
    var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});
    var store = Ext.create('DCIS.Store', {
      url: 'basedata/private/basedataIssueAgainstController/getJCLQList.do',
      baseParams: {issueName: issueName},
      autoLoad: true,
      fields: ['id', 'issueMatchName', 'issueName', 'matchNo', 'hostTeam', 'rfsfSp', 'dxfSp', 'dgRfsfStatus', 'dgSfStatus', 'dgDxfStatus', 'rfsfStatus', 'sfStatus', 'sfcStatus', 'dxfStatus', 'matchStartTime', 'buyEndTime', 'fullScore', 'matchResult', 'auditStatus', 'status']
    });
    var title = '当前期号: <span style="color:red">' + issueName + '</span>' + '&nbsp;&nbsp;&nbsp;&nbsp;当前期号: <span style="color:red">' + passStatusObj[issue.passStatus] + '-' + openStatusObj[issue.openStatus] +'</span>';

    panel.add({
      xtype: 'grid',
      name: 'jclqgrid',
      title: title,
      store: store,
      buildField: "Manual",
      forceFit: false,
      autoScroll: true,
      flex: 1,
      listeners: {
        beforeedit: function (editor, e) {
          if (e.record.data.auditStatus == 1) {
            return false;
          }
        }
      },
      tbar: [{
        text: '保存',
        iconCls: "icon-save",
        handler: function () {

          if (store.getCount() == 0) {
            Ext.MessageBox.show({
              title: "提示",
              msg: "无需要更新比赛",
              modal: true,
              icon: Ext.Msg.INFO,
              buttons: Ext.Msg.OK
            });
            return;
          }
          var matchs = [];
          for (var i = 0; i < store.getCount(); i++) {
            var match = store.getAt(i);
            var matchObj = {
              id: match.data.id,
              issueMatchName: match.data.issueMatchName,
              issueName : issueName,
              auditStatus: 1,
              rfsfSp:match.data.rfsfSp,
              dxfSp:match.data.dxfSp
            };
            if (match.data.fullScore) { //全场比分
              matchObj.fullScore = match.data.fullScore;
            } else {
              matchObj.auditStatus = 0;
              continue;
            }
            matchs.push(matchObj);
          }

          if (matchs.length == 0) {
            Ext.MessageBox.show({
              title: "提示",
              msg: "请填写全场比分",
              modal: true,
              icon: Ext.Msg.INFO,
              buttons: Ext.Msg.OK
            });
            return;
          }

          callapi("basedata/private/basedataPassAgainstController/updateJCLQMatchAuditStatus.do", matchs, function (result) {
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
          })
        }
      },
        {
          text: '过关',
          iconCls: "icon-undo",
          handler: function () {
            callapi("basedata/private/basedataPassAgainstController/updateJCLQIssuePassStatus.do", {issueId: issueId}, function (result) {
              if (result.success) {
                var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});
                var title = '当前期号: <span style="color:red">' + issueName + '</span>' + '&nbsp;&nbsp;&nbsp;&nbsp;当前期号: <span style="color:red">' + passStatusObj[issue.passStatus] + '-' + openStatusObj[issue.openStatus] +'</span>';
                var p = panel.down('grid');
                p.setTitle(title);
                Ext.MessageBox.show({
                  title: "提示",
                  msg: "后台过关中,请稍后查看",
                  modal: true,
                  icon: Ext.Msg.INFO,
                  buttons: Ext.Msg.OK
                });
              } else {
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
        }
      ],
      plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
        })
      ],
      columns: [
        {
          text: '序号',
          dataIndex: 'matchNo',
          width: 100,
          align: 'center'
        }, {
          text: '客队 VS 主队',
          dataIndex: 'hostTeam',
          width: 120
        }, {
          text: '比赛时间',
          width: 150,
          dataIndex: 'matchStartTime'
        }, {
          text: '全场比分',
          dataIndex: 'fullScore',
          width: 65,
          tdCls: 'caneditcolumn',
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true,
            regex: /^(\d{1,3}:\d{1,3}|-1:-1)$/,
            regexText: '请输入正确的比分！ 示例[1:2][-1:-1]'
          }
        }, {
          text: '审核状态',
          dataIndex: 'auditStatus',
          width: 70,
          renderer: function (value) {
            if (value == 0) {
              return '未审核';
            } else if (value == 1) {
              return '<span style="color:red;font-weight:bold;cursor:hand">已审核</span>';
            }
          }
        }
      ]
    });
  },

  showCTZCIssue: function (panel, lotteryId, issueName, issueId) {
    var passStatusObj = {
      0: '未过关',
      1: '过关中',
      2: '已过关'
    };
    var openStatusObj = {
      0:'未开奖',
      1:'已开奖'
    };
    var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});
    var store = Ext.create('DCIS.Store', {
      url: 'basedata/private/basedataIssueAgainstController/getCTZCList.do',
      baseParams: {lotteryId: lotteryId, issueName: issueName},
      autoLoad: true,
      fields: ['id', 'lotteryId', 'issueName', 'matchNo', 'issueMatchName', 'hostTeam', 'hostTeamId', 'visitTeam', 'visitTeamId', 'matchStartTime', 'fullScore', 'matchResult', 'auditStatus']
    });
    var title = '当前期号: <span style="color:red">' + issueName + '</span>' + '&nbsp;&nbsp;&nbsp;&nbsp;当前期号: <span style="color:red">' + passStatusObj[issue.passStatus] + '-' + openStatusObj[issue.openStatus] +'</span>';

    panel.add({
      xtype: 'grid',
      width: 1200,
      title: title,
      store: store,
      buildField: "Manual",
      forceFit: true,
      listeners: {
        beforeedit: function (editor, e) {
          if (e.record.data.auditStatus == 1) {
            return false;
          }
        }
      },
      tbar: [
        {
          text: '保存',
          iconCls: "icon-save",
          handler: function () {
            var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});

            if (store.getCount() == 0) {
              Ext.MessageBox.show({
                title: "提示",
                msg: "无需要更新比赛",
                modal: true,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
              });
              return;
            }
            var matchs = [];
            var winNumber = [];
            for (var i = 0; i < store.getCount(); i++) {
              var match = store.getAt(i);
              if (match.data.auditStatus == 1) {
                winNumber.push(match.data.matchResult);
                continue;
              }
              if (match.data.fullScore) {
                var match_ = {
                  id: match.data.id,
                  lotteryId: match.data.lotteryId,
                  matchNo: match.data.matchNo,
                  issueName: match.data.issueName,
                  issueMatchName: match.data.issueMatchName,
                  fullScore: match.data.fullScore,
                  matchResult: match.data.matchResult,
                  auditStatus: 1
                };

                var fullScore = match_.fullScore.split(":");
                if (fullScore[0] > fullScore[1])//胜
                {
                  match_.matchResult = "3";
                } else if (fullScore[0] == fullScore[1])//平
                {
                  match_.matchResult = "1";
                } else//负
                {
                  match_.matchResult = "0";
                }
                if(match_.lotteryId == 2) { //四场进球彩特殊处理
                   var prefix = fullScore[0] > 3 ? 3:fullScore[0];
                   var suffix = fullScore[1] > 3 ? 3:fullScore[1];
                   match_.matchResult = prefix + '' + suffix;
                }
                if(fullScore[0] == -1 || fullScore[1] == -1) {
                  if(match_.lotteryId == 2) { //四场进球特殊处理
                    winNumber.push('**');
                    match_.matchResult = '**';
                  } else {
                    winNumber.push('*');
                    match_.matchResult = '*';
                  }
                } else {
                  winNumber.push(match_.matchResult);
                }
                matchs.push(match_);
              } else {
                winNumber.push('*');
              }
            }

            if (matchs.length == 0) {
              Ext.MessageBox.show({
                title: "提示",
                msg: "无需要更新期次",
                modal: true,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
              });
              return;
            }

            var winNumber_ = winNumber.join('');
            var jsonParm = {
              matchs: matchs,
              winNumber : winNumber_,
              issueName : issue.issueName
            };
            var panel = this.up("grid").up('panel');
            var loading = new Ext.LoadMask(panel, {
              msg : '请稍等...'
            });
            loading.show();
            callapi("basedata/private/basedataPassAgainstController/updateCTZCMatchAuditStatus.do", jsonParm, function (result) {
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
            })

          }
        },
        {
          text: '过关',
          iconCls: "icon-undo",
          handler: function () {
            callapi("basedata/private/basedataPassAgainstController/updateCTZCIssuePassStatus.do", {issueId: issueId}, function (result) {
              if (result.success) {
                var issue = callapiAsync("basedata/private/basedataPassAgainstController/getBasedataIssueById.do", {id: issueId});
                var title = '当前期号: <span style="color:red">' + issueName + '</span>' + '&nbsp;&nbsp;&nbsp;&nbsp;当前期号: <span style="color:red">' + passStatusObj[issue.passStatus] + '-' + openStatusObj[issue.openStatus] +'</span>';
                var p = panel.down('grid');
                p.setTitle(title);
                Ext.MessageBox.show({
                  title: "提示",
                  msg: "后台过关中,请稍后查看",
                  modal: true,
                  icon: Ext.Msg.INFO,
                  buttons: Ext.Msg.OK
                });
              } else {
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
        }
      ],
      plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
        })
      ],
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
          text: '比分',
          dataIndex: 'fullScore',
          tdCls: 'caneditcolumn',
          field: {
            xtype: 'textfield',
            afterLabelTextTpl: required,
            allowBlank: true,
            regex: /^(\d{1,2}:\d{1,2}|-1:-1)$/,
            regexText: '请输入正确的比分！ 示例[1:2][-1:-1]'
          }
        }, {
          text: '赛果',
          dataIndex: 'matchResult',
          renderer: function (value) {
            if(value) {
              return value;
            } else {
              return "*";
            }
          }
        }, {
          text: '审核状态',
          dataIndex: 'auditStatus',
          renderer: function (value) {
            if (value == 0) {
              return '未审核';
            } else if (value == 1) {
              return '<span style="color:red;font-weight:bold;cursor:hand">已审核</span>';
            }
          }
        }
      ]
    });
  }

});