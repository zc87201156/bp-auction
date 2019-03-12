Ext.define('DCIS.RadioColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.radioColumn',

    /* author: Alexander Berg, Hungary */
    defaultRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var column = view.getGridColumns()[colIndex];
        var html = '';
        if (column.radioValues) {
            for (var x in column.radioValues) {
                var radioValue = column.radioValues[x],radioDisplay;
                if (radioValue && radioValue.fieldValue) {
                    radioDisplay = radioValue.fieldDisplay;
                    radioValue = radioValue.fieldValue;
                } else {
                    radioDisplay = radioValue;
                }
                if (radioValue == value) {
                    html = html + column.getHtmlData(record.internalId, store.storeId, rowIndex, radioValue, radioDisplay, 'checked');
                } else {
                    html = html + column.getHtmlData(record.internalId, store.storeId, rowIndex, radioValue, radioDisplay,false);
                }
            }
        }
        return html;
    },
    option: function(obj){
        console.log(obj);
    },
    getHtmlData: function(recordId, storeId, rowIndex, value, display, optional) {
         var me = this,clickHandler, readOnly;
        var name = storeId + '_' + recordId;
        var clickHandler;
        var onClick;
        if (me.readOnly) {
            readOnly = 'readonly';
            onClick = '';
        } else {
            readOnly = '';
            onClick = "onclick=\"Ext.StoreManager.lookup('" + storeId + "').getAt(" + rowIndex + ").set('" + me.dataIndex + "', '" + value + "');\"";
        }
        if(optional==false)
        {
        return "<input " + onClick + " name='" + name + "'" + " type='radio' >" + display;
        }
        else
        {
          return "<input " + onClick + " name='" + name + "'" + " type='radio' checked=" + optional + ">" + display;
        }
    }
});