(function(b){
  if(typeof window.JSJCJK=="object"){
    console.log("********JS the Object");
    window.JSJCJK.js={
    load:do_load,
    ready:do_ready
    }
    return;
  }

  console.log("********JS -- standalone debug mode");
  document.oncontextmenu=null;
  window.JSJCJK={
  get_my_uid: function(a){
      var d=$($.parseHTML(a));
      var my_uid=d.find("#fe_text").val().match(/\/([0-9A-Z_a-z]{16})\//);
      if(my_uid)window.JSJCJK.my_uid=my_uid[1];
      console.log(my_uid);
    },
  reload:function(){
      console.log("Reloading...");
    },
  login_completed:function(uid){
      console.log("Login UID:"+uid);
    }
  };

  do_load();
  do_ready({});

  function hd(fn){return fn.toString().match(/[^]*\/\*([^]*)\*\/;?\}$/)[1];}
  function add_ht(flt,fn){$(flt).append(hd(fn));}

  function do_load(){
    add_ht("head", function(){/*<style type="text/css">
#xusers {
  background: white;
  border: outset 8px;
  margin: 4em 4em auto 4em;
  padding: 1em 0em 2em 18pt;
  line-height: 1.3;
}
#xusers .uid {
  display:block;
  float:left;
}
#xusers .av {
  display:block;
  width: 208px;
  height: 221px;
  background: url("/images/myfriend/bg_icon.png") no-repeat center top;
  background-size: cover;
}

#xusers .av img {
  width: 100%;
  height: auto;
  margin-top: 17%;
}

#xusers .name_row {
  font-size:24pt;
  display:block;
  text-align:center;
  font-weight:bold;
}
#xusers .coinbg{
  font-size: 190%;
  font-weight: bold;
  position: relative;
  display: inline-block;
  background: url(/images/common/bg_headercol.png) no-repeat center top;
  background-position: -645px -39px;
  width: 160px;
  height: 36px;
  color: white;
  line-height: 1.6;
  bottom: 83px;
  left: 23px;
}
#xusers .ncoin{
  text-align: right;
  display: inline-block;
  width: 90%;
}
#xusers form {
  clear: both;
  padding-top: 2em;
  font-size: 20pt;
}
#xusers form .MMemberMail {
  width: 18em;
}
#xusers form .MMemberPassword {
  width: 12em;
}
#xusers input[type="submit"] {
  padding: 8pt 1em 8pt 1em;
  margin-left: 1em;
}
</style>*/});

    if(location.pathname=="/"){
      $("#container-nologin").replaceWith('<div id="container">');
      $("#container").css("padding-top","1px");
    }
  }

  function do_ready(objs){
    do_relogin(objs);
  }

  function reset_ls(){
    $("#ls").unbind("load");
    $("#ls").replaceWith('<iframe id="ls" name="ls" width=100% height=70% sandbox="allow-same-origin allow-forms"></iframe>');
    $("#ls").hide();
  }

  function do_relogin(objs){
    var disabled=false;
    var d_uid=$.Deferred().resolve();
    var script=null;
    window.JSJCJK.my_uid=undefined;

    var users=localStorage["users"];
    users=users?users.split('/'):[];
    var creds=localStorage["creds"];
    creds=creds?JSON.parse(creds):{};

    $("#container>div").removeAttr("id").hide();
    $("#container").append('<div id="wrapCol" class="jslogin"></div>');
    add_ht("#wrapCol",function(){/*
<iframe id="ls"></iframe>
<div id="xusers">
  <ul id="users">
  </ul>
  <form id="spad" target="ls" action="/" method="POST">
    <input type="hidden" name="_method" value="POST"/>
    <input type="hidden" name="data[MMember][mail]" class="MMemberMail"/>
    <input type="hidden" name="data[MMember][password]" class="MMemberPassword"/>
  </form>
  <form id="creds" target="ls" action="/" method="POST">
    <input type="hidden" name="_method" value="POST"/>
    <input type="text" name="data[MMember][mail]" class="MMemberMail"/>
    <input type="password" name="data[MMember][password]" class="MMemberPassword"/>
    <input id="cred" class="forlogin" type="submit" value="ログイン" />
  </form>
  <form action="/m_member_logins/logout/">
    <input id="soshage" class="forlogin" type="submit" value="みんなでソシャゲ!"/>
    <input type="submit" value="完全にログアウトする..."/>
  </form>
</div>
*/});
    $("#soshage").click(do_soshage_all);
    set_disabled();
    var d_logout=(typeof objs=="object"&&objs.logout
                  ?objs.logout
                  :$.get("/m_member_logins/logout/"));
    d_logout.then(function(){
        $("#wrapCol").css("opacity","");
        $("#header p").hide();
        disabled=false;
      });

    if(users.length==0)$("#soshage").prop("disabled",true);
    for(var i=0;i<users.length;i++){
      var uid=users[i];
      if(!creds[uid])continue;
      if(!creds[uid]["mailto"])continue;
      var name=localStorage[uid+".name"];
      if(!name)name="？？？";
      var av=localStorage[uid+".av"];
      av=av?JSON.parse(av):{img:"/images/icon/chara/1.png"};
      var spad=localStorage[uid+".spad"];
      spad=spad?spad=JSON.parse(spad):{};
      if(!spad.ncoin)spad.ncoin="???";
      $("#users").append('<li id="'+uid+'" class="uid"><a id="'+uid+'" href="/idolooks/index/'+uid+'/"><span class="av"><img src="'+av.img+'"></span><span class="name_row">'+name+'</span><span class="coinbg"><span class="ncoin">'+spad.ncoin+'</span></span></a></li>');
    }
    $("#users a").click(function(){
        if(!set_disabled())return false;
        var uid=$(this).attr("id");
        console.log("Click:"+uid);
        window.JSJCJK.my_uid=uid;
        console.log(creds);
        console.log(creds[uid]);
        $("#spad .MMemberMail").val(creds[uid]["mailto"]);
        $("#spad .MMemberPassword").val(creds[uid]["passwd"]);
        $("#spad").submit();
        return false;
      });
    $("#creds").submit(set_disabled);
    return false;

    function set_disabled(){
      if($("#cred").prop("disabled"))return false;
      if(disabled){console.log("Disabled");return false;}
      $("#wrapCol").css("opacity","0.5");
      disabled=true;
      reset_ls();
      $("#ls").load(login);
      return true;
    }

    function login(){
      var ls=$("#ls").contents();
      console.log(window.ls.document);
      console.log(ls.find("script").text());
      var s=ls.find("head script").text().match(/\$\.fancybox\(({[^{}]*})\)/m);
      if(s&&s.length>=2){
        script=s[1].replace(/(\w+)\s*:/g,'"$1":').replace(/'(\w+)'\s*:/g,'"$1":').replace(/:'([^\']+)'/g,':"$1"');
        console.log(script);
      }
      if(ls.find("div:first").length==0)return;
      var coin=ls.find("#coinCun span");
      if(coin.length==0){
        ls=$("#ls");
        if(ls.attr("src")=="/m_members/edit/"){
          alert("困った。");
          alert(ls.find("html").html());
          return;
        }
        console.log("Redirecting to /edit/...");
        ls.attr("src","/m_members/edit/");
        return;
      }
      var ncoin=Number(coin.text());
      console.log(ncoin);
      var name=ls.find("#nickname span").text().replace(/\s/g,"");
      console.log(name);

      $("#header").replaceWith(ls.find("#header"));
      $("#footer").replaceWith(ls.find("#footer"));
      var uid=window.JSJCJK.my_uid;
      if(ls.find("#fe_text").length==1){
        window.JSJCJK.get_my_uid(ls.find("body").html());
        d_uid=$.Deferred().resolve();
      }else{
        d_uid=$.get("/m_members/edit/",window.JSJCJK.get_my_uid);
      }
      //FIXME: Reconfirm uid.
      window.JSJCJK.reload();
      $.when(d_uid).then(login_completed);
      return false;

      function login_completed(){
        var uid=window.JSJCJK.my_uid;
        console.log("UID:"+uid);
        if(!uid||!name)return;
        localStorage[uid+".name"]=name;
        console.log("name:"+name);
        var i=users.indexOf(uid);
        if(i>=0)users.splice(i,1);
        users.unshift(uid);
        localStorage["users"]=users.join('/');
        creds[uid]={
        mailto:$("#spad .MMemberMail").val(),
        passwd:$("#spad .MMemberPassword").val()
        };
        if(!creds[uid]["mailto"]){
          creds[uid]={
          mailto:$("#creds .MMemberMail").val(),
          passwd:$("#creds .MMemberPassword").val()
          };
        }
        localStorage["creds"]=JSON.stringify(creds);
        upd_ncoin(uid,ncoin,"#coinCun span");
        window.JSJCJK.login_completed(uid);
        console.log(uid+":LOGIN COMPLETED");
        if(script){
          try{
            $.fancybox(JSON.parse(script));
          }catch(e){
            alert("意味わかんね通知。次のヤツをコピペして教えれ。");
            alert(script);
            alert(e);
          }
        }
      }
    }
  }

  function upd_ncoin(uid,ncoin,sel){
    var spad=localStorage[uid+".spad"];
    spad=spad?spad=JSON.parse(spad):{};
    var oc=spad.ncoin;
    if(!oc)oc=0;
    var ac=ncoin-oc;
    console.log("NCOIN:"+ncoin+"(+"+ac+")");
    if(!ac)return;
    var acd=$('<span id="acd">+'+ac+'</span>')
      .css({
        right:-640,
        bottom:-940,
        "font-size":"8000%",
        opacity:1,
        color:"yellow",
        "text-shadow":"4px 4px 4px black",
        display:"inline-block",
        complete:function(s){$(sel).text(ncoin);},
        position:"absolute"})
      .animate({
        right:29,
        bottom:4,
        "font-size":"190%",
        },{
        duration:2000,
        easing:"easeOutExpo"})
      .animate({
        bottom:72,
        opacity:0
        },{
        duration:5000,
        easing:"easeInQuad",
        complete:function(s){acd.remove();}
        });
    $(sel).append(acd);
    spad.ncoin=ncoin;
    localStorage[uid+".spad"]=JSON.stringify(spad);
  }

  function getJSTDate(dt){
    var dt9=new Date(dt.getTime());
    dt9.setHours(dt9.getHours()+9);
    return dt9.getUTCFullYear()
      +"-"+("0"+(1+dt9.getUTCMonth())).slice(-2)
      +"-"+("0"+dt9.getUTCDate()).slice(-2);
  }

  function do_soshage_all(){
    var users=localStorage["users"];
    users=users?users.split('/'):[];
    $(".forlogin").prop("disabled",true);
    var d=null;
    for(var i=0;i<users.length;i++){
      var uid=users[i];
      if(!d)
        d=do_soshage(uid);
      else
        (function(uid){d=d.then(function(){return do_soshage(uid);});}(uid));
    }
    if(d)d.then(function(){
        return $.get("/m_member_logins/logout/",function(){
            $(".forlogin").prop("disabled",false);
          });
      });
    return false;
  }

  function do_soshage(uid){
    var d=$.Deferred();
    var ncoin='';
    var creds=localStorage["creds"];
    var requires_relogin=false;
    creds=creds?JSON.parse(creds):{};
    var form={
      "data[MMember][mail]":creds[uid]["mailto"],
      "data[MMember][password]":creds[uid]["passwd"],
      "_method":"POST"
    };

    dance_av($("#"+uid+" .av img"));

    $.post("/",form,function(){
        console.log(uid+":LOGGED IN:"+ncoin);
        $.when(do_nice())
          .then(function(){return do_avatar();})
          .then(function(){return do_myroom();})
          .then(function(){
              return requires_relogin?$.post("/",form):$.Deferred().resolve();
            })
          .then(function(){
              do_sched(uid).then(function(){
                  console.log(uid+":SOSHAGE COMP:"+ncoin);
                  upd_ncoin(uid,ncoin,"#"+uid+" .ncoin");
                  d.resolve();
                });
            });
      },"html");
    return d.promise();

    function dance_av(obj){
      obj
        .animate({"width":"90%","margin-top":"13%","margin-left":"5%"},
                 {duration:200,easing:"linear"})
        .animate({"width":"100%","margin-top":"17%","margin-left":"0%"},
                 {duration:200,easing:"linear",complete:dance_av_comp});

      function dance_av_comp(){
        if(d.state()=="pending")dance_av(obj);
      }
    }

    function do_nice(){
      var form={
        "data[TNice][rand_number]":"YibaYLPkFhMTp3Uc",
        "data[TNice][nice_comment_id]":6,
        "_method":"POST"
      }
      return $.post("/nices/in_nice/",form,function(a){
          if(a.match(/error[0-9]+/)){
            console.log(a);
          }else{
            console.log("Nice sent!");
            requires_relogin=true;
          }
        },"html");
    }

    function do_avatar(){
      var d=$.Deferred();
      $.post("/avatars/reset_chara/",{},function(a){
          var form={"_method":"POST"};
          a=a.replace(/<img[^>]+>/g,"");
          a=$($.parseHTML("<form>"+a));
          a.find("input").each(function(){
              form[$(this).attr("name")]=$(this).val();
            });
          $.post("/avatars/in_chara",form,function(a){d.resolve();},"html");
        },"html");
      return d.promise();
    }

    function do_myroom(){
      var d=$.Deferred();
      $.get("/myrooms/change_parts/1301/",function(a){
          a=a.replace(/<img[^>]+>/g,"");
          a=$($.parseHTML(a));
          console.log(a.find("#TMyroomMa1").val());
          $.get("/myrooms/upd_myroom/"+a.find("#TMyroomMa1").val(),function(a){
              d.resolve();
            });
        });
      return d.promise();
    }

    function do_sched(){
      var d=$.Deferred();
      var cal2={}
      var sched_n=7;
      var dt=new Date();
      dt.setDate(dt.getDate()+7);
      sched_dstoken(dt);
      return d.promise();

      function sched_dstoken(dt){
        if(--sched_n<0){
          d.resolve();
          return;
        }
        var ymd=getJSTDate(dt);
        console.log("SCHED:"+ymd);
        var form={
          "_method":"POST",
          "data[MScheduleStamp][stamp_id]":2,
          "data[TSchedule][date]":ymd,
          "data[MScheduleStamp][action]":1
        };
        return $.post("/schedules/comment_select",form,sched_submit,"html");

        function sched_submit(a){
          a=a.replace(/<img[^>]+>/g,"");
          a=$($.parseHTML(a));
          reset_ls();
          var ls=$("#ls").contents();
          console.log(a.find("#TScheduleDstoken").val());
          if(a.find("#TScheduleDstoken").length==0){
            console.log("Unable to register:"+ymd);
            $("#ls").hide()
              .load(sched_comp)
              .attr("src","/schedules/");
            return;
          }

          var body=ls.find("body");
          if(body.length==0)body=ls;
          body.html('<form action="/schedules/schedule_add_comp" id="MScheduleTypeCommentSelectForm" method="post" accept-charset="utf-8">');
          var form=ls.find("#MScheduleTypeCommentSelectForm");
          form.append(a.find("form input"));
          form.find("#TScheduleScheduleComment")
            .attr({type:"hidden"})
            .val("アイカツ!させる予定!");
          $("#ls").hide().load(sched_comp);
          form.submit();
        }

        function sched_comp(){
          var ls=$("#ls").contents();
          var scs=ls.find("ul.calendar>li>a");
          if(scs.length==0){
            console.log("ERROR");
            d.resolve();
            return;
          }
          var coin=ls.find("#coinCun span");
          if(coin.length==1)ncoin=Number(coin.text());
          scs.each(function(){
              var ymd=$(this).attr("href").match(/\d{4}-\d\d-\d\d/);
              if(!ymd)return;
              if($(this).find('img[src="/images/schedule/stamp/02.png"]').length>0){
                cal2[ymd]=true;
              }
            });
          console.log(cal2);
          var dt=new Date;
          for(var i=1;i<=7;i++){
            dt.setDate(dt.getDate()+1);
            if(!cal2[getJSTDate(dt)]){
              sched_dstoken(new Date(dt.getTime()));
              return;
            }
            console.log("Done -- "+getJSTDate(dt));
          }
          reset_ls();
          console.log("SCHED COMPLETED");
          d.resolve();
          return;
        }
      }
    }
  }
 })()
