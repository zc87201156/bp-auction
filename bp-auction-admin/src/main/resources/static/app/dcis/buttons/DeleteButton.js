Ext.define("DCIS.buttons.DeleteButton", {
    extend: "Ext.button.Button",
    alias: "widget.deletebutton",
    constructor: function (cfg) {
        config = {};
        Ext.apply(config, cfg);
        Ext.applyIf(config, {
            text: "删除",
            name:'deleteButton',
            iconCls: "icon-remove"
        });
        if (Ext.typeOf(config.control) == "string") {
            this.control=config.control = DCIS.StoreMgr.get(config.control);
        }
        else
        {
        	this.control=config.control;
        }
        if (config.control && !config.handler) {
            this.handler = this.deleteHandler;
        }
        this.callParent([config]);
    },
    deleteHandler: function () {
        var me = this;
        if (me.control instanceof DCIS.Store) {
            var record = me.control.getCurrentRecord();
            if (record == null) {
                Ext.MessageBox.show({
                    title: "错误",
                    msg: "请选择一条记录",
                    modal: true,
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
                return;
            }
            else {
                Ext.Msg.confirm("提示", "你确定要删除这条记录吗?", function (id) {
                    if (id == "no") {
                        return;
                    }
                    me.control.on({
                        "deleted": {
                            fn: function () {
                                me.control.remove(record);
                            },
                            single: true
                        }
                    });
                    if(me.control.parameter){
                		record.data.parameter = me.control.parameter;
                	}
                    me.control.deleteData(record.data);
                });

            }
        }
    }
});