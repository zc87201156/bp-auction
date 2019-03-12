Ext.define('JDD.basedata.pass.issue.editBasedataIssue', {
    extend: 'Ext.window.Window',
    alias: 'editBasedataIssue',
    title: '号码录入',
    modal: true,
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
                xtype: 'displayfield',
                fieldLabel: '号码示例',
                colspan: 2,
                name: 'winNumberTemplate'
            }, {
                name: 'winNumber',
                afterLabelTextTpl: required,
                allowBlank: false,
                colspan: 2,
                fieldLabel: '开奖号码',
                regexText: "请输入正确的号码"
            }, {
                name: 'winNumberVerify',
                colspan: 2,
                afterLabelTextTpl: required,
                allowBlank: false,
                fieldLabel: '再次确认',

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
                name: 'auditStatus'
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

            var datas = form.getValues();
            var winNumber = datas.winNumber;
            var winNumberVerify = datas.winNumberVerify;

            if (winNumber != winNumberVerify) {
                Ext.MessageBox.show({
                    title: "提示",
                    msg: "<div style='color:red'>两次输入必须相同</div>",
                    modal: true,
                    icon: Ext.Msg.INFO,
                    buttons: Ext.Msg.OK
                });
                return;
            }
            var store = currentWindow.store;
            callapi("/basedata/private/basedataIssuePassController/addBasedataIssueWinNumber.do", form.getValues(),
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
                            msg: result.data,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            modal: true
                        });
                    }
                });
        }
    }]
});


Ext.ux.NuberFiledFormat = Ext.extend(Ext.form.NumberField, {
    baseChars: "0123456789,",
    setValue: function (v) {
        v = typeof v == 'number' ? v : String(v).replace(this.decimalSeparator, ".").replace(/,/g, "");
        v = isNaN(v) ? '' : rendererZhMoney(v);

        //Ext.util.Format.number(this.fixPrecision(String(v)), "0,000,000.00");此为ext 4.0
        this.setRawValue(v);
        return Ext.form.NumberField.superclass.setValue.call(this, v);
    },
    /* getValue:function(){
     //alert((String(Ext.form.NumberField.superclass.getValue.call(this)).replace(",","")));
     return (String(Ext.form.NumberField.superclass.getValue.call(this)).replace(",",""));
     },
     */
    fixPrecision: function (value) {
        var nan = isNaN(value);
        if (!this.allowDecimals || this.decimalPrecision == -1 || nan || !value) {
            return nan ? '' : value;
        }
        return parseFloat(value).toFixed(this.decimalPrecision);
    },
    validateValue: function (value) {
        if (!Ext.form.NumberField.superclass.validateValue.call(this, value)) {
            return false;
        }
        if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
            return true;
        }
        value = String(value).replace(this.decimalSeparator, ".").replace(/,/g, "");
        if (isNaN(value)) {
            this.markInvalid(String.format(this.nanText, value));
            return false;
        }
        var num = this.parseValue(value);
        if (num < this.minValue) {
            this.markInvalid(String.format(this.minText, this.minValue));
            return false;
        }
        if (num > this.maxValue) {
            this.markInvalid(String.format(this.maxText, this.maxValue));
            return false;
        }
        return true;
    },
    parseValue: function (value) {
        value = parseFloat(String(value).replace(this.decimalSeparator, ".").replace(/,/g, ""));
        return isNaN(value) ? '' : value;
    }

});
/*数字千分符*/
function rendererZhMoney(v) {
    if (isNaN(v)) {
        return v;
    }
    v = (Math.round((v - 0) * 100)) / 100;
    v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v
    + "0" : v);
    v = String(v);
    var ps = v.split('.');
    var whole = ps[0];
    var sub = ps[1] ? '.' + ps[1] : '.00';
    var r = /(\d+)(\d{3})/;
    while (r.test(whole)) {
        whole = whole.replace(r, '$1' + ',' + '$2');
    }
    v = whole + sub;

    return v;
}
//注册扩展后的数字控件
Ext.reg('numberFieldFormat', Ext.ux.NuberFiledFormat);