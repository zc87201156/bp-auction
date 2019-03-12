//主程序入口点
Ext.onReady(function () {
    Ext.application({
        name: 'WF',
        requires: ["WF.Main"],
        appFolder: 'app',
        launch: function () {
        	window.applicationName='WF';
            Ext.create("WF.Main");
        }
    });
});
