Ext.define("DCIS.Proxy", {
    extend: "Ext.data.proxy.Ajax",
    alias: 'proxy.dcisproxy',
    buildRequest: function (operation) {
		var baseParams=operation.params ;
		var extraParams=this.extraParams;
		var params=null;
		if (!(Ext.typeOf(extraParams)=="array")){
			params=Ext.applyIf(baseParams||{},extraParams||{});
		}
		else{
			if (baseParams!=null){
				params=baseParams;
			}
			else if (extraParams!=null){
				params=extraParams;
			}
		}
		if (params==null){
			params={};
		}
        //var params = Ext.applyIf(operation.params || {}, this.extraParams || {}),
        var    request;

        //copy any sorters, filters etc into the params so they can be sent over the wire
        var dataParams = this.getParams(operation);
        dataParams.data = params;
        params = dataParams;

        params.isDataFormat = true;

        if (operation.id && !params.id) {
            params.id = operation.id;
        }

        request = Ext.create('Ext.data.Request', {
            params: params,
            action: operation.action,
            records: operation.records,
            operation: operation,
            url: operation.url
        });

        request.url = this.buildUrl(request);

        if (this.needBaseUrl == null || this.needBaseUrl == true) {
            request.url = baseUrl +request.url;
        }

        /*
        * Save the request on the Operation. Operations don't usually care about Request and Response data, but in the
        * ServerProxy and any of its subclasses we add both request and response as they may be useful for further processing
        */
        operation.request = request;

        return request;
    },
    doRequest: function (operation, callback, scope) {
        var writer = this.getWriter(),
            request = this.buildRequest(operation, callback, scope);

        if (operation.allowWrite()) {
            request = writer.write(request);
        }

        Ext.apply(request, {
            headers: this.headers,
            timeout: this.timeout,
            scope: this,
            callback: this.createRequestCallback(request, operation, callback, scope),
            method: this.getMethod(request),
            success:function(response){
        		var text = response.responseText;
            },
            disableCaching: false // explicitly set it to false, ServerProxy handles caching
        });

        var data = request.params;
        delete request.params;
        
        if (this.pageSize!=null){
        	data.limit=this.pageSize;
        }

        if (data != null) {
            request.jsonData = data;
            request.method = "POST";
        }
        


        Ext.Ajax.request(request);

        return request;
    }
});