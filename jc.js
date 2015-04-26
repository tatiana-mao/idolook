(function(){
  var cc=
    [
     "39",
     "59",
     "55",
     "32","33","44","45","46","47","48","49","50",

     "51","34","40",
     "27","29","28","30",

     "35","36","37","60","61","62","63","64","65",

     "54",
     ];
  var ss=new Object;
  var cs=[];

  var cookies=load_cookies();

  if(typeof window.JSJCJK=="object"){
    console.log("********JC the Object");
    window.JSJCJK.jc={
    load:do_load,
    reload:do_reload,
    ready:do_ready
    }
    return;
  }

  console.log("********JC: RUNNING AS STANDALONE");
  do_load();
  $("#wrapCol").addClass("xcharms");
  do_ready();

  function do_load(){
    upd_css();
  }

  function do_reload(){
    $(".btn_charms a").hide();
    $.get("/charms/",
          function(na) {
            var nd = $($.parseHTML(na));
            $(".charms-set").replaceWith(nd.find(".charms-set"));
            $(".charms-set li").css('position','relative');
            cs=[];
            ss=new Object;
            sort_c2(nd);
          });
  }

  function do_ready(){
    $(".btn_back").hide();
    $(".scrollCol").hide();
    $(".btn_popup").removeClass("btn_popup").removeClass("fancybox.iframe");

    $(".playerDateCol li").css('position','relative');

    $(".xcharms nav ul").prepend('<li class="btn_charms"><a href="/charms/">チャームをかえる</a></li>');
    $(".btn_charms a").css('background-position-y','-200px').css('background-image', 'url(/images/myprofile/navi-btn.png)').hide();

    if(localStorage["charms"]){
      cc=localStorage["charms"].split(".");
      cc=find_new($(".playerDateCol li dt img")).concat(cc);
      localStorage["charms"]=cc.join('.');
    }else if(cookies["JSJCJK_charms"]){
      cc=cookies["JSJCJK_charms"].split(".");
      cc=find_new($(".playerDateCol li dt img")).concat(cc);
      localStorage["charms"]=cc.join('.');
    } else {
      cc=cc.concat(find_new($(".playerDateCol li dt img")));
      console.log(cc);
    }
    $(".btn_charms a").click(do_set_charms);
    $(".xcharms").append('<div id="xcharms"></div>');
    var cl=$(".charms-list:first").clone();
    $(".charms-list").remove();
    $("#xcharms").append(cl);
    console.log($('#wrapCol').innerHeight());
    var xcol=$("#xcharms");
    var xcolm=xcol.outerHeight(true)-xcol.height();
    xcol.height($('#wrapCol').innerHeight()-338-110);
    sort_c2($(".xcharms"));
  }

  function hd(fn){return fn.toString().match(/[^]*\/\*([^]*)\*\/;?\}$/)[1];}
  function add_ht(flt,fn){$(flt).append(hd(fn));}

  function upd_css(){
    add_ht("head", function(){/*<style type="text/css">
#footer {
  position: absolute;
  bottom: 0px;
}
#container {
  position: absolute;
  top: 85px;
  bottom: 87px;
  width: 100%
}
#gnavi {
  height: 338px !important;
}
#wrapCol {
  height: 100% !important
}
.contentsGreenCol {
  position: relative;
  top: 0px;
  bottom: 0px;
}
#xcharms {
  clear: both;
  width: 1200px;
  overflow:hidden;
  line-height:1.3;
  padding-top:4px;
  padding-left:0px;
}
.contentsGreenCol {
  position:relative;
  top:0;
  bottom:0px;
  height:auto;
}
#xcharms .charms-list {
  background: white;
  width: 100%;
  height: 100%;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 14px;
}
#xcharms .charms-listCol {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
#xcharms .charms-list2 {
  width:100%;
  margin: 8px 20px 0 0;
}
#xcharms .charms-list2 li {
  margin: 8px 20px 0 0;
}
</style>*/});
  }

  function load_cookies() {
    var cookies=new Object;
    var cs=document.cookie.split('; ');
    for(var i=0;i<cs.length;i++) {
      var c=cs[i].split('=');
      cookies[c[0]]=decodeURIComponent(c[1]);
    }
    return cookies;
  }

  function img_n(img) {
    return img.attr('src').substr(14).split('_')[0];
  }

  function find_new(s) {
    var ary=[];
    s.each(function(){
        var n=img_n($(this));
        if(cc.indexOf(n)<0&&ary.indexOf(n)<0) ary.push(n);
      });
    console.log(ary);
    return ary;
  }

  function cl2_override(){
    var a=$(this).attr('href');
    var n=img_n($(this).find('img'));
    var p=$(this).parent().parent();
    var m=p.find('.icon-set');
    if(m.length) {
      m.remove();
      m=cs.indexOf(n);
      if(m>=0)cs.splice(m,1);
      $(".btn_charms a").hide();
    } else {
      if(a.length==1) {
        p.find(".SetCharmsName").append("<span id='xc_"+n+"' class='icon-set'>.</span>");
        ss[n]=-1-Number(a);
      } else {
        p.find(".SelectCharmsEffect").append("<span id='xc_"+n+"' class='icon-set'>.</span>");
        ss[n]=Number($(this).attr('href').split('/')[3]);
      }
      n=cs.push(n);
      if(n>3){
        n=cs.shift();
        $(".playerDateCol #xc_"+n).remove();
      }
      if(n>=3) {
        if(ss[cs[0]]<0&&ss[cs[1]]<0&&ss[cs[2]]<0)
          $(".btn_charms a").hide();
        else
          $(".btn_charms a").show();
      }
    }
    return false;
  }

  function sort_c2(na) {
    var ns=$(".charms-set .SetCharmsName");
    for(var i=0;i<3;i++) {
      var m=ns.eq(i).find("img").attr("src");
      ns.eq(i).wrapInner('<a href="'+i+'"></a>');
    }
    ns.find("a").click(cl2_override);
    var nd=na.find(".charms-list2 li");
    nd.sort(function(a,b){
        var ai=img_n($(a).find("img"));
        var bi=img_n($(b).find("img"));
        var ac=cc.indexOf(ai);
        var bc=cc.indexOf(bi);
        if(ac<0&&bc<0) return ai-bi;
        if(ac>=0&&bc>=0) return ac-bc;
        return bc-ac;
      });
    $(".charms-list2").html(nd);
    $(".charms-list2 a").click(cl2_override);
  }

  function do_set_charms(){
    $(".btn_charms a").hide();

    var n=3;
    var bk_cs=cs.concat();
    function set_cs(dummy) {
      if(n<1||cs.length==0) {
        localStorage["charms"]=cc.join('.');
        return do_reload();
      }
      var m=-1;
      var i;
      for(var i=cs.length-1;i>=0;i--)
        if(ss[cs[i]]==-n) {
          var m=cs.splice(i,1)[0];
          var j=cc.indexOf(m);
          if(j>=0) cc.splice(j,1);
          cc.unshift(m);
          n--;
          return set_cs(null);
        } else if(m<0&&ss[cs[i]]>=0) {
          m=i;
        }
      m=cs.splice(m,1)[0];
      var j=cc.indexOf(m);
      if(j>=0) cc.splice(j,1);
      cc.unshift(m);
      m=ss[m];
      m="/charms/comp/"+n--+"/"+m+"/"+m+"/";
      return $.ajax({type: "GET",
            url: m,
            async: true,
            success: set_cs,
            error: function(x,s,t) {
            $(".btn_charms a").show();
            cs=bk_cs;
            window.open("/charms/","_blank");
          },
            });
    }
    set_cs(null);
    return false;
  }
 })()
