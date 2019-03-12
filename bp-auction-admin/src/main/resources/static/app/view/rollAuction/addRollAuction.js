Ext.define('WF.view.rollAuction.addRollAuction', {
    extend: 'Ext.window.Window',
    alias: 'addRollAuction',
    title: '新增',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        //环境名称
        var environmentStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/common/data/environmentList',
            storeId: 'environmentStore',
            fields: ['id', 'name']
        });
        //类目名称关联
        var categoryStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'categoryStore',
            url: 'auction/admin/categoryConfig/getAll',
            fields: ['id', 'name']
        });
        //滚拍类型
        var rollAuctionTypeStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            storeId: 'rollAuctionTypeStore',
            url: 'auction/admin/common/data/rollAuctionTypeList',
            fields: ['id', 'name']
        });
        var yesOrNoStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {"id": 0, "name": "否"},
                {"id": 1, "name": "是"}
            ]
        });
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 2,
            items: [{
                afterLabelTextTpl: required,
                name: 'environment',
                xtype: 'combo',
                allowBlank: false,
                colspan: 1,
                editable: false,
                store: environmentStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '所属环境'
            },{
                afterLabelTextTpl: required,
                name: 'canDeposit',
                xtype: 'combo',
                allowBlank: false,
                colspan: 1,
                editable: false,
                store: yesOrNoStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '是否支持托管'
            }, {
                afterLabelTextTpl: required,
                name: 'type',
                xtype: 'combo',
                allowBlank: false,
                colspan: 1,
                editable: false,
                store: rollAuctionTypeStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '滚拍类型',
                listeners: {
                    change : function(field, newValue, oldValue) {
                        //只有免手续费场显示免手续报名费和加价幅度
                        if (newValue == 3) {
                            me.down("[name='freeEntryFee']").show();
                            me.down("[name='freeRaisePrice']").show();
                        } else {
                            me.down("[name='freeEntryFee']").hide();
                            me.down("[name='freeRaisePrice']").hide();
                        }
                    }
                }
            },{
                afterLabelTextTpl: required,
                name: 'categoryId',
                xtype: 'combo',
                allowBlank: false,
                colspan: 1,
                editable: false,
                store: categoryStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '类目'
            }, {
                name: 'period',
                xtype: 'numberfield',
                afterLabelTextTpl: required,
                allowBlank: false,
                minValue: 1,
                allowDecimals: false,
                colspan: 1,
                fieldLabel: '滚拍每期时间间隔(秒)'
            }, {
                name: 'turns',
                xtype: 'numberfield',
                afterLabelTextTpl: required,
                allowBlank: false,
                minValue: -1,
                allowDecimals: false,
                colspan: 1,
                fieldLabel: '轮数限制(-1不限制)'
            }, {
                afterLabelTextTpl: required,
                name: 'startTime',
                xtype: 'datetimefield',
                allowBlank: false,
                colspan: 1,
                editable: false,
                format: 'H:i:s',
                fieldLabel: '滚拍开始时间'
            }, {
                afterLabelTextTpl: required,
                name: 'endTime',
                xtype: 'datetimefield',
                allowBlank: false,
                colspan: 1,
                editable: false,
                format: 'H:i:s',
                fieldLabel: '滚拍结束时间'
            }, {
                name: 'freeEntryFee',
                xtype: 'numberfield',
                minValue: 1,
                allowDecimals: false,
                colspan: 1,
                fieldLabel: '免手续费场报名费',
                listeners: {
                    afterrender: function(obj) {
                        //默认隐藏
                        obj.hide();
                    }
                }
            },{
                name: 'freeRaisePrice',
                xtype: 'numberfield',
                minValue: 0.01,
                allowDecimals: true,
                decimalPrecision: 2,
                colspan: 1,
                fieldLabel: '免手续费场加价幅度',
                listeners: {
                    afterrender: function(obj) {
                        //默认隐藏
                        obj.hide();
                    }
                }
            },{
                name: 'sort',
                xtype: 'numberfield',
                minValue: 0,
                allowDecimals: false,
                colspan: 1,
                fieldLabel: '排序'
            }]
        });
    },
    buttons: [{
        text: '保存',
        iconCls: "icon-ok",
        handler: function () {
            var currentWindow = this.up('window');
            var form = currentWindow.down('dataform').getForm();
            if (!form.isValid()) {
                return;
            }
            var doRefresh = currentWindow.doRefresh;
            callapi('/auction/admin/rollAuction/save', form.getValues(),
                function (result) {
                    if (result.success) {
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "保存成功",
                            modal: true,
                            icon: Ext.Msg.INFO,
                            buttons: Ext.Msg.OK
                        });
                        doRefresh.reload();
                        currentWindow.close();
                    }
                    else {
                        Ext.Msg.show({
                            title: '错误',
                            msg: result.message,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            modal: true
                        });
                    }
                });
        }
    }]
});