/**
    
    qsoft.PopBigImage
    
    version��0.35
    author�� kimmking@163.com
    date��   2009��3��25��3:54:50
    
    ����������
    һ��ҳ��ĵ�ͼƬΪ�˲��ֿ��ǣ���ʾ��С��С��ʵ�ʴ�С��
    �����ͼƬ���ƶ�ʱ�����Ա�չʾһ�����ͼƬ��ʾ��Сһ��Ĳ㡣
    ������긽�������Ӧ��ԭʼͼƬ������ԭʼ��С��ʾ��������С�
    
    v0.1��ʵ����IE�µ���껬��Сͼ��̬չʾ��Ӧ�ķŴ�ֲ�ͼ�Ĺ��ܡ�
    v0.2��ʵ����Firefox�ļ���֧�֣��޸���IE�´���ƫ��0,0ʱ�п�϶�ĶԲ������⡣
    v0.3��ʵ��������һ�ν���ͼƬʱ��̬������ʾ�㡣�ṩ��һ����̬����������
    v0.35�������˶�google chrome�������֧�֡�
    
    
    ����������
    origImageId�� Ҫ�󶨵�img�����id
    dx��չʾ��ͼ����ڰ󶨵�img�����ҷ���x��ƫ����
    dy��չʾ��ͼ����ڰ󶨵�img�����Ϸ���y��ƫ����
    mx��չʾ��Ŀ�
        mx��0��1֮��ʱ��ȡ��ͼ�Ŀ�*mx��ֵ��Сͼ�Ŀ��еĽϴ���
        mx��1��10֮��ʱ��ȡСͼ�Ŀ�*mx��ֵ���ͼ�Ŀ��еĽ�С��
        mx����10ʱ��ȷ��mx�ڴ�Сͼ�Ŀ�֮�䣬�����Ļ���ȡ�߽�ֵ
    my��չʾ��ĸ�
        ����mx��ֵ
    bflag��create��������Ⱦ����Ƿ�չʾ����ʾ������
            ��onmouseover�¼���ʹ��true����
            ��ҳ�����ʱ��ʼ���Ļ�ʹ��false����
    
    
    
    �÷���
    1��ҳ����غ�ͳһԤ�ȼ��أ���ҳ�������JavaScript�ű�
    window.onload = function(){
        new qsoft.PopBigImage("orig",20,0,2,2).render();  
        //���� qsoft.PopBigImage.create("orig",20,0,2,2,false).render();    
    }
    
    ����
    2������һ�ν���ͼƬʱ�ż��ر�ͼƬ����ʾ�㣬��img��ǩ����� 
    onmouseover="qsoft.PopBigImage.create(this,20,0,2,2,true);"
    
    **/
   
   
   
    var qsoft = { 
        version : 0.35,
        isIE : document.all?true:false,
        prefx : 'qsoft',
        __id : 0,
        nextId : function ()
        {
            return this.prefx + this.__id++;
        } 
    }
    
    qsoft.PopBigImage = function (origImage,dx,dy,mx,my)
    {
        var type = typeof(origImage);
        if(type.toLowerCase() == "string")
            this.oim = document.getElementById(origImage);
        else
            this.oim = origImage;
            
        if(typeof(this.oim.pbi) != "undefined")
            return this.oim.pbi;
            
        this.id = qsoft.nextId();
        this.oim.__maskid = this.id;
        this.oim.style.cursor = "crosshair";
        
        this.ow = this.oim.width;
        this.oh = this.oim.height;
        
        this.detaX = (typeof(dx) == "undefined")?30 : dx;
        this.detaY = (typeof(dy) == "undefined")?0 : dy;
        
        var getPos = function(o) // for chrome
        {
            var x = 0, y = 0;
            do{ x += o.offsetLeft;y += o.offsetTop;}while((o=o.offsetParent));
            return {left:x,top:y};
        }
        
        this.getPosition = function(o)
        {
            return document.documentElement.getBoundingClientRect && o.getBoundingClientRect() || getPos(o); 
        }

        var rect = this.getPosition(this.oim); 
        this.ol = rect.left + this.detaX + this.ow - (qsoft.isIE ?2:0);
        this.ot = rect.top + this.detaY - (qsoft.isIE ?2:0);
        
        this.src = this.oim.src;
        
        this.getImageSize = function (img)
        {
            var im = new Image();
            im.src = img.src;
            
            var size = {};
            size.width = im.width;
            size.height = im.height;
            
            im = null;
            delete im;
            
            return size;
        }
           
        var rsize = this.getImageSize(this.oim);
        this.w = rsize.width;
        this.h = rsize.height;
        
        this.maskX = (typeof(mx) == "undefined")? this.ow : mx;
        this.maskY = (typeof(my) == "undefined")? this.oh : my;
        if(this.maskX < 1) 
            this.maskX = Math.ceil(this.w * this.maskX); 
        else if (this.maskX < 10) 
            this.maskX = Math.ceil(this.ow * this.maskX);
        if(this.maskY < 1) 
            this.maskY = Math.ceil(this.h * this.maskY); 
        else if (this.maskY < 10) 
            this.maskY = Math.ceil(this.oh * this.maskY);  
        this.maskX = this.maskX < this.ow ? this.ow : this.maskX ;
        this.maskY = this.maskY < this.oh ? this.oh : this.maskY ;
        this.maskX = this.maskX > this.w ? this.w : this.maskX ;
        this.maskY = this.maskY > this.h ? this.h : this.maskY ;
        
        var qObj = this;
        this.createMask = function ()
        {
            if(typeof(this.mask) == "undefined")
            {
                this.mask = document.createElement("div");
                this.mask.id = this.oim.__maskid + "_mask";
                this.mask.style.position  = "absolute";
                this.mask.style.width = this.maskX + "px";
                this.mask.style.height = this.maskY + "px";
                this.mask.style.left = this.ol + "px";
                this.mask.style.top = this.ot + "px";    
                this.mask.style.backgroundImage  = "url("+this.src+")";
                this.mask.style.backgroundRepeat = "no-repeat";     
                this.mask.style.display = "none";
                this.mask.style.zIndex = 100000;  
                document.body.appendChild(this.mask);      
            }
        }
        
        this.regEvent = function ()
        {
            this.oim.onmousemove = function ()
            {

                var e = arguments[0] || window.event;
                var ct = e.target || e.srcElement;
                var sz = qObj.getPosition(ct);
                var ox = qsoft.isIE ? e.offsetX: (e.pageX - sz.left);
                var oy = qsoft.isIE ? e.offsetY: (e.pageY - sz.top);
                var x = Math.ceil(ox * qObj.w/qObj.ow) - qObj.maskX/2;
                var y = Math.ceil(oy * qObj.h/qObj.oh) - qObj.maskY/2;
           
               if(x<0) x = 0;
               if(y<0) y = 0;
               var maxx = Math.ceil((qObj.w-qObj.maskX));
               var maxy = Math.ceil((qObj.h-qObj.maskY));
               if(x>maxx) x = maxx;
               if(y>maxy) y = maxy;
               qObj.mask.style.backgroundPosition = -x  + "px " + -y + "px"; 
 
            }

            this.oim.onmouseout = function ()
            {
                qObj.mask.style.display = "none";
            }
        
            this.oim.onmouseover = function ()
            {
                qObj.mask.style.display = "block";
            }
            
        }
        
        this.render = function ()
        {
            this.createMask();
            this.regEvent();
        } 
        
    }

    qsoft.PopBigImage.create  = function (origImage,dx,dy,mx,my,bflag)
    {
        var q = new qsoft.PopBigImage(origImage,dx,dy,mx,my);
        q.render();
        if(bflag)
            q.mask.style.display = "block";
        return q;
    }