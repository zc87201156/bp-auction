Ext.define('WF.view.auction.editAuction', {
    extend: 'Ext.window.Window',
    alias: 'editAuction',
    title: '编辑',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var goodsStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/goods/getAll',
            fields: ['id','name']
        });
        var environmentStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/common/data/environmentList',
            fields: ['id','name']
        });
        var auctionClassStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/common/data/auctionClassList',
            fields: ['id','name']
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
                name: 'auctionClass',
                xtype: 'combo',
                allowBlank: false,
                colspan: 1,
                editable: false,
                readOnly:true,
                store: auctionClassStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '场次类型',
                listeners: {
                    change : function(field, newValue, oldValue) {
                        //只有暗拍场显示拍卖结束时间
                        if (newValue == 4) {
                            me.down("[name='endTime']").show();
                        } else {
                            me.down("[name='endTime']").hide();
                        }
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
            },{
                afterLabelTextTpl: required,
                name: 'goodsId',
                xtype: 'combo',
                allowBlank: false,
                colspan: 1,
                editable: false,
                store: goodsStore,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                fieldLabel: '商品'
            },{
                afterLabelTextTpl: required,
                name: 'startTime',
                xtype: 'datetimefield',
                allowBlank: false,
                colspan: 1,
                editable: false,
                format: 'Y-m-d H:i:s',
                fieldLabel: '拍卖开始时间'
            },{
                name: 'endTime',
                xtype: 'datetimefield',
                allowBlank: true,
                colspan: 1,
                editable: false,
                format: 'Y-m-d H:i:s',
                fieldLabel: '拍卖结束时间',
                listeners: {
                    afterrender: function(obj) {
                        var value = me.down("[name='auctionClass']").getValue();
                        //只有暗拍场显示拍卖结束时间
                        if (value == 4) {
                            obj.show();
                        } else {
                            obj.hide();
                        }
                    }
                }
            },{
                name: 'nextId',
                xtype: 'numberfield',
                minValue: 0,
                allowDecimals: false,
                colspan: 1,
                fieldLabel: '下一期id'
            },{
                name: 'sort',
                xtype: 'numberfield',
                minValue: 0,
                allowDecimals: false,
                colspan: 1,
                fieldLabel: '排序'
            },{
                name: 'freeEntryFee',
                xtype: 'numberfield',
                minValue: 1,
                allowDecimals: false,
                colspan: 1,
                fieldLabel: '免手续费场报名费',
                listeners: {
                    afterrender: function(obj) {
                        var value = me.down("[name='auctionClass']").getValue();
                        if (value == 3) {
                            obj.show();
                        } else {
                            obj.hide();
                        }
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
                        var value = me.down("[name='auctionClass']").getValue();
                        if (value == 3) {
                            obj.show();
                        } else {
                            obj.hide();
                        }
                    }
                }
            },{
                xtype: 'hidden',
                name: 'id'
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
            callapi('/auction/admin/auction/save', form.getValues(),
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