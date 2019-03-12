Ext.define('WF.view.categoryGoods.editCategoryGoods', {
    extend: 'Ext.window.Window',
    alias: 'editCategoryGoods',
    title: '编辑',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        //类目名称关联
        var categoryStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/categoryConfig/getAll',
            fields: ['id', 'name']
        });
        //商品ID和商品名称关联
        var goodsStore = Ext.create('DCIS.Store', {
            autoLoad: true,
            url: 'auction/admin/goods/getAll',
            fields: ['id', 'name']
        });
        me.add({
            xtype: 'dataform',
            baseCls: 'x-plain',
            border: true,
            columns: 2,
            items: [{
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
            }, {
                afterLabelTextTpl: required,
                name: 'sort',
                xtype: 'numberfield',
                allowDecimals: false,
                allowBlank: false,
                colspan: 1,
                fieldLabel: '序号'
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
            callapi('/auction/admin/categoryGoods/save', form.getValues(),
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