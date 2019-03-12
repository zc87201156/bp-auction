Ext.define('JDD.basedata.lottery.issueagainst.issueAgainstMain', {
  extend: 'Ext.panel.Panel',
  title: '期次对阵',
  xtype: 'issueAgainstMain',
  closable: true,
  requires : ['JDD.basedata.lottery.issueagainst.lotteryTree'],
  layout: {
    type: 'hbox',
    align: 'stretch'
  },
  // autoScroll: true,
  initComponent: function () {
    this.callParent(arguments);
    var me = this;

    me.add({
      xtype: 'lotteryTree'
    }, {
      xtype:'panel',
      closable: false,
      flex:1,
      id:'issuePanel',
      layout:{
        type: 'vbox',
        align: 'stretch'
      }
    });
  }
});