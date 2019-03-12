Ext.define('DCIS.SearchWindow',{
	extend:'Ext.window.Window',
	title:'请选择:(pageup:上一页 pagedown:下一页)',
	alias:'widget.searchwindow',
	resizable: false,
	modal:true,
	store:null,
	width:500,
	pageSize:null,
	config: {
        displayField: null,
        valueField: null,
        baseParams:null
    },
	constructor: function (cfg) {
		var config = {};
        Ext.apply(config, cfg);
        if (config.store) {
        	this.store=config.store;
        	 if(cfg.baseParams!=null)
        {
         this.store.getProxy().extraParams=cfg.baseParams;
        }
            if(cfg.extraParams!=null){
            	this.store.load({
            		params:cfg.extraParams
            	});
            }
            else{
            	if(config.firstLoad==true){
            		this.store.load();
            	}
            }
            delete config.store;
        }
        config.items = this.buildItems();
		
        this.callParent([config]);
        this.initConfig(config);
    },
    
    initComponent: function () {
        var me = this;
        me.callParent();
    },
    
    buildItems:function(){
   		var me=this;
    	var panel={
    		xtype:'panel',
    		width:500,
    		layout:'vbox',
    		border:false,
    		items:[{
    			layout:'hbox',
    			border:false,
    			items:[{
    				xtype:'textfield',
    				margin:'10 20 10 10',
    				labelWidth:120,
    				width:280,
    				fieldLabel:'输入相关条件过滤',
    				name:'__searchText',
    				enableKeyEvents:true,
    				listeners:{
    					render:function(){
    						this.focus(false,1000);
    					},
    					change:function(sender,newValue,oldValue,obj){
    						if(typeof(me.store) != 'object'){
    							me.store = DCIS.StoreMgr.get(me.store);
    						}
					            if(me.baseParams!=null)
					            {
					             
    						  me.store.proxy.extraParams=Ext.apply({},me.baseParams);
					            }
    						me.store.load({ params: {data:newValue},
					        callback:function()
					        {
						         me.store.proxy.extraParams=Ext.apply(me.store.proxy.extraParams,{data:newValue});
					        } });
    					},
    					keydown:function(sender,e,obj){
					    	var grid=me.down('datagrid');
					    	var currentKey=e.getKey();
    						var index=-1;
					    	if(currentKey!=e.UP&&currentKey!=e.DOWN&&currentKey!=e.ENTER&&currentKey!=e.PAGE_UP&&currentKey!=e.PAGE_DOWN){
					    		return ;
					    	}
					    	
					    	var record=grid.getSelectionModel().getSelection();
					    	if(record==null||record.length==0){
					    		record=null;
					    	}
					    	else{
					    		record=record[0];
					    	}
					    	
					    	if(record!=null){
					    		index=me.store.indexOf(record);
					    	}
    	
					    	if(currentKey==e.DOWN){
					    		index++;
					    		if(index>=me.store.getCount()){
					    			return ;
					    		}
					    		grid.getSelectionModel().select(index);
					    	}
					    	
					    	else if(currentKey==e.UP){
					    		index--;
					    		if(index<=0){
					    			index=0;
					    		}
					    		grid.getSelectionModel().select(index);
					    	}
					    	if(currentKey==e.ENTER){
					    		var onlyOne=grid.store.getCount();
					    		var finalRecord ;
					    		if(onlyOne==1){
					    			record=grid.store.getAt(0);
					    			grid.getSelectionModel().select(0);
					    		}
					    		me.windowSelectItemAction('',record);
					    	}
					    	
					    	var pagingToolBar=grid.query('pagingtoolbar');
					    	if(pagingToolBar!=null&&pagingToolBar.length>0){
					    		pagingToolBar=pagingToolBar[0];
					    	}
					    	if(currentKey==e.PAGE_UP){
					    	   pagingToolBar.movePrevious();
						   	}
					    	
					    	if(currentKey==e.PAGE_DOWN){
					    	   pagingToolBar.moveNext();
						   	}	
					    }
    				}
    			},{
    				xtype:'button',
    				text:'查询',
    				margin:'10 10 10 10',
    				iconCls:'icon-search',
    				width:80,
    				handler:function(){
    					var newValue=me.down('textfield[name="__searchText"]').getValue();
    					 if(me.baseParams!=null)
					            {
					              me.store.proxy.extraParams=Ext.apply({},me.baseParams);
					            }
					            
    					me.store.load({ params: {data:newValue},
	        callback:function()
	        {
		         me.store.proxy.extraParams=Ext.apply(me.store.proxy.extraParams,{data:newValue});
	        } });
    				},
    				scope:me
    			}]
    		},{
	    		border:false,
	    		width:490,
	    		items:[{
			    	xtype:'datagrid',
		    		border:false,
		    		height:258,
					store:this.store,
					forceFit:true,
					listeners:{
	    				'itemclick':function(sender,record,html,index,e,opt){
	    					me.windowSelectItemAction(sender,record,html,index,e,opt);
	    				}
					}
	    		}]
    		}]
    	};
    	
    	return panel;
    },
    
    buildButtons: function () {
        if (!config.buttons) {
            var buttons = [{
                text: "确认",
                name: "confirm",
                handler: this.confirm,
                scope: this
            }, {
                text: "取消",
                name: "cancel",
                handler: this.cancel,
                scope: this
            }];
            return buttons;
        }
        else {
            delete config.buttons;
            return config.buttons;
        }
    },
    
    cancel: function () {
        this.close();
    },
    
    confirm:function(){
    	var me=this;
    	 var selModel = this.query('grid')[0].getSelectionModel();
    	 me.selectItemAction('',selModel);
    },
    
    windowSelectItemAction: function (sender,record,html,index,e,opt) {
        var selectedRecord= this.query('grid')[0].store.getCurrentRecord();
        if(selectedRecord==null){
        	Ext.Msg.alert('提示','请选择一条记录。')
        	return ;
        }
        if(!this.searchField){
        	this.fireEvent('gridItemClick', selectedRecord);
        } else {
        	this.searchField.fireEvent('gridItemClick', selectedRecord);
        }
        
        var displayField = this.getDisplayField();
        var valueField = this.getValueField();
        
        var displayValue = null;
        if (Ext.typeOf(displayField) == "string") {
            displayValue =selectedRecord.get(displayField);
        }
        
        var valueFieldValue = "";
        if (Ext.typeOf(valueField) == "string") {
            valueFieldValue = selectedRecord.get(valueField);
        }
        if(this.searchField){
        	this.searchField.setbyWindow=true;
        	if(this.searchField.showId==true)
        	{
        	this.searchField.setValue(displayValue+"("+valueFieldValue+")");
        	}
        	else
        	{
        	this.searchField.setValue(displayValue);
        	}
        	this.searchField.setHiddenValue(valueFieldValue);
            this.searchField.setDisplayValue(displayValue);
        	this.searchField.focus(false,500);
        }
        
        this.cancel();
        
    }
});