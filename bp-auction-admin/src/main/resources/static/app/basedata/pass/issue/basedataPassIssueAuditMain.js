Ext.define('JDD.basedata.pass.issue.basedataPassIssueAuditMain', {
  extend: 'Ext.panel.Panel',
  title: '过关期次审核',
  xtype: 'basedataPassIssueAuditMain',
  closable: true,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  initComponent: function () {
    this.callParent(arguments);
    var me = this;
    var lotteryStore = Ext.create('DCIS.Store', {
      url: '/basedata/private/basedataLotteryController/listAllBasedataLottery.do',
      autoLoad: true,
      fields: ['lotteryId', 'lotteryName', 'shortName', 'lotteryCode', 'winNumberTemplate', 'maxChaseCount', 'endbuyBeforeSecond', 'startbuyAfterChaseSecond', 'endissueAfterOpenSecond', 'extraWinningsStatus', 'status']
    });
    var store = Ext.create('DCIS.Store', {
      url: '/basedata/private/basedataIssuePassController/listBasedataIssue.do',
      autoLoad: true,
      baseParams: {endTime: Ext.Date.format(new Date(), 'Y-m-d H:i:s')},
      fields: ['issueId', 'lotteryId', 'lotteryName', 'winNumberTemplate', 'issueName', 'winNumber', 'openResult', 'passStatus', 'chaseExecuteStatus', 'packageStatus', 'openStatus', 'auditStatus', 'endTime', 'startTime', 'updateTime']
    });

    me.add({
      border: false,
      store: store,
      xtype: 'searchpanel',
      title: '查询',
      collapsible: true,
      collapsed: false,
      columns: 3,
      buildField: "Manual",
      forceFit: true,
      items: [{
        name: 'lotteryId',
        fieldLabel: '彩种',
        xtype: 'combo',
        emptyText: "--请选择--",
        displayField: 'lotteryName',
        valueField: "lotteryId",
        editable: false,
        queryMode: "local",
        store: lotteryStore
      }, {
        name: 'issueName',
        fieldLabel: '期号'
      }, {
        xtype: 'radiogroup',
        fieldLabel: '追号状态:',
        width: 220,
        items: [
          {boxLabel: '开奖', name: 'openStatus', inputValue: '1'},
          {boxLabel: '未开奖', name: 'openStatus', inputValue: '0'}
        ]
      }, {
        xtype: 'radiogroup',
        fieldLabel: '过关状态:',
        width: 280,
        colspan: 1,
        items: [
          {boxLabel: '未过关', name: 'passStatus', inputValue: '0'},
          {boxLabel: '过关中', name: 'passStatus', inputValue: '1'},
          {boxLabel: '已过关', name: 'passStatus', inputValue: '2'}
        ]
      }, {
        xtype: 'radiogroup',
        fieldLabel: '审核状态:',
        width: 220,
        items: [
          {boxLabel: '未审核', name: 'auditStatus', inputValue: '0'},
          {boxLabel: '已审核', name: 'auditStatus', inputValue: '1'}
        ]
      }]
    });
    me.add({
      xtype: 'datagrid',
      store: store,
      name: 'roleListGrid',
      buildField: "Manual",
      forceFit: true,
      columns: [
        {
          menuDisabled: true,
          sortable: false,
          xtype: 'linkColumn',
          header: '操作',
          locked: true,
          width: 230,
          callback: function (link, record) {
            //if (record.data.winNumber != null && record.data.winNumber.length > 0) {
            //    link[1].disabled = false;
            //} else {
            //    link[1].disabled = true;
            //}
            if (record.data.winNumber == null) {
              link[2].disabled = true;
            } else {
              link[2].disabled = false;
            }
            return link;


            return link;
          },
          links: [{
            icon: 'edit',
            linkText: '号码录入',
            handler: function (grid, rowIndex, colIndex, record) {
              var win = Ext.create("JDD.basedata.pass.issue.editBasedataIssueAudit", {
                store: store
              });
              win.Say("号码审核录入【" + record.data.lotteryName + " 第" + record.data.issueName + "期】");
              win.down('dataform').setValues(record.data);
              var regexs = "";
              var lotteryId = record.data.lotteryId;
              if (1 == lotteryId) {//胜负彩
                regexs = /^\d{14}$/;
              } else if (2 == lotteryId) {//四场进球彩
                regexs = /^\d{8}$/;
              } else if (3 === lotteryId) {//七星彩
                regexs = /^\d{7}$/;
              } else if (5 === lotteryId) {//双色球
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2} \d{2} \+ \d{2}$/;
              } else if (6 === lotteryId) {//福彩3D
                regexs = /^\d{3}$/;
              } else if (9 === lotteryId) {//体彩22选5
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2}$/;
              } else if (13 === lotteryId) {//七乐彩
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2} \d{2} \d{2} \+ \d{2}$/;
              } else if (15 === lotteryId) {//六场半全场 310301001113
                regexs = /^\d{12}$/;
              } else if (19 === lotteryId) {//任选九 31030100111301
                regexs = /^\s{14}$/;
              } else if (28 === lotteryId) {//重庆时时彩
                regexs = /^\d{5}$/;
              } else if (39 === lotteryId) {//超级大乐透
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2} \+ \d{2} \d{2}$/;
              } else if (45 === lotteryId) {//足彩单场
                regexs = /^\d{1}\(\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\)\;$/;
              } else if (61 === lotteryId) {//江西时时彩
                regexs = /^\d{5}$/;
              } else if (62 === lotteryId) {//十一运夺金
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2}$/;
              } else if (63 === lotteryId) {//排列3
                regexs = /^\d{3}$/;
              } else if (64 === lotteryId) {//排列5
                regexs = /^\d{5}$/;
              } else if (66 === lotteryId) {//内蒙古快3
                regexs = /^\d{1} \d{1} \d{1}$/;
              } else if (67 === lotteryId) {//快3
                regexs = /^\d{1} \d{1} \d{1}$/;
              } else if (68 === lotteryId) {//新快3
                regexs = /^\d{1} \d{1} \d{1}$/;
              } else if (70 === lotteryId) {//11选5
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2}$/;
              } else if (72 === lotteryId) {//幸运11选5
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2}$/;
              } else if (73 === lotteryId) {//新11选5
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2}$/;
              } else if (74 === lotteryId) {//欢乐11选5
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2}$/;
              } else if (78 === lotteryId) {//好运11选5
                regexs = /^\d{2} \d{2} \d{2} \d{2} \d{2}$/;
              } else if (90 === lotteryId) {//竞彩足球
                regexs = /^\d{1}\(\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\)\;$/;
              } else if (91 === lotteryId) {//竞彩篮球
                regexs = /^\d{1}\(\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\,\d{1}\,\d{1}\.\d{3}\)\;$/;
              } else if (95 === lotteryId) {//猜冠军
                //regexs = /^\d{7}$/;
              }

              win.show();
              var s = win.down('dataform').down("[name='winNumber']");
              s.regex = regexs;
              win.down('dataform').down("[name='auditStatus']").setValue(1);
              win.down('dataform').down("[name='winNumberVerify']").setValue(record.data.winNumber);
            }
          },
            {
              icon: 'edit',
              linkText: '开奖信息录入',
              handler: function (grid, rowIndex, colIndex, record) {
                var openResult = record.data.openResult;
                var strs = new Array(); //定义一数组
                var sales = 0;
                var rolling = 0;
                if (openResult != null) {
                  strs = openResult.split(":")
                  sales = strs[0];
                  rolling = strs[1];
                }
                var win = Ext.create("JDD.basedata.pass.issue.editRewardBasedataIssueAudit", {
                  issueId: record.data.issueId,
                  lotteryId: record.data.lotteryId,
                  sales: sales,
                  rolling: rolling,
                  store: store
                });
                win.Say("开奖信息审核录入【" + record.data.lotteryName + " 第" + record.data.issueName + "期】");
                win.down('dataform').setValues(record.data);
                win.down('dataform').down("[name='auditStatus']").setValue(1);
                win.show();
              }
            }
            ,
            {
              icon: 'ok',
              linkText: '过关',
              handler: function (grid, rowIndex, colIndex, record) {
                passIssue(record.data.issueId, record.data.lotteryName + " " + record.data.issueName);
              }

            }
          ]
          //}, {
          //    text: '彩种',
          //    dataIndex: 'lotteryId'
        },
        {
          text: '彩种',
          locked: true,
          dataIndex: 'lotteryName'
        }
        ,
        {
          text: '期号',
          locked: true,
          dataIndex: 'issueName'
        }
        ,
        {
          text: '开售时间',
          dataIndex: 'startTime',
          width: 140
        }
        ,
        {
          text: '截止时间 ',
          dataIndex: 'endTime',
          width: 140
        }
        ,
        {
          text: '开奖号码',
          dataIndex: 'winNumber',
          width: 200
        }
        ,
        {
          text: '开奖状态',
          dataIndex: 'openStatus',
          renderer: function (value) {
            if (value == 0) {
              return '未开奖';
            } else if (value == 1) {
              return '开奖';
            }
          }
        }
        ,
        {
          text: '过关状态',
          dataIndex: 'passStatus',
          renderer: function (value) {
            if (value == 0) {
              return '未过关';
            } else if (value == 1) {
              return '过关中';
            } else if (value == 2) {
              return '已过关';
            }
          }
        }
        ,
        {
          text: '变更时间',
          dataIndex: 'updateTime',
          width: 140
        }
        ,
        {
          text: '审核状态',
          dataIndex: 'auditStatus',
          renderer: function (value) {
            if (value == 0) {
              return "未审核";
            } else if (value == 1) {
              return "<span style='color:red;font-weight:bold;'>已审核</span>";
            }
          }
        }
      ]

    });

    var passIssue = function (id, msg) {
      if (id == '') {
        return;
      }
      Ext.Msg.confirm("确认", "确定要过关 <span style='color:red;font-weight:bold;'>" + msg + " </span> 吗？", function (button) {
        if (button == "yes") {
          var center = Ext.ComponentQuery.query("maincontent_center")[0];
          var loading = new Ext.LoadMask(center, {
            msg: '过关中，请稍等...'
          });
          loading.show();
          callapi('/basedata/private/basedataIssuePassController/passIssue.do', {issueId: id}, function (result) {
            if (result.success == true) {
              Ext.Msg.show({
                title: "提示",
                msg: "过关成功",
                modal: true,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
              });
              store.reload();
            } else {
              Ext.Msg.show({
                title: '错误',
                msg: result.data,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR,
                modal: true
              });
            }
            loading.hide();
          }, null, null, false);
        }
      });
    };
  }
})
;