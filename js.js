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
#xusers form input[type="submit"] {
  padding: 0 1em 0 1em;
  margin-left: 1em;
}
</style>*/});
  }

  function do_ready(){
    do_relogin();
  }

  function do_relogin(){
    var d_uid=$.Deferred().resolve();
    window.JSJCJK.my_uid=undefined;

    var users=localStorage["users"];
    users=users?users.split('/'):[];
    var creds=localStorage["creds"];
    creds=creds?JSON.parse(creds):{};

    $("#container>div").removeAttr("id").hide();
    $("#container").append('<div id="wrapCol" class="jslogin"></div>');
    add_ht("#wrapCol",function(){/*
<iframe id="ls" name="ls" width=100% height=70%></iframe>
<div id="xusers">
  <base href="/idolooks/index/">
    <ul id="users">
    </ul>
  </base>
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
    for(var i=0;i<users.length;i++){
      var uid=users[i];
      if(!creds[uid])continue;
      if(!creds[uid]["mailto"])continue;
      var name=localStorage[uid+".name"];
      if(!name)name="？？？";
      var av=localStorage[uid+".av"];
      av=av?JSON.parse(av):{img:"/images/icon/chara/1.png"};
      $("#users").append('<li id="'+uid+'" class="uid"><a href="'+uid+'"><span class="av"><img src="'+av.img+'"></span><span class="name_row">'+name+'</span></a></li>');
    }
    $("#ls").hide().css("width","100%").css("height","70%").load(login);
    $("#users a").click(function(){
        var uid=$(this).attr("href");
        console.log("Click:"+uid);
        window.JSJCJK.my_uid=uid;
        console.log(creds);
        console.log(creds[uid]);
        $("#spad .MMemberMail").val(creds[uid]["mailto"]);
        $("#spad .MMemberPassword").val(creds[uid]["passwd"]);
        $("#spad").submit();
        return false;
      });
    return false;

    function login(){
      var ls=$("#ls").contents();
      console.log(window.ls.document);
      console.log(ls.find("script").text());
      if(ls.find("div:first").length==0)return;
      var name=ls.find("#nickname span").text().replace(/\s/g,"");
      console.log(name);
      if(!name){
        alert("ログインできませんでした。");
        alert(ls.find("html").html());
        return;
      }
      $("#header").replaceWith(ls.find("#header"));
      $("#footer").replaceWith(ls.find("#footer"));
      var ncoin=Number($("#coinCun span").text());
      console.log(ncoin);
      var uid=window.JSJCJK.my_uid;
      d_uid=$.get("/m_members/edit/",window.JSJCJK.get_my_uid);
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
        window.JSJCJK.login_completed(uid);
      }
    }
  }
 })()
