function callapi(url, params, callback, scope, error, requestJson) {
    if (url == null) {
        throw new Error('[' + Ext.getDisplayName(arguments.callee)
            + '] 请输入调用的url地址');
    }
    //默认url都用相对路径，自动识别带上当前域名,如果url以/开头，需要把/替换掉
    var reg=new RegExp("^/");
    reg.test(this);
    if(reg.test(url)){
        url=url.replace("/","");
    }
    var option = {
        method: "POST",
        url: baseUrl+url,
        failure: function (response) {
            Ext.Msg.show({
                title: '操作失败',
                msg: '抱歉，您的操作失败，如有疑问请咨询技术支持！',
                width: 75,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        },
        success: function (result) {
            if (callback == null) {
                return;
            }
            var data = Ext.decode(result.responseText);
            callback.call(scope, data);
        }
    };
    //添加requestJson入参，当添加requestJson=false时，后台可以接受到键值对这种参数
    // modified by LiuJin
    if (requestJson != undefined && requestJson == false) {
        option.params = params;
    } else {
        option.jsonData = params;
    }
    Ext.Ajax.request(option);
};
var required = '<span style="color:red;font-weight:bold" data-qtip="该项目必填">*</span>';

function callapiAsync(url, params, requestJson) {
    var obj;
    if (url == null) {
        throw new Error('[' + Ext.getDisplayName(arguments.callee)
            + '] 请输入调用的url地址');
    }
    //默认url都用相对路径，自动识别带上当前域名,如果url以/开头，需要把/替换掉
    var reg=new RegExp("^/");
    reg.test(this);
    if(reg.test(url)){
        url=url.replace("/","");
    }
    var option = {
        method: "POST",
        url:  baseUrl+url,
        async: false,
        failure: function (response) {
        },
        success: function (result) {
            var data = Ext.decode(result.responseText);
            obj = data;
        }
    };
    //添加requestJson入参，当添加requestJson=false时，后台可以接受到键值对这种参数
    // modified by LiuJin
    if (requestJson != undefined && requestJson == false) {
        option.params = params;
    } else {
        option.jsonData = params;
    }
    Ext.Ajax.request(option);
    return obj;
};

// 弹出新窗口 created by clf

function popWin(url) {

    // location.href=url;

    window.open(url);
};

function popWinCustomize(url, w, h) {
    var win = window
        .open(url, "",
            "width=550,height=400,scrollbars=yes,toolbar=no,location=no,status=no,");
    win.moveTo(0, 0);
    win.focus();
};

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = (Ext.isIE6 || Ext.isIE7)
        ? 'resources/ext-theme-classic/images/tree/s.gif'
        : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    Ext.Loader.setConfig({
        enabled: true
    });

    Ext.Loader.setPath({
        "DCIS": "app/dcis",
        "Ext.ux": "resources/ux",
        "WF": "app"
    });

    Ext.Loader.require(["DCIS.Proxy", "DCIS.Store", "DCIS.buttons.AddButton",
        "DCIS.buttons.UpdateButton", "DCIS.buttons.DeleteButton",
        "DCIS.buttons.ViewButton", "DCIS.TitleBar", "DCIS.ComboBox",
        "DCIS.SearchPanel", "DCIS.DataGrid", "DCIS.DataWindow", "DCIS.Map",
        "DCIS.DataForm", "DCIS.ComplexWindow", "DCIS.DataForm",
        "DCIS.ComboStore", "DCIS.DropDownList", "DCIS.CheckGroup",
        "DCIS.StoreMgr", "DCIS.Model", "DCIS.ComboTree",
        "DCIS.TabCloseMenu", "DCIS.SearchField", "DCIS.SearchWindow",
        'DCIS.AuditForm', "DCIS.SearchWindowMultiSelect",
        'DCIS.SearchForm', 'DCIS.DateTimePicker', 'DCIS.UploadFileForm',
        'DCIS.LinkColumn', 'DCIS.FileImageForm', 'DCIS.RadioColumn',
        'DCIS.DateTimeField', 'DCIS.ExtKindeditor', 'DCIS.CheckGroupNoSubmit']);
    Ext.apply(Ext.String, {
        endWith: function (s, str) {
            if (str == null || str == "" || s.length == 0
                || str.length > s.length) {
                return false;
            }
            if (s.substring(s.length - str.length) == str) {
                return true;
            } else {
                return false;
            }
            return true;
        },
        startWith: function (s, str) {
            if (str == null || str == "" || s.length == 0
                || str.length > s.length) {
                return false;
            }
            if (s.substr(0, str.length) == str) {
                return true;
            } else {
                return false;
            }
            return true;
        }
    });
    Ext.EventManager.on(Ext.isIE ? document : window, 'keydown', function (e,
                                                                           target, o) {

        if (e.getKey() == e.BACKSPACE
            && e.browserEvent.srcElement.type != 'text'
            && e.browserEvent.srcElement.type != 'textarea'
            && e.browserEvent.srcElement.type != 'password') {
            e.stopEvent();
        } else if (e.getKey() == e.ENTER) {
            // 回车转TAB键
            if (Ext.isIE) {
                event.keyCode = Ext.EventObject.TAB;
            } else {
                var targetEl = Ext.get(target.id), fieldEl = targetEl
                        .up('[class*=x-field]')
                    || {}, field = Ext.getCmp(fieldEl.id);
                if (field.getXType() == 'textarea'
                    || field.getXType() == 'textareafield') {
                    return;
                }
                var next = field
                    .nextNode('textfield[hidden="false"][readOnly="false"][disabled="false"]');
                if (next) {
                    e.stopEvent();
                    next.focus(true);
                }
            }
        }
    });
    // 设置默认文本宽度为50,文本框长度为200
    Ext.apply(Ext.form.field.Base.prototype, {
        labelAlign: "right",
        labelSeparator: "",
        msgTarget: "side",
        setAllowBlank: function (a) {
            this.allowBlank = a;
            if (a) {
                if (this.fieldLabel.indexOf('<')) {
                    this.setFieldLabel(this.fieldLabel.split('<')[0])
                }
            } else {
                this.setFieldLabel(this.fieldLabel + '<span style="color:red;font-weight:bold" data-qtip="该项目必填">*</span>');
            }
        }
    });
    Ext.apply(Ext.form.field.ComboBox.prototype, {
        trigger1Cls: 'x-form-clear-trigger',
        trigger2Cls: 'x-form-arrow-trigger',
        onTrigger1Click: function () {
            this.clearValue();
            this.fireEvent('clear', this)
        },
        onTrigger2Click: function () {
            this.onTriggerClick()
        }
    });
    Ext.apply(Ext.window.Window.prototype, {
        constrainHeader: true
    });
    Ext.apply(Ext.grid.Panel.prototype, {
        columnLines: true
    });
    Ext.apply(Ext.window.Window.prototype, {
        icon: './images/task2.png'
    });
    Ext.apply(Ext.form.field.ComboBox.prototype, {
        listConfig: {
            loadingText: "正在加载数据",
            emptyText: "未找到匹配值",
            maxHeight: 200
        },
        displayName: null
    });
    // chenjd update:grid加载出现数据加载体验,并给出中文提示。
    Ext.override(Ext.view.AbstractView, {
        onRender: function () {
            var me = this;
            me.loadingText = '数据加载中,请稍候...', this.callOverridden();

            if (me.mask && Ext.isObject(me.store)) {
                me.setMaskBind(me.store);
            }
        }
    });

    Ext.override(Ext.view.Table, {
        listeners: {
            'render': function (view) {
                var grid = this.up('grid');
                if (grid != null && grid.tooltip != undefined) {
                    view.tip = Ext.create('Ext.tip.ToolTip', {
                        target: view.el,
                        delegate: view.itemSelector,
                        trackMouse: true,
                        renderTo: Ext.getBody(),
                        html: grid.tooltip
                    });
                }

            }
        }
    });
    Ext.apply(Ext.form.FieldContainer.prototype, {
        labelAlign: "right",
        labelSeparator: "",
        combineErrors: true,
        msgTarget: "side"
    });
    // 设置basic的getValues,如果不输入任何参数默认按照asString=false,dirtyOnly=true的方式进行,否则按照普通方式进行
    Ext.apply(Ext.form.Basic.prototype, {
        setError: function (error) {
            if (error.ErrorType == "InvalidField") {
                var field = this.findField(error.FieldName);
                if (field != null) {
                    field.markInvalid(error.Message);
                }
            }
        },

        getValues: function () {
            if (arguments.length == 0) {
                return this.getValuesCustom(false, true, true);
            } else {
                return this.getValuesCustom(arguments);
            }
        },

        setValues: function (values) {
            var me = this, v, vLen, val, field;

            function setVal(fieldId, val) {
                var field = me.findField(fieldId);
                if (field) {
                    if (field instanceof DCIS.DropDownList) {
                        field.setByRecord(values);
                    } else {
                        field.setValue(val);
                    }
                    if (me.trackResetOnLoad) {
                        field.resetOriginalValue();
                    }
                }
            }

            if (Ext.isArray(values)) {
                // array of objects
                vLen = values.length;

                for (v = 0; v < vLen; v++) {
                    val = values[v];

                    setVal(val.id, val.value);
                }
            } else {
                // object hash
                Ext.iterate(values, setVal);
            }
            return this;
        },

        getApplyValues: function () {
            var values = {};
            this.getFields().each(function (field) {

                if (!field.isDirty()) {
                    return;
                }
                if (!field.displayName) {
                    return;
                }
                if (field.getXType() == "combobox") {
                    for (var i in field.displayTplData) {
                        values[field.displayName] = field.displayTplData[i][field.displayField]
                            + ",";
                    }
                    values[field.displayName] = values[field.displayName]
                        .substr(0, values[field.displayName].length - 1);
                }
            });
            return values;
        },

        getValuesCustom: function (asString, dirtyOnly, includeEmptyText,
                                   useDataValues) {
            var values = {};
            this.getFields().each(function (field) {
                if (field.ownerCt instanceof DCIS.CheckGroup) {
                    return;
                }
                if (!dirtyOnly || field.getValue() != null) {
                    var data = field[useDataValues
                        ? 'getModelData'
                        : 'getSubmitData'](includeEmptyText);

                    if (Ext.isObject(data)) {
                        Ext.iterate(data, function (name, val) {
                            if (includeEmptyText && val === '') {
                                val = field.emptyText || '';
                            }
                            if (name in values) {
                                var bucket = values[name], isArray = Ext.isArray;
                                if (!isArray(bucket)) {
                                    bucket = values[name] = [bucket];
                                }
                                if (isArray(val)) {
                                    values[name] = bucket.concat(val);
                                } else {
                                    bucket.push(val);
                                }
                            } else {
                                values[name] = val;
                            }
                        });
                    }
                }
            });
            if (asString) {
                values = Ext.Object.toQueryString(values);
            }
            return values;
        }
    });
    Ext.QuickTips.init();
    Ext.apply(Ext.data.proxy.Ajax.prototype, {
        createRequestCallback: function (request, operation, callback,
                                         scope) {
            var me = this;

            return function (options, success, response) {
                try {
                    var data = Ext.decode(response.responseText);
                    if (data.sessionout) {
                        alert("您的登录已过期！");
                        window.location.href = window.baseUrl;
                        return;
                    }
                } catch (e) {
                    Ext.Msg.show({
                        title: '操作失败',
                        msg: '您的登录可能已过期！' + e,
                        width: 75,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                    return;
                }
                me.processResponse(success, operation, request,
                    response, callback, scope);
            };
        }
    });

    Ext.apply(Ext.util.Format, {
        rightPad: function (string, size, character, isHtml) {
            var result = String(string);
            var characterLength = character.length;
            character = character || " ";
            if (isHtml) {
                if (character == " ") {
                    character = "&nbsp";
                }
            }
            var resultLength = result.length;
            while (resultLength < size) {
                result = result + character;
                resultLength += characterLength;
            }
            return result;
        }
    });

});
Ext.apply(Ext.toolbar.Paging.prototype, {
    isShowRefresh: true,
    getPagingItems: function () {
        var me = this;
        var items = [{
            itemId: 'first',
            tooltip: me.firstText,
            overflowText: me.firstText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
            disabled: true,
            handler: me.moveFirst,
            scope: me
        }, {
            itemId: 'prev',
            tooltip: me.prevText,
            overflowText: me.prevText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
            disabled: true,
            handler: me.movePrevious,
            scope: me
        }, '-', me.beforePageText, {
            xtype: 'numberfield',
            itemId: 'inputItem',
            name: 'inputItem',
            cls: Ext.baseCSSPrefix + 'tbar-page-number',
            allowDecimals: false,
            minValue: 1,
            hideTrigger: true,
            enableKeyEvents: true,
            keyNavEnabled: false,
            selectOnFocus: true,
            submitValue: false,
            // mark it as not a field so the form will not catch
            // it when getting fields
            isFormField: false,
            width: me.inputItemWidth,
            margins: '-1 2 3 2',
            listeners: {
                scope: me,
                keydown: me.onPagingKeyDown,
                blur: me.onPagingBlur
            }
        }, {
            xtype: 'tbtext',
            itemId: 'afterTextItem',
            text: Ext.String.format(me.afterPageText, 1)
        }, '-', {
            itemId: 'next',
            tooltip: me.nextText,
            overflowText: me.nextText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
            disabled: true,
            handler: me.moveNext,
            scope: me
        }, {
            itemId: 'last',
            tooltip: me.lastText,
            overflowText: me.lastText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
            disabled: true,
            handler: me.moveLast,
            scope: me
        }, '-', {
            itemId: 'refresh',
            tooltip: me.refreshText,
            overflowText: me.refreshText,
            iconCls: Ext.baseCSSPrefix + 'tbar-loading',
            handler: me.doRefresh,
            scope: me
        }];
        if (!this.isShowRefresh) {
            items[items.length - 1].style = "display:none";
        }
        return items;
    }
});

function dateDiff(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne
        .substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));
    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo
        .substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));
    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date
        .parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// ==>June8
