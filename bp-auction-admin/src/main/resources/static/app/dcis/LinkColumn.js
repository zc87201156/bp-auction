Ext.define('DCIS.LinkColumn', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.linkColumn',
	linkIdRe : /x-link-col-(\d+)/,
	config : '',
	align : 'center',
	constructor : function(cfg) {
		var me = this, items = cfg.links, l = items.length, i, item;
		me.config = cfg;
		me.renderer = function(v, meta, record, rowIndex, colIndex, store) {
			v = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this,
					arguments)
					|| '' : '';
			var newitems = items;
			if (cfg.callback) {
				newitems = cfg.callback(items, record, rowIndex, colIndex,
						store);
			}
			meta.css += ' x-link-col-cell';
			for (i = 0; i < l; i++) {
				item = newitems[i];
				if (!item.hidden) {
					if (item.disabled) {
						if (item.icon) {
							if (item.linkIndex) {
								v += '<a href="javascript:void(0)" style="text-decoration:none;vertical-align:middle;color:#808080"><img src="./resources/themes/icons/'
										+ item.icon
										+ '.png" style="vertical-align:middle;"/>'
										+ (item.linkText || '')
										+ '</a>&nbsp;'
										+ (record.get(item.linkIndex)|| '');
								if (i < l - 1)
									v += '&nbsp;&nbsp;';
							} else {
								v += '<a href="javascript:void(0)" style="text-decoration:none;vertical-align:middle;color:#808080"><img src="./resources/themes/icons/'
										+ item.icon
										+ '.png" style="vertical-align:middle;" />'
										+ (item.linkText || '') + '</a>';
								if (i < l - 1)
									v += '&nbsp;&nbsp;';
							}
						} else {
							if (item.linkIndex) {
								v += '<a href="javascript:void(0)"  style="text-decoration:none;vertical-align:middle;color:#808080">'
										+ (item.linkText || '')
										+ (record.get(item.linkIndex)|| '')
										+ '</a>&nbsp;';
								if (i < l - 1)
									v += '&nbsp;&nbsp;&nbsp;&nbsp;';
							} else {
								v += '<a href="javascript:void(0)"  style="text-decoration:none;vertical-align:middle;color:#808080">'
										+ (item.linkText || '') + '</a>';
								if (i < l - 1)
									v += '&nbsp;&nbsp;&nbsp;&nbsp;';
							}
						}
					} else {
						if (item.icon) {
							if (item.linkIndex) {
								v += '<a href="javascript:void(0)" style="text-decoration:none" class="x-link-col-icon x-link-col-'
										+ String(i)
										+ ' '
										+ (Ext.isFunction(item.getClass)
												? item.getClass.apply(
														item.scope
																|| this.scope
																|| this,
														arguments)
												: '')
										+ '"><img src="./resources/themes/icons/'
										+ item.icon
										+ '.png" style="vertical-align:middle;" class="x-link-col-icon x-link-col-'
										+ String(i)
										+ ' '
										+ (Ext.isFunction(item.getClass)
												? item.getClass.apply(
														item.scope
																|| this.scope
																|| this,
														arguments)
												: '')
										+ '"/>'
										+ (item.linkText || '')
										+ '</a>&nbsp;'
										+ (record.get(item.linkIndex)|| '');
								if (i < l - 1)
									v += '&nbsp;&nbsp;';
							} else {
								v += '<a href="javascript:void(0)" style="text-decoration:none;vertical-align:middle;" class="x-link-col-icon x-link-col-'
										+ String(i)
										+ ' '
										+ (Ext.isFunction(item.getClass)
												? item.getClass.apply(
														item.scope
																|| this.scope
																|| this,
														arguments)
												: '')
										+ '"><img src="./resources/themes/icons/'
										+ item.icon
										+ '.png" style="vertical-align:middle;" class="x-link-col-icon x-link-col-'
										+ String(i)
										+ ' '
										+ (Ext.isFunction(item.getClass)
												? item.getClass.apply(
														item.scope
																|| this.scope
																|| this,
														arguments)
												: '')
										+ '"/>'
										+ (item.linkText || '') + '</a>';
								if (i < l - 1)
									v += '&nbsp;&nbsp;';
							}
						} else {
							if (item.linkIndex) {
								v += '<a href="javascript:void(0)" style="text-decoration:none" class="x-link-col-icon x-link-col-'
										+ String(i)
										+ ' '
										+ (Ext.isFunction(item.getClass)
												? item.getClass.apply(
														item.scope
																|| this.scope
																|| this,
														arguments)
												: '')
										+ '">'
										+ (item.linkText || '')
										+ (record.get(item.linkIndex)|| '')
										+ '</a>&nbsp;';
								if (i < l - 1)
									v += '&nbsp;&nbsp;&nbsp;&nbsp;';
							} else {
								v += '<a href="javascript:void(0)" style="text-decoration:none;vertical-align:middle;" class="x-link-col-icon x-link-col-'
										+ String(i)
										+ ' '
										+ (Ext.isFunction(item.getClass)
												? item.getClass.apply(
														item.scope
																|| this.scope
																|| this,
														arguments)
												: '')
										+ '">'
										+ (item.linkText || '') + '</a>';
								if (i < l - 1)
									v += '&nbsp;&nbsp;&nbsp;&nbsp;';
							}
						}
					}
				}
			}
			return v;
		};
		return me.superclass.constructor.call(me, cfg);
	},
	destroy : function() {
		delete this.links;
		delete this.renderer;
		return this.superclass.destroy.apply(this, arguments);
	},
	/**
	 * 复写processEvent
	 */
	processEvent : function(name, grid, cell, rowIndex, colIndex, e, record,
			row) {
		var items = this.config.links;
		var m = e.getTarget().className.match(this.linkIdRe), item, fn;
		if (m && (item = items[parseInt(m[1], 10)])) {
			
			if (name == 'click') {
				grid.getSelectionModel().select(rowIndex);
				(fn = item.handler || this.handler)
						&& fn.call(item.scope || this.scope || this, grid,
								rowIndex, colIndex, record, row, item, e);
			} else if ((name == 'mousedown') && (item.stopSelection !== false)) {
				return false;
			}
		}
		return this.superclass.processEvent.apply(this, arguments);
	}
});
