Ext.define("WF.maincontent.North", {
	extend : "Ext.panel.Panel",
	alias : "widget.maincontent_north",
	height : 45,
	bodyCls : "north",
	region : "north",
	border : false,
	html : '<div id="head">'
			+ '<div id="logo" class="FONT">必拍管理中心</div>'
			+ '<div id="inform"><ul><li><a>欢迎访问！'
			+ '</a>'
			+ '</li><li><a><img src="./resources/images/icon1.jpg" width="21" height="22" />'+$USER.loginName
			+ '</a>'
			+ '</li> <li><a href="javascript:WF.maincontent.North.logMain()"><img src="./resources/images/icon2.jpg" width="21" height="22" />主页</a> </li><li><a href="javascript:WF.maincontent.North.logOut()"><img src="./resources/images/icon3.jpg" width="21" height="22" />退出</a></li></ul></div>'
			+ '</div>',
	statics : {
		logOut : function() {
			callapi("admin/home/loginout",{},
					function (result) {
						if (result == true) {
							window.location.href = $loginOutUrl;
						}
					});
		},
		reload : function() {
			
		},
		logMain : function() {
			
		}
	},
	initComponent : function() {
	   this.callParent(arguments);
		   var me=this;
	}
});
