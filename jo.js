(function(){
  var my_uid;
  var hide_self=function(){
    if(my_uid)
      $(".cls_"+my_uid).hide();
  }

  var uid_data={};
  var uid_avs={};
  var obj_nice_dialog;
  var msgs={};

  var offer_state="";
  var ofl_uids=[];
  var orig_uids=[];
  var hidden_uids=[];
  var offer_sers=[];
  var offer_workers=new Array(3);
  for(var i=0;i<offer_workers.length;i++){
    offer_workers[i]=$.Deferred();
    offer_workers[i].resolve();
  }

  var favs;
  var new_favs;
  var hists;

  favs=localStorage["favorites"];
  favs=favs?favs.split("/"):[];

  new_favs=localStorage["favorites_new"];
  new_favs=(new_favs!=null?new_favs.split("/"):favs.slice(0));

  hists=localStorage["histories"];
  hists=hists?hists.split("/"):[];

  var unknown_uids=[];
  var load_uids_workers=new Array(4);
  for(var i=0;i<load_uids_workers.length;i++){
    load_uids_workers[i]=$.Deferred();
    load_uids_workers[i].resolve();
  }

  if(typeof window.JSJCJK=="object"){
    console.log("********JO the Object");
     hide_self=function(){
      if(window.JSJCJK.my_uid)
        $(".cls_"+window.JSJCJK.my_uid).hide();
        if(window.JSJCJK.jo.av)
          set_av_from_large(window.JSJCJK.my_uid,window.JSJCJK.jo.av);
    }
    h={
    load:do_load,
    reload:do_reload,
    ready:do_ready
    }
    window.JSJCJK.jo=$.extend(window.JSJCJK.jo,h);
    return;
  }

  console.log("********JO: RUNNING AS STANDALONE");
  document.oncontextmenu=null;

  $.get("/m_members/edit/",function(a){
      my_uid=$($.parseHTML(a)).find("#fe_text").val().match(/\/([0-9A-Z_a-z]{16})\//);
      if(my_uid) {
        my_uid=my_uid[1];
        hide_self();
      }else{
        console.log("error getting my uid");
        console.log(my_uid);
        console.log(a);
      }
    });

  $("#wrapCol").attr("class","xoffer");
  do_load();

  var objs={
  team:$.get("/my_datas/teammate/"),
  myfriends:$.get("/my_datas/bds_frend_lists/"),
  requested:$.get("/my_datas/pend_lists/"),
  nice:$.get("/t_infos/nice/")
  };

  do_ready(objs);

  function do_load(){
    $(".btn_back").remove();
    upd_css();
  }

  function do_reload(){
    msgs={};
    var objs={
    team:$.get("/my_datas/teammate/"),
    myfriends:$.get("/my_datas/bds_frend_lists/"),
    requested:$.get("/my_datas/pend_lists/"),
    nice:$.get("/t_infos/nice/")
    };
    $(".btn_offer").css("visibility","hidden");
    load_objs(objs);
    $.get("/offers/", function(a) {
        var a=$($.parseHTML(a));
        console.log(a.find(".offerlistWrap"));
        $(".offerlistWrap").replaceWith(a.find(".offerlistWrap"));
        do_ofl();
      });
  }

  function do_ready(objs){
    $('<link href="/css/popup.css"/><link href="/css/nices.css"/>')
      .attr({"rel":"stylesheet","type":"text/css"})
      .insertBefore('link[rel="stylesheet"]:first');
    add_xcol();
    for(var i=0;i<favs.length;i++){
      var uid=favs[i];
      var j=hists.indexOf(uid);
      if(j>=0)hists.splice(j,1);
      append_li("#favorites", uid);
      load_uid(uid,23*3600);
    }
    for(var i=0;i<hists.length;++i){
      var uid=hists[i];
      if(!localStorage[uid+".name"])load_uid(uid);
      append_li("#hists",uid);
    }
    if(new_favs.length==0)$("#do_new_as_read").hide();

    $(".xoffer nav ul")
      .prepend('<li class="btn_nice"><a href="./">いいね!</a></li>')
      .prepend('<li class="btn_offer"><a href="/offers/">オファー</a></li>');
    $(".btn_offer").click(do_offer);
    $(".btn_nice").hide().click(do_nice);
    load_objs(objs);
    do_ofl();
  }

  function load_objs(objs){
    if(objs.team)
      objs.team.then(function(a){
          a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
          var a = $($.parseHTML(a)).find(".list-teammate ul");
          adduid("ph_team",a,3*60);
        });
    if(objs.myfriends)
      objs.myfriends.then(function(a){
          a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
          var a = $($.parseHTML(a)).find(".list-myfriend ul");
          adduid("ph_myfriends",a,23*3600);
        });
    if(objs.requested)
      objs.requested.then(function(a){
          a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
          var a = $($.parseHTML(a)).find(".list-from_request ul");
          adduid("ph_requested",a,6*86400);
          $(".ph_requested .uid").each(function() {
              var uid=$(this).find("a:first").attr("href").split("/")[3];
              var li=$(".cls_"+uid);
              li.find(".img_webfriend").remove();
              li.find(".av").append('<span class="img_webfriend img_requested"></span>');
            });
        });
    if(objs.nice)
      objs.nice.then(add_nice);
    $.get("/nices/detail/1/YibaYLPkFhMTp3Uc/",function(a){
        a=a.replace(/^[\S\s]*(<article[\S\s]+<\/article>)[\S\s]*$/m,"$1")
           .replace(/<link[^<>]+>/gm,"")
          .replace(/<script[\S\s]+?<\/script>/gm,"");
        console.log(a);
        obj_nice_dialog=$($.parseHTML(a));
        obj_nice_dialog.find(".niceCol")
          .append(obj_nice_dialog.find(".stampCol-top"))
          .append('<div id="stb" class="stampdetail"><div id="sti">');
        obj_nice_dialog.find("#sti")
          .append(obj_nice_dialog.find("ul.stampdetail"))
        obj_nice_dialog.find("#stb")
          .append(obj_nice_dialog.find(".stampCol-bottom"));
        obj_nice_dialog.find(".choiceCol")
          .css("max-height",$("body").innerHeight()-600);
      });
  }

  function hd(fn){return fn.toString().match(/[^]*\/\*([^]*)\*\/;?\}$/)[1];}
  function add_ht(flt,fn){$(flt).append(hd(fn));}

  function add_xcol(){
    add_ht('.xoffer', function(){/*
<div id="xoffer">
  <div id="xacc">
    <h2>Favorites</h2>
    <div>
      <h3>チームメイト</h3>
      <ul class="ph_team"><li>Loading...</li></ul>
      <h3>Favorites</h3>
      <ul id="favorites">
      </ul>
      <div class="xix">
        <input type="button" id="mode_favs_imp" value="インポート"/>
        <input type="button" id="mode_favs_exp" value="エクスポート"/>
        <input type="button" id="do_new_as_read" value="全既読"/>
        <input type="button" id="mode_favs_del" value="全削除"/>
      </div>
    </div>
    <h2>いいね!</h2>
    <div>
      <h3>いいね!</h3>
      <ul class="ph_nice verbose"><li>Loading...</li></ul>
    </div>
    <h2>マイフレ</h2>
    <div>
      <h3>チームメイト</h3>
      <ul class="ph_team verbose"><li>Loading...</li></ul>
      <h3>マイフレンド</h3>
      <ul class="ph_myfriends small"><li>Loading...</li></ul>
      <h3>ウェブとも候補</h3>
      <ul class="ph_requested verbose"><li>Loading...</li></ul>
    </div>
    <h2>History</h2>
    <div>
      <h3>History</h3>
      <ul id="hists" class="small"></ul>
      <div class="xix">
        <input type="button" id="mode_hists_exp" value="エクスポート"/>
        <input type="button" id="mode_hists_del" value="全削除"/>
      </div>
    </div>
  </div>
  <div id="ximp">
    <div>
      <input type="button" id="imp_sub" value="インポート"/>
      <input type="button" id="imp_cancel" value="もどる"/>
    </div>
    <textarea id="imp_text"></textarea>
    <div id="xifn">
      <iframe id="xif0" sandbox="allow-forms allow-same-origin"></iframe>
    </div>
  </div>
</div>
*/});
    $("#ximp").hide();
    xp_acc();
  }

  function upd_css() {
    add_ht("head", function(){/*<style type="text/css">
a:focus {outline:0;}
#footer {
  position: absolute;
  bottom: 0px;
}
#container {
  position: absolute;
  top: 85px;
  bottom: 87px;
  width: 100%;
  height: auto;
}
#gnavi {
  height: 338px !important;
}
#gnavi ul li.btn_nice a {
  background: url(/images/top/navi-btn-others.png) no-repeat;
  background-position: 0 -100px;
}
#wrapCol {
  height: 100% !important
}
.contentsGreenCol {
  height: auto;
}
.contentsGreenCol-bottom {
  margin-top: -10px;
}
.btnWrapCol {display:none;}
.offerlistWrap {
  padding-top: 20px;
  margin-bottom:0;
}
#xoffer {
  clear: both;
  width: 1200px;
  overflow:hidden;
  line-height:1.3;
  padding-top:4px;
  padding-left:0px;
}
#xoffer ul {margin-left:4em;}
#xoffer h3 {
  font-size:36pt;
  padding-top:10px;
}
#xoffer ul+h3 {
  clear: both;
  padding-top:1em;
}
.xix {
  clear:both;
  padding: 3em 0em 2em 0em;
}
#ximp {height:100%;}
#ximp div {font-size:24pt;}
#ximp textarea {
  width:96%;
  height:95%;
  margin-top:8px;
}
#xifn {display:none;}
#xoffer input {font-size:24pt;margin-left:3em;}

#xacc {
  height:100%;
}

#xacc>ul>li {
  display:inline-block;
  padding: 4pt 18pt 0pt 18pt;
  font-size:40pt;
  background-color:lightgray;
  border:inset;
  border-bottom:none;
}

#xacc>ul>li a {
  color:black
}

#xacc .active {
  background:white;
  border:outset;
  border-bottom:none;
}

#xacc>div {
  background:white;
  height:96%;
  padding: 1.5em 0px 0em 1.5em;
  overflow:auto;
  -webkit-overflow-scrolling:touch;
  overflow-scrolling:touch;
}

.uid .name {
  font-weight:bold;
}

.uid .pref span {
  display:inline;
}
.uid .pref span.state {
  display:inline;
}
.uid .pref span.suf {
  display:none;
}

.charms img {width:36px;}

a:link {text-decoration:none;}

.uid {
  display:block;
  float:left;
}

.av {
  display:block;
  width: 208px;
  height: 221px;
  background: url("/images/myfriend/bg_icon.png") no-repeat center top;
  background-size: cover;
}

.av img {
  width: 100%;
  height: auto;
  margin-top: 17%;
}

.ph_new  {
  width: 1em;
  position: relative;
  display: block;
  width: 35px;
  height: 17px;
  bottom: 112%;
  left: 4%;
}

.new {
  background: url("/images/myfriend/img_new.png") no-repeat center top;
}

.ph_offer  {
  background: url("/images/myfriend/img_offer-now.png") no-repeat center top;
  background-size: cover;
  position: relative;
  display: block;
  width: 100%;
  height: 27%;
  left: 0px;
  top: -211px;
  opacity:0;
}

.uid .img_offer {
  opacity:1;
}

.uid .half_offer {
  opacity:0.4;
}

.uid .img_webfriend {
  display: block;
  width: 28%;
  height: 28%;
  background: url("/images/myfriend/img_webfriend.png") no-repeat center top;
  background-size: cover;
  position: relative;
  left: 66%;
  bottom:60%;
  opacity:1;
}

.uid .img_requested {
  opacity:0.6;
}

span.msg {
  display:none;
}

.name_row {
  font-size:18pt;
  display:block;
  text-align:center;
}
.name_row .name+span {font-size:12pt;}
.pref {display:none}
.charms {
  position:relative;
  display:block;
  height:0px;
  top:-225px;
  left:17%;
}
.charms img {width:45px;}
.coord {
  position: relative;
  display: block;
  height: 0px;
  top: -95px;
  left: 6%;
}
.coord .TBS img {width:42px;height:auto;}
.coord .A img {width:auto;height:42px;}

.list-offerlist li {
  margin-right:-51px;
  margin-left:95px;
  margin-top:13px;
  width:auto;
  height:auto;
  line-height:1.3;
}

.small .av {width:104px;height:118px;}
.small .av img {margin-top:26%;}
.small .ph_offer {top:-114px;}
.small .img_webfriend {bottom:67%;}
.small .name_row {font-size:12pt;line-height:0.9;}
.small .name+span {display:none;}
.small .charms {display:none;}
.small .coord {display:none;}

.verbose ul {
  margin-bottom:3em;
}

.verbose .uid:nth-child(2n-1) {background: floralwhite;}
.verbose .uid:nth-child(2n)   {background: antiquewhite;}

.verbose .uid {
  display:block;
  float:none;
  margin-left:2em;
  font-size: 24pt;
}

.verbose .uid span {display:inline-block;}

.verbose .av {
  width: 80px;
  height:85px;
  background: url("/images/myfriend/bg_icon.png") no-repeat center top;
  background-size: cover;
}
.verbose .av img {
  width: 100%;
  height: auto;
  margin-top: 17%;
}
.verbose span.msg {
  display:block;
  color:darkred;
  font-size:14pt;
  line-height:1;
}
.verbose img.imgstamp{width:auto;height:16pt;}
.verbose span.ph_new  {display:block;}
.verbose span.ph_offer {
  display: block;
  top: -80px;
}
.verbose span.img_webfriend {display:block;bottom:73%;}
.verbose .name_row {width:144pt;text-align:initial;font-size:28pt;}
.verbose .name+span {display:none;}
.verbose .pref {width:100pt;font-size:24pt;}
.verbose .pref span.suf {display:inline;}
.verbose .charms {
  width:184px;
  top:0px;
  left:0px;
  height:48px;
  margin-left: 3.5em;
}
.verbose .charms img {width:auto;height:56px;}
.verbose .coord {top:0px;left:0px;height:auto;margin-left: 1em;}
.verbose .coord .TBS img {width:54px;height:auto;}
.verbose .coord .A img {width:auto;height:54px;}

.fancybox-inner article{
  display:block;
  width:1104px;
  float:none;
}
.fancybox-inner .popup-inner{
  height:auto;
}
.fancybox-inner .nice_choice{
  display:inline-block;
  height:auto;
}
.fancybox-inner .choiceCol{
  width:auto;
  height:auto;
  min-height:300px;
  margin: 3px 0 3px 0px;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch;
  overflow-scrolling:touch;
}
.fancybox-inner .choiceCol-inner{
  position:relative;
  width:auto;
}
.fancybox-inner .choiceCol-inner #niceSelectMessage li {
  width:auto;
}
.fancybox-inner  #niceSelectMessage li a {
  width:auto;
}
.fancybox-inner  #niceSelectMessage li a label{
  width:992px;
}
.fancybox-inner  #niceSelectMessage input[type=radio]:checked + label{
  color:white;
  background:url(/images/greeting_messages/bg_star.gif) no-repeat rgb(250,86,155) 8px 8px;

}
.fancybox-inner  .stampdetail li{
  padding:0;
}
.fancybox-inner  .stampdetail li label{
  padding:12px;
  border:solid 3px white;
}
.fancybox-inner  .stampdetail input[type=radio]:checked + label{
  border-color:rgb(250,86,155)
}
.fancybox-inner .scrollCol{
  display:none;
}
.fancybox-inner #stb{
}
.fancybox-inner #sti{
  width:931px;
  margin-left:10px;
  overflow-x:scroll;
  -webkit-overflow-scrolling:touch;
  overflow-scrolling:touch;
}
.fancybox-inner #sti ul{
  display:inline-flex;
  width:auto;
}
</style>*/});
  }

  function change_view(){
    var ul=$(this).next("ul");
    var cs=ul.attr("class");
    if(!cs)cs="";
    if(cs.match(/small/)){
      ul.removeClass("small").addClass("verbose");
    }else if(cs.match(/verbose/)){
      ul.removeClass("verbose");
    }else{
      ul.addClass("small");
    }

    var vs={};
    $("#xacc>ul>li>a").each(function(){
        var h2=new Object;
        vs[$(this).text()]=h2;
        $($(this).attr("href")).find("h3").each(function(){
            var h3=$(this).text();
            var ul=$(this).next("ul");
            var classes=ul.attr("class");
            var view="";
            if(classes){
              classes=classes.split(/\s+/);
              if(classes.indexOf("verbose")>=0) view="verbose";
              else if(classes.indexOf("small")>=0) view="small";
            }
            h2[h3]=view;
          });
      });
    localStorage["views"]=JSON.stringify(vs);
  }

  function reset_view(){
    var vs=localStorage["views"];
    if(!vs)return;
    vs=JSON.parse(vs);
    $("#xacc>ul>li>a").each(function(){
        var h2=$(this).text();
        if(!vs[h2])return;
        $($(this).attr("href")).find("h3").each(function(){
            var h3=$(this).text();
            var ul=$(this).next("ul");
            ul.removeClass("verbose").removeClass("small");
            if(vs[h2][h3])ul.addClass(vs[h2][h3]);
          });
      });
  }

  function xp_acc() {
    console.log($('#wrapCol').innerHeight());
    var xcol=$("#xoffer");
    var xcolm=xcol.outerHeight(true)-xcol.height();
    xcol.height($('#wrapCol').innerHeight()-338-110);
    var navs="";
    var i=0;
    $("#xoffer h2").each(function(){
        $(this).next("div").attr("id","x"+i);
        navs+='<li><a href="#x'+i+'">'+$(this).text()+'</a></li>';
        $(this).remove();
        i++;
      });
    $("#xacc").prepend('<ul>'+navs+'</ul>');
    $("#xacc>ul>li:eq(0)").addClass("active");
    $("#xacc>div:gt(0)").hide();
    var xacc=$("#xacc>div:first");
    var xm=xacc.outerHeight(true)-xacc.height();
    $("#xacc>div").height($("#xacc").innerHeight()-$("#xacc>ul").outerHeight(true)-xm);
    $("#xacc>ul>li a").click(function(){
        $("#xacc>ul>li").removeClass("active");
        $("#xacc>div").hide();
        $(this).parent("li").addClass("active");
        $($(this).attr("href")).show();
        return false;
      });
    $("#mode_favs_imp").click(function(){
        $("#xacc").hide();
        $("#ximp").show();
        $("#imp_text").val("URLもしくはICカード番号を貼れ!\n例) XXXX-XXXX-XXXX-XXXX-XXXX\n");
      });
    $("#imp_sub").click(do_imp);
    $("#imp_cancel").click(function(){
        $("#xacc").show();
        $("#ximp").hide();
      });
    $("#mode_favs_exp").click(do_favs_exp);
    $("#mode_hists_exp").click(do_hists_exp);
    $("#mode_favs_del").click(do_favs_del);
    $("#mode_hists_del").click(do_hists_del);
    $("#do_new_as_read").click(do_new_as_read);
    $("#xoffer h3").click(change_view);
    reset_view();
  }

  function ofl_ph(i) {return '<li id="ofl_'+i+'"><a><span class="av"></span></a></li>';}

  function do_new_as_read(){
    new_favs=[];
    $("#xoffer span.new").remove();
    $("#do_new_as_read").hide();
  }

  function save_favs(){
    localStorage["favorites"]=favs.join("/");
    for(var i=new_favs.length-1;i>=0;i--)
      if(favs.indexOf(new_favs[i])<0)new_favs.splice(i,1);
    localStorage["favorites_new"]=new_favs.join("/");
    for(var i=new_favs.length-1;i>=0;i--)
      if(favs.indexOf(hists[i])>=0)hists.splice(i,1);
    localStorage["histories"]=hists.join("/");
  }

  function cre_li(uid){
    var li=$($.parseHTML(hd(function(){/*
<li class="uid">
  <a href="">
    <span class="av">
      <img src="/images/icon/chara/1.png"/>
      <span class="ph_offer"></span>
      <span class="ph_new"></span>
    </span>
    <span>
      <span class="msg"></span>
      <span class="name_row">
        <span class="name">？？？</span><span>(<span class="state">---</span>)</span>
      </span>
      <span class="pref">
        <span class="state">---</span><span class="suf"></span>
      </span>
      <span class="data charms"></span>
    </span>
    <span class="data coord">
      <span class="TBS"></span><span class="A"></span>
    </span>
  </a>
</li>
                                       */})));
    li.addClass("cls_"+uid);
    li.find("a").attr("href","/idolooks/index/"+uid+"/").click(sel_uid);
    return li;
  }

  function upd_sel_offer(uid,f){
    var t=$(".cls_"+uid+" .ph_offer");
    t.removeClass("img_offer").removeClass("half_offer");
    if(f)t.addClass(orig_uids.indexOf(uid)>=0?"img_offer":"half_offer");
    if($(".img_offer,.half_offer").length>0)
      $(".btn_nice").show();
    else
      $(".btn_nice").hide();
  }

  function upd_li(uid){
    var cuid=".cls_"+uid;
    var name=localStorage[uid+".name"];
    var d=uid_data[uid];
    if(!d){
      d=localStorage[uid+".data"];
      if(d)d=JSON.parse(d);
    }
    if(name){
      $(cuid+" .name").text(name);
      var state="ひみつ";
      if(d&&d.st)state=d.st;
      var ss=state.match(/^(.+)([都府県])$/);
      if(!ss)ss=[null,state,""];
      $(cuid+" .state").text(ss[1]);
      $(cuid+" .suf").text(ss[2]);
    }
    if(msgs[uid]){
      $(cuid+" .msg").html(msgs[uid]);
    }
    var av=get_av(uid);
    if(av)$(cuid+" .av img").attr("src",av.img);
    $(cuid+" .ph_new").removeClass("new").text("");
    if(new_favs.indexOf(uid)>=0){
      $(cuid+" .ph_new").addClass("new");
      $("#do_new_as_read").show();
    }
    upd_sel_offer(uid,(ofl_uids.indexOf(uid)>=0));
    if(d){
      if(d.ch)
        $(cuid+" .charms").html(d.ch.map(function(a){
              return '<img src="/images/charm/'+a+'.png"/>';
            }).join(""));
      if(d.co)
        $(cuid+" .coord .TBS").html(d.co.map(function(a){
              return '<img src="/images/cardlist/cardimg/'+a+'.png"/>';
            }).join(""));
      if(d.ac)
        $(cuid+" .coord .A").html(d.ac.split("/").map(function(a){
              return '<img src="/images/cardlist/cardimg/'+a+'.png"/>';
            }).join(""));
    }
  }

  function append_li(sel,uid,prepend){
    var li=cre_li(uid);
    if(prepend)
      $(sel).prepend(li);
    else
      $(sel).append(li);
    upd_li(uid);
  }

  function replace_li(sel,uid){
    sel.replaceWith(cre_li(uid));
    upd_li(uid);
  }

  function load_uid(uid,sec) {
    if(unknown_uids.indexOf(uid)>=0)return;
    var d=uid_data[uid];
    if(!d){
      d=localStorage[uid+".data"];
      if(d)d=JSON.parse(d);
    }
    if(!sec)sec=10;
    if(localStorage[uid+".name"]
       &&d&&(new Date).getTime()-d.mt*1000<sec*1000)return;

    unknown_uids.push(uid);
    load_uids_job();
  }

  function set_av(uid,av){
    uid_avs[uid]={};
    uid_avs[uid]["mt"]=Math.floor((new Date).getTime()/1000);
    uid_avs[uid]["img"]=av;
    localStorage[uid+".av"]=JSON.stringify(uid_avs[uid]);
  }

  function get_av(uid){
    var av=uid_avs[uid];
    if(!av){
      av=localStorage[uid+".av"];
      if(av)av=JSON.parse(av);
    }
    return av;
  }

  function hists_prune(uid){
    var i=hists.indexOf(uid);
    if(i<0)return;
    hists.splice(i,1);
    $("#hists .cls_"+uid).remove();
  }

  function fav_prepend(uid){
    console.log("FAV:"+uid);
    var i=favs.indexOf(uid);
    if(i>=0)favs.splice(i,1);
    favs.unshift(uid);
    $("#favorites .cls_"+uid).remove();
    append_li("#favorites",uid,true);
    if($(".ph_team .cls_"+uid).length>0)$("#favorites .cls_"+uid).hide();
    hists_prune(uid);
  }

  function do_ofl() {
    ofl_uids.length=0;
    orig_uids.length=0;
    $(".img_offer").removeClass("img_offer");
    $(".half_offer").removeClass("half_offer");
    adduid("offerlistWrap",$(".offerlistWrap").clone(),1*60);
    var ofl=$(".offerlistWrap li");
    console.log(ofl);
    var i;
    for(i=0;i<3;i++) {
      var li=ofl.eq(i);
      if(li.length==0) break;
      li.attr("id","ofl_"+i);
      var uid=li.find("a:first").attr("href").split("/")[3];
      orig_uids.push(ofl_uids[i]=uid);
      var j=new_favs.indexOf(uid);
      if(j>=0)new_favs.splice(j,1);
      fav_prepend(uid);
      upd_sel_offer(uid,true);
      $(".cls_"+uid+" span.new").remove();
    }
    console.log(orig_uids);
    for(;i<3;i++) {
      $(".offerlistWrap").append(ofl_ph(i));
      ofl_uids[i]=undefined;
    }
    save_favs();
    $(".btn_offer").css("visibility","visible");
    offer_job();
  }

  function set_av_from_large(uid,a) {
    var av=get_av(uid);
    if(av&&(new Date).getTime()-av.mt*1000<7*86400*1000)return;
    var ava=a.split("_");
    var avs=[];
    if(ava.length==22) {
      avs.push("/img/avaters/"+ava[2]+"_ibody_"+ava[4]+"_"+ava[6]+".png");
      avs.push("/img/avaters/"+ava[2]+"_ibody_"+ava[4]+".png");
    } else if(ava.length==5)
      avs.push("/img/avaters/"+ava[2]+"_ibody_"+ava[4]+".png");
    else if(ava.length==6) {
      avs.push("/img/avaters/"+ava[2]+"_ibody_"+ava[4]+".png");
      avs.push("/img/avaters/"+ava[2]+"_ibody_"+ava[4]+"_"+ava[5]+".png");
    } else if(ava.length>=7) {
      avs.push("/img/avaters/"+ava[2]+"_ibody_"+ava[4]+".png");
      avs.push("/img/avaters/"+ava[2]+"_ibody_"+ava[4]+"_"+ava[5]+".png");
      avs.push("/img/avaters/"+ava[2]+"_ibody_"+ava[4]+"_"+ava[6]+".png");
    }else{
      console.log(uid+":UNKNOWN AV URL");
      console.log(ava);
      return;
    }
    fetch_avs();

    function fetch_avs() {
      if(avs.length==0)return;
      var av=avs.shift();
      $.ajax(av,{
        success:function(){
            set_av(uid,av);
            $(".cls_"+uid+" .av img").attr("src",av);
          },
            error:fetch_avs
            });
    }
  }

  function offer_job(){
    if(!offer_workers)return;
    var n=0;
    for(var i=0;i<offer_workers.length;i++)
      if(offer_workers[i].state()=="pending")n++;
    console.log(n+"--STATE: "+offer_state);

    if(offer_state=="do_rm"){
      if(n>0)return;

      /* Remove -- serialized */
      for(var i=0;i<orig_uids.length;i++){
        var uid=orig_uids[i];
        /*if(ofl_uids.indexOf(uid)>=0)continue;*/
        console.log("Removing: "+uid);
        orig_uids.splice(i,1);
        offer_workers[0]=kick_offer_cancel(uid);
        return;
      }
      offer_state="do_offer";
      console.log(n+"--NEXT:  "+offer_state);
    }

    if(offer_state=="do_offer"){
      if(n>0)return;
      /* Add (3-parallel) */
      for(var i=0;i<ofl_uids.length;i++){
        var uid=ofl_uids[i];
        if(uid==undefined)continue;
        console.log("OFFERING["+i+"]:"+uid);
        orig_uids.push(uid);
        offer_workers[i]=kick_offer(uid);
        n++;
      }
      offer_state="do_offer_comp";
      console.log(n+"--NEXT:  "+offer_state);
      /*thru*/
    }

    if(offer_state=="do_offer_comp"){
      if(n>0)return;
      do_offer_comp();
      offer_state="";
      console.log(n+"--NEXT:  (IDLE)");
      /*thru*/
    }

    if(n==0&&orig_uids.length<3&&offer_sers.length>0){
      // POST後に302によりUIDが得られるが, XHRでは
      // リダイレクト後のURLを得られないため hidden iframe にて
      // 処理を進行させる。
      console.log(offer_sers);
      var sn=offer_sers.shift();
      var rcnt=6;
      offer_workers[0]=$.Deferred(); /* "pending" */
      var xn="#xif0";
      $(xn).load(function(){
          var i=$(xn).contents();
          console.log(xn+": "+i.get(0).location.href);
          var uids=i.get(0).location.href.match(/\b[0-9A-Z_a-z]{16}$/);
          console.log(i);
          console.log(uids);
          if(!uids){
            var s=i.find("#fromOfferMemberSerial");
            if(rcnt--&&s.length>0) {
              s.attr("value",sn);
              console.log(rcnt+":POST UID:"+sn);
              i.find("#fromOfferMember").submit();
              return;
            }else{
              console.log(i.html());
              console.log(rcnt+":error");
              if(rcnt>0){
                $(xn).attr("src","/offer_members/");
                return;
              }
            }
          } else {
            uid=uids[0];
            console.log("FOUND "+uid+" via "+sn);
            var t=i.find(".profImg img,.offerCol p span");
            console.log(t.length);
            console.log(t);
            if(t.length>=2) {
              localStorage[uid+".name"]=t.eq(1).text().replace(/\s/g,"");
              console.log("name("+localStorage[uid+".name"]+")");
              set_av_from_large(uid,t.eq(0).attr("src"));
            }else{
              console.log("failed");
            }
            if(new_favs.indexOf(uid)<0)new_favs.push(uid);
            if(favs.indexOf(uid)<0) {
              favs.push(uid);
              append_li("#favorites",uid);
              if($(".ph_team .cls_"+uid).length>0)
                $("#favorites .cls_"+uid).hide();
            }
            hists_prune(uid);
            save_favs();
            load_uid(uid,5*60);
          }
          $(xn).replaceWith('<iframe id="xif0" sandbox="allow-forms allow-same-origin"></iframe>');
          console.log("FIN");
          console.log(unknown_uids);
          offer_workers[0].resolve();
          load_uids_job();
          offer_job();
        }).attr("src","/offer_members/");
    }

    if(n<3&&orig_uids.length<3&&hidden_uids.length>0){
      var m=orig_uids.length;
      for(var i=0;i<offer_workers.length;i++){
        if(offer_workers[i].state()=="pending")continue;
        var uid=hidden_uids.shift();
        offer_workers[i]=kick_load_uid_offer(uid);
        if(hidden_uids.length==0||!--m)break;
      }
    }

    return;
  }

  function load_uids_job(){
    var n=0;
    for(var i=0;i<load_uids_workers.length;i++){
      var s=load_uids_workers[i].state();
      if(s=="pending")n++;
      else if(unknown_uids.length>0){
        var uid=unknown_uids.shift();
        load_uids_workers[i]=kick_load_uid(uid);
        n++;
      }
    }
    console.log("NEW_LOAD:"+n+" / UNK_UIDS:"+unknown_uids.length);
    return $.Deferred().resolve();
  }

  function kick_load_uid(uid){
    return $.get("/idolooks/index/"+uid+"/", function(a){
        a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
        var t=$($.parseHTML(a));
        var d={mt:Math.floor((new Date).getTime()/1000)};
        if(t.find(".leftCol").length){
          localStorage[uid+".name"]=t.find(".profData dd.nickname span").text().replace(/\s/g,"");
          var ar=t.find(".profData dd.state").text().replace(/\s/g,"");
          console.log(uid+":"+localStorage[uid+".name"]+"("+ar+")");
          d["st"]=ar;
          d["ch"]=t.find(".charmArea img").map(function(){
              return $(this).attr("data-src").split("/")[3].match(/(.+)\.\w+$/)[1];
            }).get();
          d["co"]=t.find(".mycoordinate .vertically img").map(function(){
              return $(this).attr("data-src").split("/")[4].match(/(.+)\.\w+$/)[1];
            }).get();
          d["ac"]=t.find(".mycoordinate .horizontally img").map(function(){
              return $(this).attr("data-src").split("/")[4].match(/(.+)\.\w+$/)[1];
            }).get().join("/");
          set_av_from_large(uid,t.find(".profImg img").attr("data-src"));
          localStorage[uid+".data"]=JSON.stringify(uid_data[uid]=d);
          upd_li(uid);
        } else {
          console.log("FAILED(非公開?):"+uid);
          localStorage[uid+".data"]=JSON.stringify(uid_data[uid]=d);
          if(hidden_uids.indexOf(uid)<0){
            var av=get_av(uid);
            if(!localStorage[uid+".name"]
               ||!av
               ||((new Date).getTime()-av.mt*1000>=7*86400*1000)) {
              console.log("NAME:"+localStorage[uid+".name"]);
              if(av){
                console.log("av:"+av);
                console.log((new Date).getTime()-av.mt*1000);
              }
              hidden_uids.push(uid);
              offer_job();
            }
          }
        }
        return load_uids_job();
      });
  }

  function kick_load_uid_offer(uid) {
    return $.get("/offer_members/offer/"+uid+"/",function(a){
        a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
        var t=$($.parseHTML(a)).find(".profImg img,.offerCol p span");
        if(t.length>=2) {
          console.log(t);
          name=t.eq(1).text().replace(/\s/g,"");
          if(name=="ななし"&&localStorage[uid+".name"]!=name){
            console.log("OBSOLETED(ななし):"+uid);
            console.log(a);
            return;
          }
          if(!localStorage[uid+".name"])
            localStorage[uid+".name"]=name;
          set_av_from_large(uid,t.eq(0).attr("data-src"));
          upd_li(uid);
        }else{
          console.log(a);
        }
        offer_job();
      });
  }

  function add_nice(a) {
    a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
    a = $($.parseHTML(a)).find("div.commentCol");
    $(".ph_nice").html("");
    a.find("dl.topics-aktphone").each(function(){
        var dl=$(this);
        var uid=dl.find("a:first").attr("href").split("/")[3];
        console.log(uid);
        // 古いものは処理しない
        if($(".ph_nice .cls_"+uid).length>0)return;
        var texts=dl.find(".title").contents();
        var name=texts.eq(0).text();
        var av=dl.find("img:first").attr("data-src");
        // 非プレイヤキャラは一覧から除外(すまん)
        if(av.match(/chara|iface_imouth/))return;
        localStorage[uid+".name"]=name.substr(2,name.length-17);
        set_av(uid,av);
        var msg=texts.text().match(/「([^「」]*)」/);
        if(msg){
          msgs[uid]=msg[1];
          var stamp=dl.find("img.imgstamp").attr("data-src");
          if(stamp){
            msgs[uid]+=' <img src="'+stamp+'" class="imgstamp">';
          }
        }
        append_li(".ph_nice",uid);
        load_uid(uid,12*3600);
      });
  }

  function adduid(f,a,sec) {
    if(!sec)sec=5*60;
    if(f=="ph_team") {
      $("#favorites li").show();
      $("#hists li").show();
      a.html(a.find("li").detach().sort(function(a,b){
          var ai=favs.indexOf($(a).find("a").attr("href").split("/")[3]);
          var bi=favs.indexOf($(b).find("a").attr("href").split("/")[3]);
          if(ai<0&&bi<0)return 0;
          if(ai>=0&&bi>=0)return ai-bi;
          return bi-ai;
          }));
    }
    $("."+f).html("");
    a.find("li").each(function() {
        var li=$(this);
        var img=li.find(".load_image img");
        var av=img.attr("data-src");
        if(!av)av=img.attr("src");
        if(av.match(/chara|iface_imouth/)){
          // 非プレイヤキャラを選択不能にする
          li.find("a").click(function(e){e.preventDefault();});
          return;
        }
        var a=li.find("a:first");
        var uid=a.attr("href").split("/")[3];
        var cuid=".cls_"+uid;
        localStorage[uid+".name"]=li.find(".idolook span").text();
        set_av(uid,av);
        append_li("."+f, uid);
        if(li.find("span.img_webfriend").length>0){
          $(cuid+" .img_webfriend").remove();
          $(cuid+" .av").append('<span class="img_webfriend"></span>');
        }
        load_uid(uid,sec);
        if(f=="ph_team") {
          if(favs.indexOf(uid)<0&&hists.indexOf(uid)<0) {
            hists.unshift(uid);
            append_li("#hists",uid,true);
          }
          $("#favorites "+cuid).hide();
          $("#hists "+cuid).hide();
        }
      });
    save_favs();
    // FIXME: Update ph_offer.
    hide_self();
  }

  function sel_uid() {
    var uid=$(this).attr("href").split("/")[3];
    load_uid(uid,60);
    var i=ofl_uids.indexOf(uid);
    if(i>=0) {
      $("#ofl_"+i).replaceWith(ofl_ph(i));
      ofl_uids[i]=undefined;
      upd_sel_offer(uid,false);
      return false;
    }
    i=ofl_uids.indexOf(undefined);
    if(i<0) {console.log(uid+":full"); console.log(ofl_uids);return false;}
    ofl_uids[i]=uid;
    replace_li($("#ofl_"+i),uid);
    $(".offerlistWrap .cls_"+uid).attr("id","ofl_"+i);
    console.log(orig_uids);
    return false;
  }

  function do_offer() {
    $(".btn_offer").css("visibility","hidden");
    offer_state="do_rm";
    offer_job();
    return false;
  }

  function kick_offer_cancel(uid){
    var a=$.get("/offer_members/offer_cancel/"+uid+"/");
    a.then(function(a){
      a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
      var a=$(a);
      var id=a.find("#fromOfferMemberMemberId");
      var tk=a.find("#fromOfferMemberToken");
      var form={};
      if(id.length>0&&tk.length>0) {
        form[id.attr("name")] = id.val();
        form[tk.attr("name")] = tk.val();
        return $.post("/offer_members/cancel_comp",
                      form,
                      offer_job,
                      "html");
      } else {
        console.log("EMPTY");
        return offer_job();
      }
      });
    return a;
  }

  function kick_offer(uid){
    var a=$.get("/offer_members/offer/"+uid+"/");
    a.then(function(a){
        a=a.replace(/<img[^>]+>/g,"");
        var a=$(a);
        var id=a.find("#fromOfferMemberMemberId");
        var tk=a.find("#fromOfferMemberToken");
        var form={};
        if(id.length>0&&tk.length>0) {
          form[id.attr("name")] = id.val();
          form[tk.attr("name")] = tk.val();
          return $.post("/offer_members/comp",
                 form,
                 offer_job,
                 "html");
        } else {
          console.log("ERROR");
          console.log($(".txt_offer-error01").html());
          return offer_job();
        }
      });
    return a;
  }

  function do_offer_comp(){
        console.log("ADD COMPLETED");
        $.get("/offers/", function(a) {
            a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
            var a=$($.parseHTML(a));
            console.log(a.find(".offerlistWrap"));
            $(".offerlistWrap").replaceWith(a.find(".offerlistWrap"));
            do_ofl();
          });
        $.get("/my_datas/teammate/",
              function(a) {
                a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
                var a = $($.parseHTML(a)).find(".list-teammate ul");
                adduid("ph_team",a,3*60);
              });
  }

  function do_nice(){
    var arg={
      'width':1160,
      'height':700,
      'prevEffect':'none',
      'nextEffect':'none',
      'autoSize':true,
      'closeBtn':false,
      'scrolling':'no',
      'centerOnScroll':false,
      'padding':0,
      'margin':[50,0,0,49],
      'helpers':{
        'overlay':{
          'closeClick':false
        }
      },
      'afterShow':function(){
        var fb=$("div.fancybox-inner");
        fb.find(".popup-close").click(function(){
            $.fancybox.close();
            return false;
          });
        var btn=fb.find("#TNiceDetailSubmit");
        btn.unbind("click").removeAttr("onclick").click(function(){
            var uid;
            var form={};
            var res={};
            var ds=[];
            var a=fb.find("#TNiceDetailForm").serializeArray();
            for(var i=0;i<a.length;i++){
              if(!a[i].value)continue;
              form[a[i].name]=a[i].value;
            }
            if(!form["data[TNice][nice_comment_id]"])return false;
            console.log(form);
            for(var i=0;i<ofl_uids.length;i++){
              uid=ofl_uids[i];
              if(!uid)continue;
              console.log(uid);
              ds.push(send_nice(uid,form,res));
            }
            $.when.apply($,ds).then(function(){
                var article=false;
                var successful="";
                var error=false;
                for(var i=0;i<ofl_uids.length;i++){
                  var uid=ofl_uids[i];
                  if(!uid)continue;
                  var a=$($.parseHTML("<div>"+res[uid]+"</div>"));
                  if(!article){
                    console.log(res[uid]);
                    console.log(a);
                    fb.find("article").replaceWith(a.find("article").clone());
                    fb.find(".niceCol").html("");
                    article=true;
                  }
                  if(res[uid].match(/error[0-9]+/)){
                    a=a.find(".txt_popup-nice");
                    var av=get_av(uid);
                    if(av)a.prepend('<img src="'+av.img+'" width=200>');
                    a.css({"text-align":"left","padding-top":"1em","padding-bottom":"1em"});
                    fb.find(".niceCol").append(a);
                    error=true;
                  }else{
                    if(a.find(".img_coin").length>0||!successful)
                      successful=a.find(".niceCol").html();
                  }
                }
                if(successful)fb.find(".niceCol").prepend(successful);
                if(error){
                  fb.find("article a").unbind("click").removeAttr("onclick")
                    .click(function(){
                        console.log("Closing...");
                        $.fancybox.close();
                        return false;
                      });
                }else{
                  fb.find(".popup-close").hide();
                  $.fancybox.close();
                }
              });
            return false;
          });
      },
      'type': "iframe",
    };
    arg.content=obj_nice_dialog;
    $.fancybox(arg);
    return false;
  }

  function send_nice(uid,form,res){
    var xf=$.extend(form,{"data[TNice][rand_number]":uid});
    return $.post("/nices/in_nice/",xf,function(a){res[uid]=a;},"html");
  }

  function do_imp() {
    var t=$("#imp_text").val();
    console.log(t);
    var s=t.match(/\b[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/gm);
    var u=t.match(/idolook\.aikatsu.com\/[-/0-9A-Z_a-z]+\/([0-9A-Z_a-z]{16})\b/gm);
    var uids=[];
    if(s){offer_sers=s;offer_job();}
    if(u)for(var i=0;i<u.length;i++)uids.push(u[i].substr(u[i].length-16,16));
    console.log(uids);
    console.log(uids.length);
    for(var i=0;i<uids.length;i++){
      var uid=uids[i];
      if(new_favs.indexOf(uid)<0)new_favs.push(uid);
      if(favs.indexOf(uid)<0) {
        favs.push(uid);
        append_li("#favorites",uid);
        if($(".ph_team .cls_"+uid).length>0)
          $("#favorites .cls_"+uid).hide();
      }
      hists_prune(uid);
      load_uid(uid,5*60);
    }
    save_favs();
    $("#xacc").show();
    $("#ximp").hide();
    hide_self();
  }

  function do_favs_exp() {
    do_exp("Favorites",favs);
  }

  function do_hists_exp() {
    do_exp("History",hists);
  }

  function do_exp(hdr,uids) {
    var s="";
    for(var i=0;i<uids.length;i++){
      var uid=uids[i];
      var name=localStorage[uid+".name"];
      if(!name)name="？？？";
      s+=name+" https://idolook.aikatsu.com/idolooks/index/"+uid+"/\n";
    }
    $("#imp_text").val(hdr+"("+uids.length+")\n"+s);
    $("#xacc").hide();
    $("#ximp").show();
  }

  function do_favs_del(){
    do_favs_exp();
    if(!window.confirm("Favoritesを全削除します。\n削除前の内容はHistoryに移動します。"))
      return;
    new_favs=[];
    for(var i=favs.length-1;i>=0;--i){
      var uid=favs[i];
      if(hists.indexOf(uid)<0){
        hists.unshift(uid);
        append_li("#hists",uid,true);
      }
    }
    favs=[];
    $("#favorites").html("");
    save_favs();
  }

  function do_hists_del(){
    do_hists_exp();
    if(!window.confirm("Historyを全削除します。\n削除前の内容はエクスポートされています。"))
      return;
    $("#hists").html("");
    hists=[];
    save_favs();
  }
})()
