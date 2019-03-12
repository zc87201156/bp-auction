Ext.define('DCIS.ExtKindeditor', {
    extend: 'Ext.form.field.Text',
    alias: ['widget.kindeditor'],
    alternateClassName: 'Ext.form.KindEditor',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    afterRender: function () {
        var me = this;
        var dataform = me.up('dataform');
        me.callParent(arguments);
        if (!me.ke) {
            me.ke = KindEditor.create("#" + me.getInputId(), Ext.apply(me.kindeditorConfig, {
                height: me.height || '300px',
                width: '100%',
                afterCreate: function () {
                    me.KindEditorIsReady = true;
                },
                resizeType: 1,
                allowPreviewEmoticons: false,
                items: [
                    'source', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                    'insertunorderedlist', '|', 'image', 'multiimage', 'link'],
            }));

            //这块 组件的父容器关闭的时候 需要销毁编辑器 否则第二次渲染的时候会出问题 可根据具体布局调整
            var win = me.up('window');
            if (win && win.closeAction == "hide") {
                win.on('beforehide', function () {
                    me.onDestroy();
                });
            } else {
                var panel = me.up('panel');
                if (panel && panel.closeAction == "hide") {
                    panel.on('beforehide', function () {
                        me.onDestroy();
                    });
                }
            }
        } else {
            me.ke.html(me.getValue());
        }
    },
    setValue: function (value) {
        var me = this;
        if (!me.ke) {
            me.setRawValue(me.valueToRaw(value));
        } else {
            me.ke.html(value.toString());
        }
        me.callParent(arguments);
        return me.mixins.field.setValue.call(me, value);
    },
    getRawValue: function () {
        var me = this;
        if (me.KindEditorIsReady) {
            me.ke.sync();
        }
        v = (me.inputEl ? me.inputEl.getValue() : Ext.value(me.rawValue, ''));
        me.rawValue = v;
        return v;
    },
    destroyKindEditor: function () {
        var me = this;
        if (me.rendered) {
            try {
                me.ke.remove();
                var dom = document.getElementById(me.id);
                if (dom) {
                    dom.parentNode.removeChild(dom);
                }
                me.ke = null;
            } catch (e) {
            }
        }
    },
    onDestroy: function () {
        var me = this;
        me.destroyKindEditor();
        me.callParent(arguments);
    }
});