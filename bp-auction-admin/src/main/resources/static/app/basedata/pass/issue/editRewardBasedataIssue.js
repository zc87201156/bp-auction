Ext.define('JDD.basedata.pass.issue.editRewardBasedataIssue', {
    extend: 'Ext.window.Window',
    alias: 'addBanner',
    modal: true,
    title: '开奖信息录入',
    width: 1000,
    height: 600,
    autoScroll: true,
    resizable: false,
    Say: function (msg) {
        this.title = msg;
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 2,
            items: [{
                //xtype: 'numberfield',
                //xtype: "numberFieldFormat",
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'sales',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '本期销量',
                value: me.sales,
                regex: /^(\d)*(.\d{0,2})?$|^(\d{0,3}(,\d{3})*)(.\d{0,2})?$/,
                regexText: "请输入正确的数字"
            }, {
                //xtype: 'numberfield',
                allowDecimals: false,
                decimalPrecision: 0,
                name: 'rolling',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '本期滚存',
                value: me.rolling,
                regex: /^(\d)*(.\d{0,2})?$|^(\d{0,3}(,\d{3})*)(.\d{0,2})?$/,
                regexText: "请输入正确的数字"
            }, {
                xtype: 'hidden',
                name: 'lotteryId'
            }, {
                xtype: 'hidden',
                name: 'issueId'
            }, {
                xtype: 'hidden',
                name: 'issueName'
            }, {
                xtype: 'hidden',
                name: 'winNumber'
            }, {
                xtype: 'hidden',
                name: 'auditStatus'
            }]
        });

        var rewardStore = Ext.create('DCIS.Store', {
            url: '/basedata/private/basedataIssuePassController/listBasedataWinType.do',
            autoLoad: true,
            baseParams: {lotteryId: me.lotteryId, issueId: me.issueId},
            fields: ['id', 'issueId', 'wintypeId', 'wintypeName', 'floatWinningsStatus', 'defaultWinmoney', 'defaultWinmoneyNotax', 'winCount', 'updateTime']
        });
        me.add({
            xtype: 'grid',
            store: rewardStore,
            name: 'giftBag',
            forceFit: true,
            listeners: {
                edit: function (edit, e) {
                    var re = e.record;
                    var tax = re.data.defaultWinmoney;
                    tax = tax.split(',').join('');
                    //alert(tax);
                    //alert(parseFloat(tax.replace(',', "")));
                    if (tax >= 10000) {
                        tax = tax * 0.8
                        tax = tax.toFixed(0);
                    }
                    re.set("defaultWinmoneyNotax", tax);
                    re.commit();
                }
            },
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                })
            ],
            columns: [{
                menuDisabled: true,
                text: '奖项名称',
                dataIndex: 'wintypeName'
            }, {
                menuDisabled: true,
                text: '税前奖金',
                dataIndex: 'defaultWinmoney',
                tdCls: 'caneditcolumn',
                sortable: true,
                field: {
                    //xtype: 'numberfield',
                    allowDecimals: true,
                    decimalPrecision: 4,
                    afterLabelTextTpl: required,
                    allowBlank: false,
                    value: 0,
                    regex: /^(\d)*$|^(\d{0,3}(,\d{3})*)$/,
                    regexText: "请输入正确的数字"
                }
            }, {
                menuDisabled: true,
                text: '税后奖金',
                id: 'defaultWinmoneyNotax',
                dataIndex: 'defaultWinmoneyNotax',
                tdCls: 'caneditcolumn'
            }, {
                menuDisabled: true,
                text: '中奖注数',
                dataIndex: 'winCount',
                tdCls: 'caneditcolumn',
                field: {
                    //xtype: 'numberfield',
                    allowDecimals: false,
                    style: "color:red;",
                    afterLabelTextTpl: required,
                    allowBlank: false,
                    regex: /^(\d)*$|^(\d{0,3}(,\d{3})*)$/,
                    regexText: "请输入正确的数字"
                }
            }]

        });
        me.down('grid').getSelectionModel().on('selectionchange', function (selModel, selections) {
            me.down('[name="buttonPanel"]').down('[name="removeGoods"]').setDisabled(selections.length === 0);
        }, this);
    },
    buttons: [{
        text: '保存',
        name: 'btnSave',
        iconCls: "icon-save",
        handler: function () {
            var currentWindow = this.up('window');
            var form = currentWindow.down('dataform').getForm();
            if (!form.isValid()) {
                return;
            }
            var datas = form.getValues();
            var sales = datas.sales + "";
            var rolling = datas.rolling + "";
            datas.sales = sales.split(',').join('');
            datas.rolling = rolling.split(',').join('');
            var selectedGoodsStore = currentWindow.down('grid').getStore();
            if (selectedGoodsStore.getCount() == 0) {
                Ext.MessageBox.show({
                    title: "提示",
                    msg: "至少要有一个奖项!",
                    modal: true,
                    icon: Ext.Msg.INFO,
                    buttons: Ext.Msg.OK
                });
                return;
            }

            var giftGoods = [];
            for (var i = 0; i < selectedGoodsStore.getCount(); i++) {
                var goods = selectedGoodsStore.getAt(i);
                //fields: ['id', 'issueId', 'wintypeId', 'wintypeName', 'defaultWinmoney', 'defaultWinmoneyNotax', 'winCount', 'updateTime']

                var defaultWinmoney = goods.data.defaultWinmoney + "";
                var defaultWinmoneyNotax = goods.data.defaultWinmoneyNotax + "";
                var winCount = goods.data.winCount + "";
                defaultWinmoney = defaultWinmoney.split(',').join('');
                defaultWinmoneyNotax = defaultWinmoneyNotax.split(',').join('');
                winCount = winCount.split(',').join('');
                //alert(winCount.split(',').join(''));
                giftGoods.push({
                    id: goods.data.id,
                    defaultWinmoney: defaultWinmoney,
                    defaultWinmoneyNotax: defaultWinmoneyNotax,
                    winCount: winCount,
                    wintypeId: goods.data.wintypeId,
                    issueId: goods.data.issueId
                });
            }
            datas.rewards = giftGoods;

            var loading = new Ext.LoadMask(currentWindow, {
                msg: '保存中，请稍等...'
            });
            loading.show();
            var store = currentWindow.store;

            callapi("/basedata/private/basedataIssuePassController/addBasedataIssuePassReward.do", datas,
                function (result) {
                    if (result.success) {
                        Ext.Msg.show({
                            title: "提示",
                            msg: "保存成功",
                            modal: true,
                            icon: Ext.Msg.INFO,
                            buttons: Ext.Msg.OK
                        });
                        store.load();
                        currentWindow.close();
                    } else {
                        Ext.Msg.show({
                            title: '错误',
                            msg: result.data,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            modal: true
                        });
                    }
                    loading.hide();
                });
        }
    }, {
        text: '取消',
        iconCls: "icon-no",
        handler: function () {
            this.up('window').close();
        }
    }]
});