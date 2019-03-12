Ext.define("DCIS.DataTreeGrid", {
    extend: "Ext.tree.Panel",
    alias: "widget.dataTreeGrid",
    columnLines: true,
    bodyBorder: false,
    flex: 1,
 	rootVisible : false,
	root : {
		id : this.rootId,
		text : this.rootText,
		expanded : true,
		leaf : false
	},
	initComponent : function() {
	var me=this;
	var store=Ext.create('Ext.data.TreeStore', {
							autoLoad : true,
							proxy : {
								type : "ajax",
								url : me.url,
								nodeParam : me.nodeParam
							},
							viewConfig : {
								loadingText : "加载数据..."
							}
						});
	me.store=store;
	},
	bbar : [{ xtype: 'tbfill' }, {
                xtype: "pagingtoolbar",
                displayInfo: true,
                isShowRefresh:true,
                store: DCIS.StoreMgr.get(this.PandingStore),
                border: false
            }, { xtype: 'tbfill'}]
});