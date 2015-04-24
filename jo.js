(function(){
  document.oncontextmenu=null;
  $(".btn_back").hide();

  var my_uid;
  var hide_self=function(){
    if(my_uid)
      $(".cls_"+my_uid).hide();
  }

  upd_css();
  add_xcol();
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

  function hd(fn){return fn.toString().match(/[^]*\/\*([^]*)\*\/;?\}$/)[1];}
  function add_ht(flt,fn){$(flt).append(hd(fn));}

  function add_xcol(){
    add_ht('#wrapCol', function(){/*
<div id="xcol">
  <div id="xacc" class="xacc">
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
    <h2>マイフレンド</h2>
    <div>
      <h3>チームメイト</h3>
      <ul class="ph_team verbose"><li>Loading...</li></ul>
      <h3>マイフレンド</h3>
      <ul class="ph_myfriends small"><li>Loading...</li></ul>
      <h3>いいね!</h3>
      <ul class="ph_nice verbose"><li>Loading...</li></ul>
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
      <iframe id="xif0"></iframe>
      <iframe id="xif1"></iframe>
      <iframe id="xif2"></iframe>
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
  width: 100%
}
#gnavi {
  height: 338px !important;
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
}
#xcol {
  clear: both;
  width: 1200px;
  overflow:hidden;
  line-height:1.3;
  padding-top:4px;
  padding-left:0px;
}
#xcol ul {margin-left:4em;}
#xcol h2+div {
  background:white;
}
#xcol h2 {
  font-size:3.5em;
}
#xcol h3 {
  font-size:36pt;
  padding-top:10px;
}
#xcol ul+h3 {
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
#xcol input {font-size:24pt;margin-left:3em;}

#xcol .ui-widget {font-family:inherit;}

.xacc {
  height:100%;
}

.xacc>ul {
}

.xacc>ul>li {
  display:inline-block;
  padding: 4pt 18pt 0pt 18pt;
  font-size:40pt;
  background-color:lightgray;
  border:inset;
  border-bottom:none;
}

.xacc>ul>li a {
  color:black
}

.xacc .active {
  background:white;
  border:outset;
  border-bottom:none;
}

.xacc>div {
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
.verbose span.ph_new  {display:block;}
.verbose span.ph_offer {
  display: block;
  top: -80px;
}
.verbose span.img_webfriend {display:block;bottom:73%;}
.verbose .name_row {width:144pt;text-align:initial;font-size:24pt;}
.verbose .name+span {display:none;}
.verbose .pref {width:100pt;font-size:20pt;}
.verbose .pref span.suf {display:inline;}
.verbose .charms {width:6.5em;top:0px;left:0px;height:auto;}
.verbose .charms img {width:60px;}
.verbose .coord {top:0px;left:0px;height:auto;}
.verbose .coord .TBS img {width:54px;height:auto;}
.verbose .coord .A img {width:auto;height:54px;}

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
    var xcol=$("#xcol");
    var xcolm=xcol.outerHeight(true)-xcol.height();
    xcol.height($('#wrapCol').innerHeight()-338-110);
    var navs="";
    var i=0;
    $("#xcol h2").each(function(){
        $(this).next("div").attr("id","x"+i);
        navs+='<li><a href="#x'+i+'">'+$(this).text()+'</a></li>';
        $(this).remove();
        i++;
      });
    $(".xacc").prepend('<ul>'+navs+'</ul>');
    $(".xacc>ul>li:eq(0)").addClass("active");
    $(".xacc>div:gt(0)").hide();
    var xacc=$(".xacc>div:first");
    var xm=xacc.outerHeight(true)-xacc.height();
    $(".xacc>div").height($(".xacc").innerHeight()-$(".xacc>ul").outerHeight(true)-xm);
    $(".xacc>ul>li a").click(function(){
        $(".xacc>ul>li").removeClass("active");
        $(".xacc>div").hide();
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
    $("#xcol h3").click(change_view);
    reset_view();
  }

  var uid_data={};
  var uid_avs={};

  var offer_state="";
  var offer_workers=new Array(3);
  for(var i=0;i<offer_workers.length;i++){
    offer_workers[i]=$.Deferred();
    offer_workers[i].resolve();
  }

  function ofl_ph(i) {return '<li id="ofl_'+i+'"><a><span class="av"></span></a></li>';}

  var favs;
  var new_favs;
  var hists;

  favs=localStorage["favorites"];
  favs=favs?favs.split("/"):[];

  new_favs=localStorage["favorites_new"];
  new_favs=(new_favs!=null?new_favs.split("/"):favs.slice(0));
  if(new_favs.length==0)$("#do_new_as_read").hide();

  hists=localStorage["histories"];
  hists=hists?hists.split("/"):[];

  function do_new_as_read(){
    new_favs=[];
    $("#xcol span.new").remove();
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

  var ofl_uids=[];
  var orig_uids=[];
  var hidden_uids=[];
  var offer_sers=[];

  function cre_li(uid){
    var li=$($.parseHTML(hd(function(){/*
<li class="uid">
  <a href="">
    <span class="av">
      <img src="/images/icon/chara/1.png"/>
      <span class="ph_offer"></span>
      <span class="ph_new"></span>
    </span>
    <span class="name_row">
      <span class="name">？？？</span><span>(<span class="state">---</span>)</span>
      </span>
    </span>
    <span class="pref">
      <span class="state">---</span><span class="suf"></span>
    </span>
    <span class="data charms"></span>
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

  var load_uids_workers=new Array(4);
  for(var i=0;i<load_uids_workers.length;i++){
    load_uids_workers[i]=$.Deferred();
    load_uids_workers[i].resolve();
  }

  var unknown_uids=[];
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

  for(var i=0;i<favs.length;i++){
    var uid=favs[i];
    append_li("#favorites", uid);
    load_uid(uid,23*3600);
  }

  function hists_prune(uid){
    var i=hists.indexOf(uid);
    if(i<0)return;
    hists.splice(i,1);
    $("#hists .cls_"+uid).remove();
  }

  for(var i=0;i<hists.length;++i){
    var uid=hists[i];
    if(favs.indexOf(uid)>=0){
      hists.splice(i,1);
    }else{
      append_li("#hists",uid);
      if(!localStorage[uid+".name"])load_uid(uid);
    }
  }

  hide_self();

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

  $("#gnavi ul").prepend('<li class="btn_offer"><a href="/offers/">オファー</a></li>');
  $(".btn_offer").hide();
  $(".btn_offer").click(do_offer);

  do_ofl();

  function do_ofl() {
    ofl_uids.length=0;
    orig_uids.length=0;
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
    $(".btn_offer").show();
    offer_job();
  }

  $.when(
    $.get("/my_datas/teammate/",function(a) {
        var a = $($.parseHTML(a)).find(".list-teammate ul");
        adduid("ph_team",a,3*60);
        $(".btn_offer").show();
      }),
    $.get("/my_datas/bds_frend_lists/", function(a) {
        var a = $($.parseHTML(a)).find(".list-myfriend ul");
        adduid("ph_myfriends",a,23*3600);
      }),
    $.get("/my_datas/pend_lists/", function(a) {
        var a = $($.parseHTML(a)).find(".list-from_request ul");
        adduid("ph_requested",a,6*86400);
      }),
    $.get("/t_infos/nice/", function(a) {
        var a = $($.parseHTML(a)).find("div.commentCol");
        add_nice(a);
      }));

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
        if(ofl_uids.indexOf(uid)>=0)continue;
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
          $(xn).replaceWith('<iframe id="xif0"></iframe>');
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
    console.log("NEW_LOAD:"+n);
    console.log("UNK_UIDS:"+unknown_uids.length);
    return $.Deferred().resolve();
  }

  function kick_load_uid(uid){
    return $.get("/idolooks/index/"+uid+"/", function(a){
        var t=$($.parseHTML(a));
        var d={mt:Math.floor((new Date).getTime()/1000)};
        if(t.find(".leftCol").length){
          localStorage[uid+".name"]=t.find(".profData dd.nickname span").text().replace(/\s/g,"");
          var ar=t.find(".profData dd.state").text().replace(/\s/g,"");
          console.log(uid+":"+localStorage[uid+".name"]+"("+ar+")");
          d["st"]=ar;
          d["ch"]=t.find(".charmArea img").map(function(){
              return $(this).attr("src").split("/")[3].match(/(.+)\.\w+$/)[1];
            }).get();
          d["co"]=t.find(".mycoordinate .vertically img").map(function(){
              return $(this).attr("src").split("/")[4].match(/(.+)\.\w+$/)[1];
            }).get();
          d["ac"]=t.find(".mycoordinate .horizontally img").map(function(){
              return $(this).attr("src").split("/")[4].match(/(.+)\.\w+$/)[1];
            }).get().join("/");
          set_av_from_large(uid,t.find(".profImg img").attr("src"));
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
          set_av_from_large(uid,t.eq(0).attr("src"));
          upd_li(uid);
        }else{
          console.log(a);
        }
        offer_job();
      });
  }

  function add_nice(a) {
    $(".ph_nice").html("");
    a.find("dl.topics-aktphone").each(function(){
        var dl=$(this);
        var uid=dl.find("a:first").attr("href").split("/")[3];
        console.log(uid);
        var texts=dl.find(".title").contents();
        var name=texts.eq(0).text();
        var av=dl.find("img:first").attr("src");
        // 非プレイヤキャラは一覧から除外(すまん)
        if(av.match(/chara|iface_imouth/))return;
        localStorage[uid+".name"]=name.substr(2,name.length-17);
        set_av(uid,av);
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
        var av=li.find(".load_image img").attr("src");
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
    $(".btn_offer").hide();
    offer_state="do_rm";
    offer_job();
    return false;
  }

  function kick_offer_cancel(uid){
    var a=$.get("/offer_members/offer_cancel/"+uid+"/");
    a.then(function(a){
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
            var a=$($.parseHTML(a));
            console.log(a.find(".offerlistWrap"));
            $(".offerlistWrap").replaceWith(a.find(".offerlistWrap"));
            do_ofl();
          });
        $.get("/my_datas/teammate/",
              function(a) {
                var a = $($.parseHTML(a)).find(".list-teammate ul");
                adduid("ph_team",a,3*60);
              });
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
