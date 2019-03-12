Ext.define('WF.Main', {
			extend : 'Ext.container.Viewport',
			layout : 'border',
			requires : ["WF.maincontent.North", "WF.maincontent.Center",
					"WF.maincontent.South", "WF.maincontent.West",
					"WF.maincontent.FirstPage"],
			items : [{
						xtype : "maincontent_north"
					}, {
						xtype : "maincontent_west"
					}, {
						xtype : "maincontent_south"
					}, {
						xtype : 'maincontent_center'
					}],
			initComponent : function() {
				var me = this;
				me.callParent(arguments);
				me.on("afterrender", function() {
							me.initUserEnvironment();
						});
			},
			initUserEnvironment : function(user) {
				// var west = this.query("maincontent_west")[0];
				// west.init(user);
			}
		});