(function(){
  document.oncontextmenu=null;
  function hd(fn){return fn.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];}
  function add_ht(flt,fn) {
    $(flt).append(hd(fn));
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

  function set_cookie(k,v) {
    var xp=new Date();
    xp.setTime(xp.getTime() + 1000*86400*60);
    document.cookie=k+"="+v+"; path=/; expires="+xp.toUTCString();
  }

  var cookies=load_cookies();

  var cssLink = $("<link>");
  $("head").append(cssLink);
  cssLink.attr({
    rel:  "stylesheet",
    type: "text/css",
    href: "/css/myfriend.css"
  });
  upd_css();

  add_ht('#wrapCol', function(){/*
<div id="xcol" class="list-teammate">
  <div id="xacc">
    <h2>Favorites</h2>
    <div>
      <h3>チームメイト</h3>
      <ul class="ph_team"><li>Loading...</li></ul>
      <h3>Favorites</h3>
      <ul id="favorites">
      </ul>
      <br/>
      <br/>
      <br/>
      <div class="xix">
        <input type="button" id="mode_imp" value="インポート"/>
      </div>
    </div>
    <h2>マイフレンド</h2>
    <div>
      <h3>チームメイト</h3>
      <ul class="ph_team"><li>Loading...</li></ul>
      <h3>マイフレンド</h3>
      <ul class="ph_myfriends"><li>Loading...</li></ul>
      <h3>いいね!</h3>
      <ul class="ph_nice"><li>Loading...</li></ul>
      <h3>ウェブとも候補</h3>
      <ul class="ph_requested"><li>Loading...</li></ul>
    </div>
    <h2>History</h2>
    <div>
      <ul class="ph_history"><li>Loading...</li></ul>
    </div>
  </div>
  <div id="ximp">
    <div>
      <input type="button" id="imp_sub" value="インポート"/>
      <input type="button" id="imp_cancel" value="キャンセル"/>
    </div>
    <textarea id="imp_text"></textarea>
  </div>
</div>
*/});
  $("#ximp").hide();
  var xp_acc_n=2;
  cssLink.ready(xp_acc);
  $.getScript("https://code.jquery.com/jquery-migrate-1.2.1.js", xp_acc);

  rrr();

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
  width: 100%;
  padding-top:4px;
  padding-left:0px;
}
#xcol h2+div {
  background:white;
}
#xcol li {
  display: block;
  float: left;
}
#xcol h2 {
  font-size:3.5em;
}
#xcol h3 {
  clear: both;
  font-size:2em;
}
.xix {
  clear:both;
  padding-top:3em;
}
#ximp {height:100%;}
#ximp div {font-size:24pt;}
#ximp textarea {
  width:96%;
  height:95%;
  margin-top:8px;
}
#xcol input {font-size:24pt;margin-left:3em;}
.list-teammate ul {
  padding-left:240px;
}
.half_offer {opacity:0.4;}
.list-offerlist .offerlistWrap a.btn_offer-cancel {display:none;}
</style>*/});
  }

  function xp_acc() {
    if(--xp_acc_n) return;
    console.log($('#wrapCol').innerHeight());
    $('#xcol').height($('#wrapCol').innerHeight()-338-110);
    $('#xacc').accordion({fillSpace:true,icons:{}});
    $("#mode_imp").click(function(){
        $("#xacc").hide();
        $("#ximp").show();
        $("#imp_text").val("URLもしくはICカード番号を貼れ!\n");
      });
    $("#imp_sub").click(do_imp);
    $("#imp_cancel").click(function(){
        $("#xacc").show();
        $("#ximp").hide();
      });
  }

  function ofl_ph(i) {return '<li id="ofl_'+i+'"><a class="myroom"></a></li>';}

  var uid_names={};
  var uid_avs={};
  var favs;
  var unknown_uids=[];

  favs=localStorage["favorites"];
  if(favs) {
    favs=favs.split("/");
  } else {
    favs=[];
  }

  function create_fav(uid) {
    var a=$($.parseHTML('<li><a href=""><div class="load_image"><img src="" width=161></div><div class="idolook"><span></span>(ひみつ)</div><span class="ph_offer"></span></a></li>'));
    a.addClass("cls_"+uid);
    a.find("a").attr("href","/idolooks/index/"+uid+"/").click(sel_uid);
    if(uid in uid_names){
      console.log("FAV_UPD("+uid_names[uid]+"):"+uid);
      a.find(".idolook span").text(uid_names[uid]);
    } else {
      var name=localStorage["name_"+uid];
      if(name) {
        console.log("UNKONOW("+name+"):"+uid);
        a.find(".idolook span").text(name);
      } else {
        console.log("UNKONOW:"+uid);
        a.find(".idolook span").text("？？？");
      }
      if(unknown_uids.indexOf(uid)<0)unknown_uids.push(uid);
    }
    var av=null;
    if(uid in uid_avs) {
      av=uid_avs[uid];
    } else {
      av=localStorage["av_"+uid];
    }
    if(av) {
      uid_avs[uid]=av;
      a.find(".load_image img").attr("src",av);
    }
    return a;
  }

  for(var i=0;i<favs.length;i++){
    var a=create_fav(favs[i]);
    $("#favorites").append(a);
  }

  function fav_upd(uid) {
    console.log("FAV:"+uid);
    var i=favs.indexOf(uid);
    if(i>=0)favs.splice(i,1);
    favs.unshift(uid);
    var a=create_fav(uid);
    a.find(".ph_offer").addClass("img_offer");
    console.log($("#favorites .cls_"+uid));
    $("#favorites .cls_"+uid).remove();
    $("#favorites").prepend(a);
    $("#favorites .cls_"+uid).hide();
  }

  var ofl_uids=[];
  var orig_uids=[];
  ofl();
  function ofl() {
    ofl_uids.length=0;
    orig_uids.length=0;
    $(".offerlistWrap > div").replaceWith("<div></div>");
    adduid("offerlistWrap",$(".offerlistWrap"));
    var ofl=$(".offerlistWrap li");
    console.log(ofl);
    var i;
    for(i=0;i<3;i++) {
      var li=ofl.eq(i);
      if(li.length==0) break;
      li.attr("id","ofl_"+i);
      var uid=li.find("a:first").attr("href").split("/")[3];
      orig_uids.push(ofl_uids[i]=uid);
      $(".cls_"+uid+" > a > .ph_offer").replaceWith("<span class='ph_offer img_offer'>Offer</span>");
      console.log(li.find(".idolook span").text());
      uid_names[uid]=li.find(".idolook span").text();
      uid_avs[uid]=li.find(".load_image img").attr("src");
      localStorage["name_"+uid]=uid_names[uid];
      localStorage["av_"+uid]=uid_avs[uid];
      console.log(uid_avs[uid]);
      fav_upd(uid);
    }
    console.log(orig_uids);
    for(;i<3;i++) {
      $(".offerlistWrap").append(ofl_ph(i));
      ofl_uids[i]=undefined;
    }
    localStorage["favorites"]=favs.join("/");
    $(".btn_offer").show();
  }

  $("#gnavi ul").prepend('<li class="btn_offer"><a href="/offers/">オファー</a></li>');
  $(".btn_offer").click(do_offer);

  function rrr() {
    var fr_n=4;
    $.get("/my_datas/teammate/",function(a) {
        var a = $($.parseHTML(a)).find(".list-teammate ul");
        adduid("ph_team",a);
        rrr_comp();
      });

    $.get("/my_datas/bds_frend_lists/", function(a) {
        var a = $($.parseHTML(a)).find(".list-myfriend ul");
        adduid("ph_myfriends",a);
        rrr_comp();
      });
    $.get("/my_datas/pend_lists/", function(a) {
        var a = $($.parseHTML(a)).find(".list-from_request ul");
        adduid("ph_requested",a);
        rrr_comp();
      });
    $.get("/t_infos/nice/", function(a) {
        var a = $($.parseHTML(a)).find("div.commentCol");
        add_nice(a);
        rrr_comp();
      });
    function rrr_comp() {
      if(--fr_n>0) return;
      console.log("UNRESOLVED UIDS:");
      console.log(unknown_uids);
    }
  }

  function upd_unk_av(uid) {
    var i=unknown_uids.indexOf(uid);
    if(i<0)return;
    a=$("#favorites .cls_"+uid);
    console.log("FOUND:"+uid_names[uid]);
    a.find(".idolook span").text(uid_names[uid]);
    a.find(".load_image img").attr("src",uid_avs[uid]);
    unknown_uids.splice(i,1);
  }

  function add_nice(a) {
    $(".ph_nice").replaceWith('<ul class="ph_nice clearfix">');
    a.find("dl.topics-aktphone").each(function(){
        var dl=$(this);
        var uid=dl.find("a:first").attr("href").split("/")[3];
        console.log(uid);
        var texts=dl.find(".title").contents();
        var name=texts.eq(0).text();
        name=name.substr(2,name.length-17);
        uid_names[uid]=name;
        uid_avs[uid]=dl.find("img:first").attr("src");
        localStorage["name_"+uid]=uid_names[uid];
        localStorage["av_"+uid]=uid_avs[uid];
        upd_unk_av(uid);
        var a=create_fav(uid);
        $(".ph_nice").append(a);
      });
  }

  function adduid(f,a) {
    if(f=="ph_team") {
      $("#favorites li").show();
      a.html(a.find("li").detach().sort(function(a,b){
          var ai=favs.indexOf($(a).find("a").attr("href").split("/")[3]);
          var bi=favs.indexOf($(b).find("a").attr("href").split("/")[3]);
          if(ai<0&&bi<0)return 0;
          if(ai>=0&&bi>=0)return ai-bi;
          return bi-ai;
          }));
    }
    a.addClass(f);
    $("."+f).replaceWith(a);
    $("."+f+" .recognition").remove();
    $("."+f+" .denial").remove();
    $("."+f+" li").each(function() {
        var li=$(this);
        var a=li.find("a:first");
        var uid=a.attr("href").split("/")[3];
        li.find("img").attr("width",161);
        li.addClass("cls_"+uid);
        a.click(sel_uid);
        if(li.find("> a > .img_offer").length==0) {
          li.find("> a").append("<span class='ph_offer'></span>");
        }
        uid_names[uid]=li.find(".idolook span").text();
        uid_avs[uid]=li.find(".load_image img").attr("src");
        localStorage["name_"+uid]=uid_names[uid];
        localStorage["av_"+uid]=uid_avs[uid];
        upd_unk_av(uid);
        if(f=="ph_team") {
          $("#favorites .cls_"+uid).hide();
        }
      });
  }

  function sel_uid() {
    var uid=$(this).attr("href").split("/")[3];
    var i=ofl_uids.indexOf(uid);
    if(i>=0) {
      $("#ofl_"+i).replaceWith(ofl_ph(i));
      $(".cls_"+uid+" .img_offer").replaceWith("<span class='ph_offer'></span>");
      ofl_uids[i]=undefined;
      return false;
    }
    i=ofl_uids.indexOf(undefined);
    if(i<0) {console.log(uid+":full"); console.log(ofl_uids);return false;}
    ofl_uids[i]=uid;
    var tmpl=$(".cls_"+uid+":first").clone();
    tmpl.attr("id","ofl_"+i);
    tmpl.find("a").addClass("myroom").click(sel_uid);
    $("#ofl_"+i).replaceWith(tmpl);
    console.log(orig_uids);
    $(".cls_"+uid+" > a > .ph_offer").replaceWith("<span class='ph_offer img_offer"+(orig_uids.indexOf(uid)>=0?"":" half_offer")+"'>Offer</span>");
    return false;
  }

  function do_offer() {
    $(".btn_offer").hide();
    console.log(orig_uids);
    console.log(ofl_uids);
    var i;
    var uids_ary=[];
    for(i=0;i<orig_uids.length;i++)
      if(ofl_uids.indexOf(orig_uids[i])<0)
        uids_ary.push(orig_uids[i]);
    console.log(uids_ary);

    function remove_uids() {
      if(uids_ary.length==0) {
        console.log("RM COMPLETED");
        add_uids();
        return;
      }
      var uid=uids_ary.shift();
      console.log("REMOVE: "+uid);
      $.get("/offer_members/offer_cancel/"+uid+"/",offer_cancel_commit);
    }

    function offer_cancel_commit(a) {
      var a=$(a);
      var id=a.find("#fromOfferMemberMemberId");
      var tk=a.find("#fromOfferMemberToken");
      var form={};
      if(id.length>0&&tk.length>0) {
        form[id.attr("name")] = id.val();
        form[tk.attr("name")] = tk.val();
        $.post("/offer_members/cancel_comp",
               form,
               remove_uids,
               "html");
      } else {
        console.log("EMPTY");
        remove_uids();
      }
    }

    function add_uids() {
      var uids_ary=[];
      var i;
      for(i=0;i<ofl_uids.length;i++)
        if(ofl_uids[i]!=undefined)
          uids_ary.push(ofl_uids[i]);
      console.log(uids_ary);
      var f_uids=uids_ary.length;
      if(f_uids==0) {
        console.log("ADD EMPTY");
        add_completed();
        return;
      }
      for(i=0;i<f_uids;i++)
        $.get("/offer_members/offer/"+uids_ary[i]+"/",offer_commit);

      function offer_commit(a) {
        var a=$(a);
        var id=a.find("#fromOfferMemberMemberId");
        var tk=a.find("#fromOfferMemberToken");
        var form={};
        if(id.length>0&&tk.length>0) {
          form[id.attr("name")] = id.val();
          form[tk.attr("name")] = tk.val();
          $.post("/offer_members/comp",
                 form,
                 add_completed,
                 "html");
        } else {
          console.log("EMPTY");
          add_completed();
        }
      }

      function add_completed() {
        console.log(f_uids);
        if(f_uids&&--f_uids) return;
        console.log("ADD COMPLETED");
        $.get("/offers/", function(a) {
            var a=$($.parseHTML(a));
            console.log(a.find(".offerlistWrap"));
            $(".offerlistWrap").replaceWith(a.find(".offerlistWrap"));
            ofl();
          });
        $.get("/my_datas/teammate/",
              function(a) {
                var a = $($.parseHTML(a)).find(".list-teammate ul");
                adduid("ph_team",a);
              });
      }
    }

    remove_uids();

    return false;
  }

  function do_imp() {
    var t=$("#imp_text").val();
    console.log(t);
    var uids=t.match(/idolook\.aikatsu.com\/[-/0-9A-Z_a-z]+\/([0-9A-Z_a-z]{16})\b/gm);
    console.log(uids);
    console.log(uids.length);
    for(var i=0;i<uids.length;i++){
      var uid=uids[i].substr(uids[i].length-16,16);
      $("#favorites .cls_"+uid).remove();
      var a=create_fav(uid);
      favs.push(uid);
      $("#favorites").append(a);
    }
    localStorage["favorites"]=favs.join("/");
    $("#xacc").show();
    $("#ximp").hide();
  }
})()
