Ext.define("WF.maincontent.Center", {
    extend: 'Ext.tab.Panel',
    plain: true,
    alias: "widget.maincontent_center",
    region: 'center',
    autoScroll:true,
    activeTab: 0,
    plugins:Ext.create("DCIS.TabCloseMenu"),
    initComponent: function () {
        this.callParent(arguments);
        this.add(Ext.create("WF.maincontent.FirstPage"));
    }
});