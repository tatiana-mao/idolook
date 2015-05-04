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

  function do_ready(){
    do_relogin();
  }

  function reset_ls(){
    $("#ls").unbind("load");
    $("#ls").replaceWith('<iframe id="ls" name="ls" width=100% height=70% sandbox="allow-same-origin allow-forms"></iframe>');
    $("#ls").hide();
  }

  function do_relogin(){
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
    <input type="submit" value="ログイン" />
  </form>
  <form action="/m_member_logins/logout/">
    <input type="submit" value="完全にログアウトする..."/>
  </form>
</div>
*/});
    set_disabled();
    $.get("/m_member_logins/logout/",function(){
        $("#wrapCol").css("opacity","");
        $("#header p").hide();
        disabled=false;
      });

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
 })()
