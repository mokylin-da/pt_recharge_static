/**
 * @author dsy
 */
(function($){
    var $$ = this;
    $.fn.BOX = function(options){
        var curr = this;
        env = $.extend({}, $.fn.BOX.defaults, options);
        I = {
            PTYPE: ['iframe', 'ajax'],
            PTHtml:'<div id="PT" style="left: 779px; top: 115px;  z-index: 5000;" class="PT_popup">'+
            '<div style="cursor: move;" class="PT_title"><h3>'
            + (typeof env.title == 'undefined' ? '游戏币兑换' : env.title) 
            +'</h3><button class="PT_close" title="关闭"></button>'+
            '</div>' +
            '<div id="PTContent" class="PT_content"></div>'+
            '</div>',
            IFRAME_BODY: "<iframe name='PTIframe' class='PT_content_frame' style='width:" + env.iwh.w + "px;height:" + env.iwh.h + "px;' scrolling='auto' frameborder='0' src='" + env.target + "'></iframe>",
            OVERLAY: "<div class='PT_overlay' style='height: 1354px;'></div><iframe id='PT_overlay'></iframe>",
            LOAD: "<div class='PT_load'><div id='PT_loading'><img src='" + env.basehome + "/recharge/static/images/box/loading.gif' /></div></div>"
        };
        var $W, $OLAY, $C;
        var show = function(){
            $W = $(window);
            $OLAY = $(I.OVERLAY).hide().addClass('PT_overlay').css('opacity', env.opacity).dblclick(function(){
                close();
            }).appendTo('body').fadeIn(300);
            $C = $(I.PTHtml).appendTo('body');
            handleClick();
        };
        function close(){
            if ($C) {
                $OLAY.remove();
                $C.stop().fadeOut(300, function(){
                    $C.remove();
                })
            }
        };
        function closeClick(obj){
            obj.find('.PT_close').click(close);
        };
        function htmlbuild(con){
            var c = this;
            $.get(env.target, function(data){
                con.html(data);
                closeClick($C);
                setPosition();
            })
        };
        function iframebuild(con){
        	  try {
            var ifr = $(I.IFRAME_BODY);
            ifr.appendTo(con.empty());
            ifr.load(function(){
                try {
                    var T = $(this).contents();
                    this.closeClick(T);
                    var iwh = calcComponent(T);
                    $C.css({
                        left: iwh.l,
                        top: iwh.t
                    });
                    $(this).css({
                        height: iwh.h,
                        width: wih.w
                    });
                } catch (e) {
                	console.log("iframe load error : " + e);
                }
            });
        	  } catch (e) {
              	console.log("iframe error : " + e);
              }
        };
        function calcComponent(T){
            fH = T.height();//iframe height
            fW = T.width();
            w = this.$W;
            newW = Math.min(w.width() - 40, fW);
            newH = w.height() - 25 - (env.title ? 0 : 30);
            newH = Math.min(newH, fH);
            if (!newH) 
                return;
            var lt = calPosition(newW);
            return {
                w: newW,
                h: newH,
                l: lt[0],
                t: lt[1]
            };
        };
        function handleClick(){
            var con = $C.find("#PTContent");
            if (env.pttype && $.inArray(env.pttype, I.PTYPE) != -1) {
                con.html(I.LOAD);
                switch (env.pttype) {
                    case "ajax":
                        htmlbuild(con);
                        break;
                    case "iframe":
                        iframebuild(con);
                        break;
                }
            }
            else {
                if (env.target) {
                    $(env.target).clone(true).show().appendTo(con.empty());
                }
                else {
                    if (env.html) 
                        con.html(env.html);
                    else 
                        $T.clone(true).show().appendTo(con.empty());
                }
            }
            afterHandleClick();
        };
        function afterHandleClick(){//处理点击之后的处理
            setPosition();
            $C.show().find('.PT_close').click(close).hover(function(){
                $(this).addClass("on");
            }, function(){
                $(this).removeClass("on");
            });
            $(document).unbind('keydown.PT').bind('keydown.PT', function(e){
                if (e.keyCode === 27) 
                    close();
                return true
            });
            if (env.timeout) {
                setTimeout(close, env.timeout);
            }
        };
        function setPosition(){
            if (!$C) {
                return false;
            }
            var width = $C.width(), lt = calPosition(width);
            $C.css({
                left: lt[0],
                top: lt[1]
            });
            var $h = $("body").height(), $wh = $W.height(), $hh = $("html").height();
            $h = Math.max($h, $wh);
            $OLAY.height($h).width($W.width())
        };
        function calPosition(w){
            l = ($W.width() - w) / 2;
            t = $W.scrollTop() + $W.height() / 9;
            return [l, t];
        };
        env.show ? show() : $(this).click(function(){
            show();
            return false;
        });
        return this;
    }
   
    $.fn.BOX.defaults = {
        eid: "",
        basehome: "https://cdn-prod.36b.me",
        opacity: 0.5,
        show: true,
        timeout: 0,
        target: null,
        pttype: null,//iframe,ajax
        title: "充值",
        drag: true,
        iwh: {
            w: 800,
            h: 600
        },
        html: ''//内容
    };
    
   
})(jQuery);
