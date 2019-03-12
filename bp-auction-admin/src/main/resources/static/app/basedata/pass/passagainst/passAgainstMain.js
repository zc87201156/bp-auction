Ext.define('JDD.basedata.pass.passagainst.passAgainstMain', {
  extend: 'Ext.panel.Panel',
  title: '过关对阵',
  xtype: 'passAgainstMain',
  closable: true,
  requires : ['JDD.basedata.pass.passagainst.lotteryTree'],
  layout: {
    type: 'hbox',
    align: 'stretch'
  },
  initComponent: function () {
    this.callParent(arguments);
    var me = this;

    me.add({
      xtype: 'passAgainstLotteryTree'
    }, {
      xtype:'panel',
      closable: false,
      flex:1,
      id:'passAgainstIssuePanel',
      layout:{
        type: 'vbox',
        align: 'stretch'
      }
    });
  }
});