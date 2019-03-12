Ext.define("DCIS.Map", {
    extend: "Ext.panel.Panel",
    constructor: function (cfg) {
        config = {};
        Ext.apply(config, cfg);
        this.xPoint = config.xPoint;
        this.yPoint = config.yPoint;
        this.points = config.points || [];
        this.enableDragging = config.enableDragging || true;
        this.enableScrollWheelZoom = config.enableScrollWheelZoom || true;
        this.enableDoubleClickZoom = config.enableDoubleClickZoom || true;
        this.showNavigation = config.showNavigation || true;
        this.showOverviewMap = config.showOverviewMap || true;
        this.enableKeyboard = config.enableKeyboard || true;
        this.showScale = config.showScale || true;
        this.zoom = config.zoom || 12;
        this.divId = "DCISMapDiv" + (++Ext.idSeed);
        this.html = '<div id="' + this.divId + '" style="height:100%;width:100%;background:#00FF00"></div>';
        this.callParent([config]);
    },
    initComponent: function () {
        this.callParent(arguments);

        this.on("render", this.initMap, this);
    },
    initMap: function () {
        this.createMap();
        for (var i in this.points) {
            this.addPoint(this.points[i]);
        }
    },
    setCenter: function (config) {
        var point = this.addPoint(config);
        this.map.centerAndZoom(point, this.zoom);
    },
    createMap: function () {
        var me = this;
        var map = new BMap.Map(me.divId); //在百度地图容器中创建一个地图
        var point = new BMap.Point(me.xPoint, me.yPoint); //定义一个中心点坐标
        map.centerAndZoom(point, me.zoom); //设定地图的中心点和坐标并将地图显示在地图容器中
        this.map = map; //将map变量存储在全局
        if (this.enableDragging) {
            map.enableDragging();
        } //启用地图拖拽事件，默认启用(可不写)
        if (this.enableScrollWheelZoom) {
            map.enableScrollWheelZoom();
        } //启用地图滚轮放大缩小
        if (this.enableDoubleClickZoom) {
            map.enableDoubleClickZoom();
        } //启用鼠标双击放大，默认启用(可不写)
        if (this.enableKeyboard) {
            map.enableKeyboard();
        } //启用键盘上下左右键移动地图
        //向地图中添加缩放控件
        if (this.showNavigation) {
            var ctrl_nav = new BMap.NavigationControl();
            map.addControl(ctrl_nav);
        }
        //向地图中添加缩略图控件
        if (this.showOverviewMap) {
            var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
            map.addControl(ctrl_ove);
        }
        //向地图中添加比例尺控件
        if (this.showScale) {
            var ctrl_sca = new BMap.ScaleControl();
            map.addControl(ctrl_sca);
        }
        map.addControl(new BMap.MapTypeControl());
    },
    addPoint: function (config) {
        var point = new BMap.Point(config.lng, config.lat);
        var icon = new BMap.Icon("Resources/themes/appImage/us_mk_icon.png", new BMap.Size(18, 28), { imageOffset: new BMap.Size(0, 0), infoWindowOffset: new BMap.Size(0, 0), offset: new BMap.Size(0, 0) });
                                                                               
        var marker = new BMap.Marker(point, { icon: icon });
        var infowindow = new BMap.InfoWindow("<b class='iw_poi_title' title='" + config.title + "'>" + config.title + "</b><div class='iw_poi_content'>" + config.remark + "</div>");
        //"w": 25,"h": 26, "l": 42, "t": 20, "x": 0, "lb": 15
        var label = new BMap.Label(config.title, { "offset": new BMap.Size(25, -20) });
        marker.setLabel(label);
        this.map.addOverlay(marker);
        label.setStyle({
            borderColor: "#808080",
            color: "#333",
            cursor: "pointer"
        });
        label.addEventListener("click", function () {
            marker.openInfoWindow(infowindow);
        });
        this.points.push(config);
        return point;
    },
    addPointAndCenter: function (config) {
        var point = this.addPoint(config);
        this.map.centerAndZoom(point, this.zoom);
    }
});