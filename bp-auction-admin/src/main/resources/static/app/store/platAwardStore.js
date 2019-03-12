Ext.define("WF.store.platAwardStore", {
    extend: "DCIS.Store",
    url: '/landlords/admin/common/data/getPlatAwards.do',
    fields: [
        {name: 'id', type: 'int', display: '奖品ID', show: true},
        {name: 'awardName', type: 'string', display: '奖品名称', show: true}],
    autoLoad: true
});