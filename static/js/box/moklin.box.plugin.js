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
            OL: "<div id='m_overlay' class='PT_hide'></div>",
            PTHtml: '<div id="PT">' +
            '    <div class="PT_popup">' +
            '        <table><tbody>' +
            '            <tr><td class="PT_tl"/><td class="PT_b"/><td class="PT_tr"/></tr>' +
            '            <tr><td class="PT_b"><div style="width:10px;">&nbsp;</div></td>' +
            '                <td><div class="PT_body">' +
            ( typeof env.title == 'undefined' ? '' : '<table class="PT_title"><tr><td class="PT_dragTitle"><div class="PT_itemTitle">' + env.title + '</div></td><td width="20px" title="关闭"><div class="PT_close"></div></td></tr></table> ') +
            '<div class="PT_content" id="PTContent"></div></div></td>' +
            '                <td class="PT_b"><div style="width:10px;">&nbsp;</div></td>' +
            '            </tr>' +
            '            <tr><td class="PT_bl"/><td class="PT_b"/><td class="PT_br"/></tr>' +
            '        </tbody></table>' +
            '    </div>' +
            '</div>',
            IFRAME_BODY: "<iframe name='PTIframe' style='width:" + env.iwh.w + "px;height:" + env.iwh.h + "px;' scrolling='auto' frameborder='0' src='" + env.target + "'></iframe>",
            OVERLAY: "<div id='PT_overlay' class='PT_hide'></div>",
            LOAD: "<div class='PT_load'><div id='PT_loading'><img src='" + env.basehome + "/statis/images/box/loading.gif' /></div></div>"
        };
        var $W, $OLAY, $C;
        var show = function(){
            $W = $(window);
            $OLAY = $(I.OVERLAY).hide().addClass('PT_overlayBG').css('opacity', env.opacity).dblclick(function(){
                close();
            }).appendTo('body').fadeIn(300);
            $C = $(I.PTHtml).appendTo('body');
            $(I.PAYFORM).appendTo('body');
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
            var ifr = $(I.IFRAME_BODY);
            ifr.appendTo(con.empty());
            ifr.load(function(){
                try {
                    var T = $(this).contents();
                    this.closeClick(T);
                    var iwh = this.calcComponent(T);
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
        
//        env.show ? show() : $(this).click(function(){
//            show();
//            return false;
//        });
        show();
        return this;
    }
   
    $.fn.BOX.defaults = {
        eid: "",
        basehome: "https://cdn-prod.36b.me/recharge",
        opacity: 0.5,
        show: false,
        timeout: 0,
        target: null,
        pttype: null,//iframe,ajax
        title: "充值",
        drag: true,
        iwh: {
            w: 400,
            h: 300
        },
        html: ''//内容
    };
})(jQuery);
