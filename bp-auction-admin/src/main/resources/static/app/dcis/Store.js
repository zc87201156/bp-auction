Ext.define("DCIS.Store", {
    extend: "Ext.data.JsonStore",
    alias: "widget.dcisstore",
	pageSize:20,
	baseParams:null,
    constructor: function (cfg) {
        var me = this;
        var config = Ext.apply({}, cfg);
        this.url = config.url = config.url || this.url;
        this.baseParams=config.baseParams;
        this.model = config.model = config.model || this.mode
        if (this.model == null) {
            delete this.model;
            delete config.model;
            config.fields = config.fields || this.fields;
        }
        if (config.data != null || this.data != null) {
            Ext.applyIf(config, {
                proxy: {
                    type: "memory",
                     extraParams:config.baseParams,
                    reader: { type: "json" },
                    writer: "json"
                }
            });
        }
        else {
            Ext.applyIf(config, {
                proxy: {
                    type: "dcisproxy",
                    url: config.url,
                    extraParams:config.baseParams,
                    reader: {
                        type: "json",
                        idProperty: "ID",
                        root: "data",
                        listeners: {
                            "exception": function (aaa, bbb, ccc, ddd) {
                                //alert(ccc.message);
                            }
                        }
                    },
                    writer: "json"
                }
            });
        }


        if (this.model != null && typeof config.model == 'string') {
            Ext.syncRequire(config.model);
        }
        if (config.needPage == false) {
            config.proxy.pageParam = undefined;
            config.proxy.startParam = undefined;
            config.proxy.limitParam = undefined;
        }
        
        if (config.pageSize!=null){
        	this.pageSize = config.pageSize;
       }
        
        this.callParent([config]);
               
    },
    listeners: {
        beforeLoad: { 
    		fn: function (store, operation, eOpts) {
	            if (store.isLoadPage==true){
	            	store.isLoadPage=false;
	            	return;
	            }
	            if (this.pageSize!=null){
	        		this.getProxy().pageSize = this.pageSize;
	       		}
	            operation.page=1;
	            operation.start=0;
	            
	            store.currentPage=1;
	        }, 
	        scope: this
        },
        'load':function(aa,bb,cc,dd){
        	var x=1;
        }
    },
    initComponent:function(){
    	this.callParent(arguments);
    	        if (this.pageSize!=null){
        	this.getProxy().pageSize = this.pageSize;
       }
    },
    loadPage:function(){
    	this.isLoadPage=true;
    	this.callParent(arguments);
    },
    getCurrentRecords: function () {
        return this.currentRecords;
    },
       setBaseParams: function (a) {
        return this.baseParams=a;
    },
    getCurrentRecord: function () {
        if (this.currentRecords == null) {
            return null;
        }
        else if (this.currentRecords instanceof Array) {
            return this.currentRecords[0];
        }
        else {
            return this.currentRecords;
        }
    },
    setCurrentRecords: function (items) {
        if (items == null || items.length == 0) {
            this.currentRecords = null;
        }
        this.currentRecords = items;
    },
    addData: function (values, applyValues, fn, error) {
        callapi(this.addUrl, values, function (result) {
        	if(result!=null)
        	{
	        	if(result!=false)
	        	{
		            Ext.apply(values, applyValues);
		            Ext.apply(values, result);
		            var model = Ext.create(this.model, values);
		            this.insert(0, model);
		            model.commit();
		            this.fireEvent("added", result);
                    Ext.MessageBox.alert('提示','新增成功!');
            		Ext.Function.defer(function(){
					    Ext.MessageBox.hide();//两秒后关闭
					}, 1000);
		            if (fn) {
		                fn(result);
		            }
		            this.fireEvent('afterAdded',result);
	            }
	            else{
	        		Ext.Msg.show({
						title : '错误',
						msg : '保存失败!',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR,
						modal:true
					});
	        	}
        	}
        	else{
    		 	Ext.apply(values, applyValues);
	            Ext.apply(values, result);
	            var model = Ext.create(this.model, values);
	            this.insert(0, model);
	            model.commit();
	            this.fireEvent("added", result);
	            if (fn) {
	                fn(result);
	            }   
        	}
        }, this, error);
    },
    updateData: function (values, applyValues, fn, error) {
        callapi(this.updateUrl, values, function (result) {
        	if(result!=null){
        		if(result!=false){
            		this.fireEvent("updated", result);
            		Ext.MessageBox.alert('提示','修改成功!');
            		Ext.Function.defer(function(){
					    Ext.MessageBox.hide();
					}, 1000);
					
             		if (fn) {
                		fn(result);
            		}
            		this.fireEvent('afterUpdated',result);
            	}
        		else{
        			Ext.Msg.show({
						title : '错误',
						msg : '修改失败!',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR,
					 	modal:true
					});
          		}
        	}
            else{
            	this.fireEvent("updated", result);
            }
        }, this, error);
    },
    deleteData: function (values, applyValues, fn, error) {
        callapi(this.deleteUrl, values, function (result) {
        	if(result){
        		this.fireEvent("deleted", result);
	            Ext.MessageBox.alert('提示','删除成功!');
	            Ext.Function.defer(function(){
					Ext.MessageBox.hide();
				}, 1000);
	            if (fn) {
	                fn(result);
	            }
	            this.fireEvent('afterDeleted',values);
        	} else {
	            Ext.MessageBox.alert('提示','删除失败!');
	            Ext.Function.defer(function(){
					Ext.MessageBox.hide();
				}, 1000);
	            if (fn) {
	                fn(result);
	            }
        	}
        }, this, error);
    }
});