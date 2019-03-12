Ext.define('JDD.basedata.marketing.activity.addBasedataActivityRecommendMatch', {
    extend: 'Ext.window.Window',
    alias: 'addBasedataActivityRecommendMatch',
    title: '新增活动赛事推荐管理',
    modal: true,
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
                xtype: 'datetimefield',
                format: 'Y-m-d H:i:s',
                name: 'startTime',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '开始时间'
            }, {
                xtype: 'datetimefield',
                format: 'Y-m-d H:i:s',
                name: 'endTime',
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '结束时间'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '彩种名称:',
                //labelWidth: 100,
                width: 220,
                colspan: 2,
                items: [
                    {boxLabel: '竞彩足球', name: 'lotteryId', inputValue: '90', checked: true},
                    {boxLabel: '竞彩篮球', name: 'lotteryId', inputValue: '91'}
                ],
                listeners: {
                    change: function (field, b, c) {
                        var ch = field.getChecked();
                        var lotteryId = ch[0].inputValue;
                        if (90 == lotteryId) {
                            me.down("[name='jczqQueryId']").setDisabled(false);
                            me.down("[name='jclqQueryId']").setDisabled(true);
                        } else if (91 == lotteryId) {
                            me.down("[name='jczqQueryId']").setDisabled(true);
                            me.down("[name='jclqQueryId']").setDisabled(false);
                        }
                    }
                }
            }, {
                xtype: "searchfield",
                store: 'jczqStore',
                displayField: 'id',
                valueField: 'id',
                name: 'jczqQueryId',
                pageSize: 10,
                //disabled: true,
                fieldLabel: '竞彩足球比赛',
                emptyText: "主队名称:客队名称",

                colspan: 1,

                //labelWidth: 100,
                width: 250,
                listeners: {
                    change: function (field, b, c) {
                        var val = field.getValue();
                        //alert(val);
                        callapi('basedata/private/basedataMatchJczqController/findBasedataMatchJczq.do', {
                            matchId: val
                        }, function (result) {
                            if (result.success) {
                                me.down("[name='hostTeam']").setValue(result.data.hostTeam);
                                me.down("[name='visitTeam']").setValue(result.data.visitTeam);
                                me.down("[name='issueMatchName']").setValue(result.data.issueMatchName);
                                me.down("[name='matchId']").setValue(result.data.matchId);
                                //me.down("[name='queryId']").setValue("");
                                //alert(result.data.issueMatchName);
                            } else {
                                me.down("[name='hostTeam']").setValue("");
                                me.down("[name='visitTeam']").setValue("");
                                me.down("[name='issueMatchName']").setValue("");
                                me.down("[name='matchId']").setValue("");
                            }
                        }, null, null, false);
                    }
                }
            }, {
                xtype: "searchfield",
                store: 'jclqStore',
                displayField: 'id',
                valueField: 'id',
                name: 'jclqQueryId',
                pageSize: 10,
                disabled: true,
                fieldLabel: '竞彩篮球比赛',
                emptyText: "主队名称:客队名称",

                colspan: 1,

                //labelWidth: 100,
                width: 250,
                listeners: {
                    change: function (field, b, c) {
                        var val = field.getValue();
                        //alert(val);
                        callapi('basedata/private/basedataMatchController/findBasedataMatchJclq.do', {
                            matchId: val
                        }, function (result) {
                            if (result.success) {
                                me.down("[name='hostTeam']").setValue(result.data.hostTeam);
                                me.down("[name='visitTeam']").setValue(result.data.visitTeam);
                                me.down("[name='issueMatchName']").setValue(result.data.issueMatchName);
                                me.down("[name='matchId']").setValue(result.data.matchId);
                                //me.down("[name='queryId']").setValue("");
                                //alert(result.data.issueMatchName);
                            } else {
                                me.down("[name='hostTeam']").setValue("");
                                me.down("[name='visitTeam']").setValue("");
                                me.down("[name='issueMatchName']").setValue("");
                                me.down("[name='matchId']").setValue("");
                            }
                        }, null, null, false);
                    }
                }
            }, {
                name: 'matchId',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '比赛id'
            }, {
                name: 'issueMatchName',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '比赛编号'
            }, {
                name: 'hostTeam',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '主队'
            }, {
                name: 'visitTeam',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '客队'
            }, {
                name: 'hostTeamImgUrl',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '主队图片'
            }, {
                xtype: 'button',
                text: '上传图片',
                iconCls: "icon-upload",
                colspan: 1,
                width: 80,
                handler: function () {
                    var me = this;
                    uploadPicture("basedata/private/picture/uploadPicture.do", function (re) {
                        var dataform = me.up('dataform');
                        dataform.down("[name='hostTeamImgUrl']").setValue(re.data);
                    })
                }
            }, {

                name: 'visitTeamImgUrl',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '客队图片'
            }, {
                xtype: 'button',
                text: '上传图片',
                iconCls: "icon-upload",
                colspan: 1,
                width: 80,
                handler: function () {
                    var me = this;
                    uploadPicture("basedata/private/picture/uploadPicture.do", function (re) {
                        var dataform = me.up('dataform');
                        dataform.down("[name='visitTeamImgUrl']").setValue(re.data);
                    })
                }
            }, {
                colspan: 2,
                xtype: 'radiogroup',
                fieldLabel: '推荐玩法:',
                width: 400,
                items: [
                    {boxLabel: '推荐2串1', name: 'recommendType', inputValue: '0', checked: true},
                    {boxLabel: '推荐单关', name: 'recommendType', inputValue: '1'},
                    {boxLabel: '推荐赛事', name: 'recommendType', inputValue: '2'}
                ]
            }, {
                colspan: 2,
                xtype: 'radiogroup',
                fieldLabel: '让球:',
                width: 200,
                items: [
                    {boxLabel: '让球', name: 'rq', inputValue: '1', checked: true},
                    {boxLabel: '不让球', name: 'rq', inputValue: '0'}
                ]
            }, {
                name: 'cardTitle',
                colspan: 2,
                fieldLabel: '卡片标题'
            }, {
                name: 'title',
                colspan: 2,
                fieldLabel: '标题'
            }, {
                name: 'content',
                colspan: 2,
                fieldLabel: '内容'
            }, {
                colspan: 2,
                xtype: 'radiogroup',
                fieldLabel: '使用状态:',
                width: 200,
                items: [
                    {boxLabel: '启用', name: 'useStatus', inputValue: '1', checked: true},
                    {boxLabel: '禁用', name: 'useStatus', inputValue: '0'}
                ]
            }, {
                xtype: 'hidden',
                name: 'delStatus',
                value: 0
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
            var store = currentWindow.store;
            callapi("/basedata/private/basedataActivityRecommendMatchController/saveBasedataActivityRecommendMatch.do", form.getValues(),
                function (result) {
                    if (result.success) {
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "保存成功",
                            modal: true,
                            icon: Ext.Msg.INFO,
                            buttons: Ext.Msg.OK
                        });
                        store.load();
                        currentWindow.close();
                    }
                    else {
                        Ext.Msg.show({
                            title: '错误',
                            msg: '保存失败!',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            modal: true
                        });
                    }
                });
        }
    }]
});