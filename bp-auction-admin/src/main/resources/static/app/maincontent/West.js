Ext.define("WF.maincontent.West", {
    extend: "Ext.panel.Panel",
    alias: "widget.maincontent_west",
    region: 'west',
    collapsible: true,
    title: '功能菜单',
    split: true,
    width: 180,
    defaults: {
        bodyStyle: 'padding:5px 0px 10px 0px'
    },
    layout: {
        type: 'accordion',
        titleCollapse: false,
        animate: false
    },
    tools: [{
        id: 'help',
        qtip: '用户手册',
        handler: function () {
        }
    }],
    animate: false,
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        var buttonStore = Ext.create("DCIS.Store", {
            autoLoad: true,
            url: 'admin/home/listButton?systemId=' + $systemId,
            fields: ['menuCode', 'link', 'sort', 'disabled']
        });
        callapi("admin/home/listModule", {
            root: $systemId
        }, function (result) {
            var gr = result;
            for (var i = 0; i < gr.length; i++) {
                var panel = Ext.create("Ext.tree.Panel", {
                    title: gr[i].text,
                    rootVisible: false,
                    icon: gr[i].icon,
                    titleCollapse: true,
                    store: Ext.create('Ext.data.TreeStore', {
                        proxy: {
                            type: 'ajax',
                            url: 'admin/home/listMenu'
                        },
                        nodeParam: 'code',
                        root: {
                            expanded: false,
                            text: gr[i].text,
                            id: gr[i].code,
                            leaf: false
                        },
                        autoLoad: true,
                        fields: ['id', 'text', 'leaf', 'icon', 'expanded', 'moduleLink', 'billType', 'parameters']
                    }),
                    listeners: {
                        cellclick: function (tree, td, cellIndex,
                                             record, tr, rowIndex, e, eo) {
                            if (record.data.leaf == true) {
                                me.itemClick(record, buttonStore);
                            }
                        }
                    }
                });
                me.add(panel);
            }
        });
    },
    itemClick: function (rec, buttonStore) {
        var re = rec.data;
        var className = re.moduleLink;
        var center = Ext.ComponentQuery.query("maincontent_center")[0];
        if (className == "" || className == null) {
            var pa = Ext.create("WF.maincontent.undefinded", {
                title : re.text
            });
            center.add(pa);
            center.setActiveTab(pa);
        } else {
            var arr = className.split('.');
            var alias = arr[arr.length - 1];
            if (alias == "" || alias == null) {
                var pa = Ext.create("WF.maincontent.undefinded", {
                    title : re.text
                });
                center.add(pa);
                center.setActiveTab(pa);
            } else {
                var loading = new Ext.LoadMask(center, {
                    msg : '页面加载中，请稍等...'
                });
                loading.show();
                var panelQuery = Ext.ComponentQuery.query(alias);
                if (panelQuery.length == 0) {
                    try {
                        var tbar = Ext.create("Ext.toolbar.Toolbar");
                        buttonStore.clearFilter(true);
                        buttonStore.filter('menuCode', re.id);
                        buttonStore.sort('sort', 'ASC');
                        //console.log('first->' + buttonStore.getCount());
                        buttonStore.each(function(rcd){
                            var clsName = rcd.data.link;
                            if (clsName != "" && clsName != null) {
                                tbar.add(Ext.create(clsName, {disabled: rcd.data.disabled}));
                            }
                            return true;
                        });

                        var panel = Ext.create(className, {
                            tbar: tbar,
                            title : rec.parentNode.data.text + '-'
                            + re.text,
                            billType : re.billType,
                            parameters : re.parameters,
                            icon : re.icon,
                            menuCode : re.id
                        });
                        center.add(panel);
                        center.setActiveTab(panel);
                        loading.hide();
                    } catch (e) {
                        window.console && console.log(e);
                    }

                } else {
                    for (var i = 0; i < panelQuery.length; i++) {
                        var ltype = panelQuery[i].billType;
                        var ftype = re.billType;
                        if (ltype == null) {
                            ltype = ""
                        }
                        if (ftype == null) {
                            ftype = ""
                        }
                        if (ltype == ftype) {
                            center.setActiveTab(panelQuery[i]);
                            loading.hide();
                            return;
                        }
                    }
                    try {
                        var tbar = Ext.create("Ext.toolbar.Toolbar");
                        buttonStore.clearFilter(true);
                        buttonStore.filter('menuCode', re.id);
                        buttonStore.sort('sort', 'ASC');
                        buttonStore.each(function(rcd){
                            var clsName = rcd.data.link;
                            if (clsName != "" && clsName != null) {
                                tbar.add(Ext.create(clsName, {disabled: rcd.data.disabled}));
                            }
                        });
                        var panel = Ext.create(className, {
                            tbar: tbar,
                            title : rec.parentNode.data.text + '-'
                            + re.text,
                            billType : re.billType,
                            parameters : re.parameters,
                            icon : re.icon,
                            menuCode : re.id
                        });
                        center.add(panel);
                        center.setActiveTab(panel);
                        loading.hide();
                        return;
                    } catch (e) {}
                }
            }
        }

    }
});