/**
 * ruantao1989 合并单元格
 *
 * @param {}
 *            grid 要合并单元格的grid对象
 * @param {}
 *            cols 要合并哪几列 例如 [1,2,4]
 */
var mergeCells = function (grid, cols) {
    // ==>ExtJs4.2的<tbody>改到上层<table>的lastChild . <tbody>是各个<tr>的集合
    var arrayTr = document.getElementById(grid.getId() + "-body").firstChild.firstChild.lastChild
        .getElementsByTagName('tr');

    var trCount = arrayTr.length; // <tr>总行数
    var arrayTd;
    var td;

    // ==>显示层将目标格的样式改为.display='none';
    var merge = function (rowspanObj, removeObjs)// 定义合并函数
    {
        if (0 != rowspanObj.rowspan) {
            arrayTd = arrayTr[rowspanObj.tr].getElementsByTagName("td"); // 合并行
            td = arrayTd[rowspanObj.td - 1];
            td.rowSpan = rowspanObj.rowspan;
            td.vAlign = "middle";
            // td.style.font-size = '20px';
            // $(td).hide();
            // $(td).css("font-size","15px");
            // $(td).attr("title",$(td).text());
            // $(td).find('span').attr("title",$(td).text());
            // $(td).css('color','rgb(148, 201, 36)');
            var height = $(td).innerHeight();
            if (removeObjs.length > 0) {
                $(td).css("padding-top", height / 3);
                // var showIndex = Math.ceil(removeObjs.length/2);
            }

            // 隐身被合并的单元格
            Ext.each(removeObjs, function (obj) {
                arrayTd = arrayTr[obj.tr].getElementsByTagName("td");
                arrayTd[obj.td - 1].style.display = 'none';
                arrayTd[obj.td - 1].style.borderTop = "none";
            });

        }
    };
    // ==>显示层将目标格的样式改为.display='none';

    var rowspanObj = {}; // 要进行跨列操作的td对象{tr:1,td:2,rowspan:5}
    var removeObjs = []; // 要进行删除的td对象[{tr:2,td:2},{tr:3,td:2}]
    var col;
    // ==>逐列靠表内具体数值去合并各个<tr> (表内数值一样则合并)

    try {

        Ext.each(cols, function (colIndex) {
            var rowspan = 1;
            var divHtml = null;// 单元格内的数值
            for (var i = 0; i < trCount; i++)// ==>从第一行数据0开始
            {
                // ==>一个arrayTr[i]是一整行的所有数据, 一个arrayTd是 <td xxxx
                // ><div>具体数值</div></td> ,
                arrayTd = arrayTr[i].getElementsByTagName("td");
                var cold = 0;
                // Ext.each(arrayTd,function(Td){ //获取RowNumber列和check列
                // if(Td.getAttribute("class").indexOf("x-grid-cell-special")
                // != -1)
                // cold++;
                // });
                col = colIndex + cold;// 跳过RowNumber列和check列

                if (!divHtml) {
                    divHtml = arrayTd[col - 1].innerHTML;
                    divHtml = $(divHtml).text(); // ==>拿到真正数值,相比Ext4.1多了一层<div>
                    rowspanObj = {
                        tr: i,
                        td: col,
                        rowspan: rowspan
                    }
                } else {
                    var cellText = arrayTd[col - 1].innerHTML;
                    cellText = $(cellText).text();// ==>拿到真正数值

                    var addf = function () {
                        rowspanObj["rowspan"] = rowspanObj["rowspan"]
                            + 1;
                        removeObjs.push({
                            tr: i,
                            td: col
                        });
                        if (i == trCount - 1) {
                            merge(rowspanObj, removeObjs);// 执行合并函数
                        }
                    };
                    var mergef = function () {
                        merge(rowspanObj, removeObjs);// 执行合并函数
                        divHtml = cellText;
                        rowspanObj = {
                            tr: i,
                            td: col,
                            rowspan: rowspan
                        }
                        removeObjs = [];
                    };

                    if (cellText == divHtml) {
                        if (colIndex != cols[0]) {
                            var leftDisplay = arrayTd[col - 2].style.display;// 判断左边单元格值是否已display
                            if (leftDisplay == 'none') {
                                addf();
                            } else {
                                mergef();
                            }
                        } else {
                            addf();
                        }
                    } else {
                        mergef();
                    }
                }
            }
        });
    } catch (e) {
        console.log(e.message)
    }
};

// 处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function forbidBackSpace(e) {
    var ev = e || window.event; // 获取event对象
    var obj = ev.target || ev.srcElement; // 获取事件源
    var t = obj.type || obj.getAttribute('type'); // 获取事件源类型
    // 获取作为判断条件的事件类型
    var vReadOnly = obj.readOnly;
    var vDisabled = obj.disabled;
    // 处理undefined值情况
    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
    vDisabled = (vDisabled == undefined) ? true : vDisabled;
    // 当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    // 并且readOnly属性为true或disabled属性为true的，则退格键失效
    var flag1 = ev.keyCode == 8
        && (t == "password" || t == "text" || t == "textarea")
        && (vReadOnly == true || vDisabled == true);
    // 当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2 = ev.keyCode == 8 && t != "password" && t != "text"
        && t != "textarea";
    // 判断
    if (flag2 || flag1)
        return false;
}
