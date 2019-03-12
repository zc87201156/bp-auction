Ext.define("WF.store.platAwardTypeStore", {
    extend: "DCIS.Store",
    url: '/landlords/admin/activity/plataward/searchlist.do',
    fields: [
        {name: 'awardsType', type: 'int', display: '奖品类型ID', show: true},
        {name: 'awardsTypeName', type: 'string', display: '奖品类型名称', show: true}],
    autoLoad: true
});