Ext.define('DCIS.SearchForm', {   
	     	extend : "Ext.form.FormPanel",
	        alias : 'widget.searchForm',
			layout : {
				type : 'vbox',
				align : 'middle'
			},
			border : true,
			collapsible:true,
            collapsed:true,
            titleCollapse:true,
            menuCode:'',
            title:'检索条件',
			style : 'overflow-x:hidden;overflow-y:auto;',
			style : {
    		           padding:'1px'  		
    		},
			initComponent : function() {
    			var sql="11";
				var config={
			searchColumnId:'searchColumnId'+this.menuCode,
			searchSymbolId:'searchSymbolId'+this.menuCode,
			searchValueId:'searchValueId'+this.menuCode,
			searchExpressId:'searchExpressId'+this.menuCode,
			searchAddAndBtn:'searchAddAndBtn'+this.menuCode,
			searchAddRightBtn:'searchAddRightBtn'+this.menuCode,
			searchAddorBtn:'searchAddorBtn'+this.menuCode,
			searchAddLeftBtn:'searchAddLeftBtn'+this.menuCode,
			searchClearBtn:'searchClearBtn'+this.menuCode,
			searchQueryClearBtn:'searchQueryClearBtn'+this.menuCode
			};
				var fields=this.fields;
				var entity=this.entity;
				var column=this.column;
				var columnStore=new Ext.data.ArrayStore({fields : ['operationKey','operationValue'],
															data : column
														});
				var queryHandler=this.queryHandlerFun;
				
				this.region=config.region;
				var sqlTextDescription=[];
				var sqlDescription=[];				
				var criteriaData=null;
				if(criteriaData!=null){
					sqlTextDescription=(criteriaData.criteriaDes==null?[]:criteriaData.criteriaDes.split(' '));
					sqlDescription=(criteriaData.criteriaCode==null?[]:criteriaData.criteriaCode.split(' '));					
				}
				this.items = [{
							xtype : 'panel',
									layout : {
								type : 'hbox',
								align : 'middle'
							},
							hideLabel : true,
							border : false,
							hideMode : 'display',
							items : [new Ext.form.ComboBox({
										width:160,
										height:25,
										emptyText:'列名',
										editable : false,
										mode : 'local',
										id:config.searchColumnId,
										allowBlank : false,
										hiddenName: 'columnKey',
										store :columnStore	,
										valueField : 'operationValue',
										displayField : 'operationKey'
										}),
									  new Ext.form.ComboBox({
												width:100,		
												hideLabel:true,
												triggerAction : 'all',
												editable : false,
												emptyText:'运算符',
												lazyRender : true,
												allowBlank : false,
												mode : 'local',
												id:config.searchSymbolId,
												store : new Ext.data.ArrayStore({
															fields : ['operationKey','operationValue'],
															data : [['等于', '='],
																	['小于', '<'],
																	['大于', '>'],
																	['包含', 'like'],
																	['不包含', 'not like'],
																	['不等于', '!='],
																	['大于等于', '>='],
																	['小于等于', '<='],
																	['起始于', 'like']
																	]
														}),
												valueField : 'operationValue',
												displayField : 'operationKey'
											}),
									     {			                         
				                         hideLabel:true,
				                         id:config.searchValueId,
				                         xtype:'textfield',
				                         width:200,
				                         listeners : {
				                         	focus:function(textfield){
				                         		if(Ext.getCmp(config.searchColumnId).getValue().toUpperCase().indexOf('DATE')!=-1){
													var view=new Ext.Window({
					                                            height:232,
					                                            closable : false,
					                                            width:191,
																title:'时间选择',
															    autoScroll:false,															    
															    modal:true,
															    items:new Ext.DatePicker({
																	    format : 'Y-m-d',	
																		listeners : {
																			select : function(datePicker, date){
																				textfield.setValue(Ext.Date.format(date,'Y-m-d'));
																				view.close();
																			}
																		}
															    }),
																plain:false,
																maximizable:false,
																resizable:false,
																titleCollapse:true
													});
													view.show();
												}
				                         		
				                         	}
				                         },
				                         allowBlank : false
			                        },{
			                        	xtype:'button',
			                        	text:'<span style="font-weight:bold;">条件</span>',
			                        	icon:'images/add.png',
			                        	width:60,
			                        	id:config.searchColumnId+'-criteria',
			                        	handler:function(object,e){
			                        		if(Ext.getCmp(config.searchColumnId).getValue()==null){
			                        			Ext.Msg.show({
																title : '提示',
																msg : '请先选择列',
																buttons : Ext.Msg.OK,
																icon : Ext.MessageBox.INFO
																					});
			                        			Ext.getCmp(config.searchColumnId).focus();
			                        			return ;
			                        		}
			                        		if(Ext.getCmp(config.searchSymbolId).getValue()==null){
			                        			Ext.Msg.show({
															title : '提示',
															msg : '请选择运算符',
															buttons : Ext.Msg.OK,
															icon : Ext.MessageBox.INFO
																					});
			                        			Ext.getCmp(config.searchSymbolId).focus();
			                        			return;
			                        		}
			                        		if(Ext.getCmp(config.searchValueId).getValue().replace(new RegExp("(^[\\s]*)|([\\s]*$)", "g"), "")==''){
			                        			Ext.Msg.show({
															title : '提示',
															msg : '请填入查询值！',
															buttons : Ext.Msg.OK,
															icon : Ext.MessageBox.INFO
																					});
			                        			Ext.getCmp(config.searchValueId).focus();
			                        			return;
			                        		}
			                        		var exp='';
		                        			exp+=Ext.getCmp(config.searchColumnId).getRawValue()+' ';		                        			
		                        			exp+=Ext.getCmp(config.searchSymbolId).getRawValue() +' ';
		                        			exp+=Ext.getCmp(config.searchValueId).getValue();
		                        			sqlTextDescription.push(exp);
		                        			Ext.getCmp(config.searchExpressId).setValue(sqlTextDescription.join(' '));
		                        			var _expSql='';
		                        			if(Ext.getCmp(config.searchColumnId).getValue().toUpperCase().indexOf('DATE')!=-1){
		                        				if(Ext.getCmp(config.searchColumnId).getValue().split('&')[1].toUpperCase()=='DATE'){
		                        					_expSql+=" TO_CHAR("+Ext.getCmp(config.searchColumnId).getValue().split('&')[0]+",'YYYY-MM-DD')";
		                        				}else{
		                        					_expSql+=Ext.getCmp(config.searchColumnId).getValue().split('&')[0]+' ';
		                        				}
		                        			}else{
		                        				_expSql+=Ext.getCmp(config.searchColumnId).getValue().split('&')[0]+' ';
		                        			}
		                        			_expSql+=Ext.getCmp(config.searchSymbolId).getValue()+' ';
		                        			if(Ext.getCmp(config.searchSymbolId).getValue().toUpperCase().indexOf('LIKE')!=-1){
		                        				if(Ext.getCmp(config.searchSymbolId).getRawValue()=="起始于")
		                        				{
		                        				_expSql+='\''+Ext.getCmp(config.searchValueId).getValue()+'%\'';
		                        				}
		                        				else
		                        				{
		                        				_expSql+='\'%'+Ext.getCmp(config.searchValueId).getValue()+'%\'';
		                        				}
		                        			}else{
		                        				
		                        				if(Ext.getCmp(config.searchColumnId).getValue().toUpperCase().indexOf('DATE')!=-1){
		                        					if(Ext.getCmp(config.searchColumnId).getValue().split('&')[1].toUpperCase()=='STRING'){
		                        						_expSql+='\''+Date.parseDate(Ext.getCmp(config.searchValueId).getValue(),'Y-m-d').format('Ymd')+'\'';
		                        					}else{
		                        						_expSql+='\''+Ext.getCmp(config.searchValueId).getValue()+'\'';
		                        					}
		                        				}else if(Ext.getCmp(config.searchColumnId).getValue().toUpperCase().indexOf('NUMBER')!=-1){
		                        					if(Ext.getCmp(config.searchColumnId).getValue().split('&')[1].toUpperCase()=='NUMBER'){
		                        					_expSql+=Ext.getCmp(config.searchValueId).getValue();
		                        					}
		                        					else
		                        						{
		                        						_expSql+='\''+Ext.getCmp(config.searchValueId).getValue()+'\'';
		                        						}
		                        				}
		                        				else
		                        					{
		                        					_expSql+='\''+Ext.getCmp(config.searchValueId).getValue()+'\'';
		                        					}
		                        			}		                        			
		                        			sqlDescription.push(_expSql);
		                        			Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlDescription.join(' '));
			                        	}
			                        }]
									
						},{
							xtype:'hidden',
							id:config.searchExpressId+'_sql',
							name:"sql",
							listeners:{
								afterrender:function(){
									Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlDescription.join(' '));
				    			}
							}
						},{
							xtype : 'panel',
							border : false,
							hideLabel:true,
							layout : {
								type : 'hbox',
								align : 'middle'
							},
							items:[{
									   xtype:'textarea',
									   id:config.searchExpressId,
									   hideLabel:true,
									   name:'msg',
									   height:50,
									   width:515,
									   readOnly:true,
									   style : 'overflow-x:hidden;overflow-y:auto;',
									   listeners:{
									   		render:function(object){
									   			if(Ext.isIE6){
									   				object.setWidth({width:518});
									   			}
									   		},
									   		afterrender :function(){
												Ext.getCmp(config.searchExpressId).setValue(sqlTextDescription.join(' '));
							    			}
									   }
									},{
			                        	xtype:'panel',
			                        	layout : 'form',
			                        	width : 65,
			                        	border : false,
			                        	layout : {
											type : 'vbox',
											align : 'middle'
										},
			                        	items:[
					                        	
					                        	{
					                        		xtype:'button',
					                        		text:'<span style="font-weight:bold;">并且</span>',
					                        		style : 'margin-bottom:2px;',
					                        		id:config.searchAddAndBtn,
					                        		width:60,
					                        		icon:'images/add.png',
					                        		handler:function(object ,e){
					                        			//文字描述
						                        		var exp='';
					                        			exp+='并且';
					                        			sqlTextDescription.push(exp);
					                        			Ext.getCmp(config.searchExpressId).setValue(sqlTextDescription.join(' '));
					                        			
					                        			//表达式
					                        			var _expSql='';
					                        			_expSql+='and';
					                        			sqlDescription.push(_expSql);
					                        			Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlDescription.join(' '));					                        			
					                        		}
					                        	},{
					                        		xtype:'button',
					                        		text:'<span style="font-weight:bold;">&nbsp;&nbsp;&nbsp;(&nbsp;&nbsp;&nbsp;</span>',
					                        		icon:'images/add.png',
					                        		width:60,
					                        		id:config.searchAddRightBtn,
					                        		handler:function(object,e){
					                        			//文字描述
						                        		var exp='';
					                        			exp+='(';
					                        			sqlTextDescription.push(exp);
					                        			Ext.getCmp(config.searchExpressId).setValue(sqlTextDescription.join(' '));
					                        			//表达式
					                        			var _expSql='';
					                        			_expSql+='(';
					                        			sqlDescription.push(_expSql);
					                        			Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlDescription.join(' '));
					                        		}
					                        	}
			                        	]
			                        },{
			                        	xtype:'panel',
			                        	layout:'form',
			                        	border:false,
						                layout : {
											type : 'vbox',
											align : 'stretch'
										},
			                        	width : 65,
			                        	items:[{
					                        		xtype:'button',
					                        		text:'<span style="font-weight:bold;">或者</span>',
					                        		icon:'images/add.png',
					                        		style : 'margin-bottom:2px;',
					                        		width:60,
					                        		id:config.searchAddorBtn,
					                        		handler:function(object,e){
					                        			var exp='';
					                        			exp+='或者';
					                        			sqlTextDescription.push(exp);
					                        			Ext.getCmp(config.searchExpressId).setValue(sqlTextDescription.join(' '));
					                        			//表达式
					                        			var _expSql='';
					                        			_expSql+='or';
					                        			sqlDescription.push(_expSql);
					                        			Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlDescription.join(' '));
					                        		}
					                        	},{
					                        		xtype:'button',
					                        		text:'<span style="font-weight:bold;">&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;&nbsp;</span>',
					                        		id:config.searchAddLeftBtn,
					                        		width:60,
					                        		icon:'images/add.png',
					                        		handler:function(object,e){
					                        			//文字描述
						                        		var exp='';
					                        			exp+=')';
					                        			sqlTextDescription.push(exp);
					                        			Ext.getCmp(config.searchExpressId).setValue(sqlTextDescription.join(' '));
					                        			Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlTextDescription.join(' '));
					                        			//表达式
					                        			var _expSql='';
					                        				_expSql+=')';
					                        			sqlDescription.push(_expSql);
					                        			Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlDescription.join(' '));					                        			
					                        		}
					                        	}]
			                        }
								]
						},{
						   xtype:'panel',
						   border : false,
						   layout : {
											type : 'hbox',
											align : 'stretch'
										},
						   items:[ {
									width : 85,
									border : false,
									xtype : 'panel',
									layout : 'form',
									buttonAlign : 'center'
								},{
									width : 60,
									border : false,
									xtype : 'panel',
									layout : 'form',
									buttonAlign : 'center',
									items : [{
												xtype : 'button',
												text : '<span style="font-weight:bold;">清除</span>',
												id:config.searchClearBtn+'add',
												icon:'images/clear.png',
												handler:function(){
													sqlTextDescription=[]
													sqlDescription=[]
													Ext.getCmp(config.searchExpressId).setValue(sqlTextDescription.join(' '));
													Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlDescription.join(' '));
												},
												enableToggle : true,
												listeners:{
													toggle:function(button,pressed){
														if(Ext.getCmp(config.searchClearBtn).disabled){
															Ext.getCmp(config.searchClearBtn).enable();															
															Ext.getCmp(config.searchClearBtn).pressed=false;
														}
													}
												}
											}]
								}, {
									width : 85,
									border : false,
									xtype : 'panel',
									layout : 'form',
									buttonAlign : 'center'
								},{
									width : 60,
									border : false,
									xtype : 'panel',
									layout : 'form',
									buttonAlign : 'center',
									items : [{
												xtype : 'button',
												text : '<span style="font-weight:bold;">撤消</span>',
												id:config.searchClearBtn,
												icon:'images/back.png',
												disabled:false,
												handler:function(){
													sqlTextDescription.pop();
													sqlDescription.pop();
													Ext.getCmp(config.searchExpressId).setValue(sqlTextDescription.join(' '));
													Ext.getCmp(config.searchExpressId+'_sql').setValue(sqlDescription.join(' '));													
												}
											}]
								}, {
									width : 85,
									border : false,
									xtype : 'panel',
									layout : 'form',
									buttonAlign : 'center'
								}, {
									width : 60,
									border : false,
									xtype : 'panel',
									layout : 'form',
									buttonAlign : 'center',
									items : [{
												xtype : 'button',
												text : '<span style="font-weight:bold;">查询</span>',
												id:config.searchQueryClearBtn,
												icon:'images/search.png',
												handler:function()
												{
										         var sql=Ext.getCmp(config.searchExpressId+'_sql').getValue();
										         var text=Ext.getCmp(config.searchExpressId).getValue();
										          queryHandler(sql,text);
												}
											}]
								}, {
									width : 85,
									border : false,
									xtype : 'panel',
									layout : 'form',
									buttonAlign : 'center',
									items : [{
												xtype : 'button',
												hidden:true,
												text : '<span style="font-weight:bold;">保存条件</span>',
												icon:'images/btn-save.png',
												handler:function(){
													
												}
											}]
								}, {
									width : 85,
									border : false,
									xtype : 'panel',
									layout : 'form',
									buttonAlign : 'center',
									items : [{
												xtype : 'button',
												hidden:true,
												text : '<span style="font-weight:bold;">导入条件</span>',
												icon:'images/select.png',												
												handler:function(){
													
												}
											}]
								}]
						}
						
					]
													
				this.superclass.initComponent.call(this);	
			}

		})