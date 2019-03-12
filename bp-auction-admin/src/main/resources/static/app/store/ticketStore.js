Ext.define("WF.store.ticketStore", {
    extend: "DCIS.Store",
    url: '/landlords/admin/activity/awardticket/searchlist.do',
    fields: [
        {name: 'id', type: 'int', display: '奖券ID', show: true},
        {name: 'name', type: 'string', display: '奖券名称', show: true}],
    autoLoad: true
});