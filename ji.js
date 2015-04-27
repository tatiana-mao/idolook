(function(){
  document.oncontextmenu=null;

  var b=window.JSJCJK;
  window.JSJCJK=new Object;
  b="https://rawgit.com/tatiana-mao/idolook/dev/";

  var active_class="";

  var jc=window.JSJCJK.jc={
  path:"/charms/",
  cls:".xcharms",
  link:css("charms"),
  btn:{
    py: "-200px",
    bg:"/images/myprofile/navi-btn.png"
  },
  toggle_btn:function(){return get_btn(jo);},
  js:load_script("jc")
  };

  var jo=window.JSJCJK.jo={
  path:"/offers/",
  cls:".xoffer",
  link:css("offer"),
  res:function(){
      return {
      myfriends:$.get("/my_datas/bds_frend_lists/"),
      requested:$.get("/my_datas/pend_lists/"),
      nice:$.get("/t_infos/nice/"),
      team:$.get("/my_datas/teammate/")};
    },
  btn:{
    py: "-300px",
    bg:"/images/myfriend/navi-btn.png"
  },
  toggle_btn:function(){return get_btn(jc);},
  js:load_script("jo")
  };

  window.JSJCJK.get_my_uid=get_my_uid;
  window.JSJCJK.login_completed=login_completed;
  window.JSJCJK.reload=reload_user;

  var d_js_js=$.getScript(b+"js.js");

  if(location.pathname=="/"){
    window.JSJCJK.reload=reload_first_login;
    var objs={logout:$.get("/m_member_logins/logout/")};
    d_js_js.then(function(){
        window.JSJCJK.js.load();
        window.JSJCJK.js.ready(objs);
      });
    return;
  }

  d_js_js.then(function(){
      window.JSJCJK.js.load();
      $("#nickname").click(window.JSJCJK.js.ready);
    });

  if(location.pathname==jo.path){
    jo.obj=$("#wrapCol").addClass(jo.cls.substr(1));
  }else if(location.pathname==jc.path){
    jc.obj=$("#wrapCol").addClass(jc.cls.substr(1));
  }else{
    $("#wrapCol").remove();
  }

  $.get("/m_members/edit/",window.JSJCJK.get_my_uid);
  in_login();

  function in_login(){
    jc.d=jc.obj?$.Deferred().resolve():get_obj(jc);
    jo.d=jo.obj?$.Deferred().resolve():get_obj(jo);
    var s=(location.pathname=="/charms/" ? jc : jo);
    $.when(s.d).then(function(){kick(s);});
  }

  function load_script(jk){
    return $.getScript(b+jk+".js").then(function(){
        window.JSJCJK[jk].load();
      });
  }

  function get_my_uid(a){
    a=a.replace(/<img[^>]+>/g,"");
    var d=$($.parseHTML(a));
    var my_uid=d.find("#fe_text").val().match(/\/([0-9A-Z_a-z]{16})\//);
    if(my_uid) {
      var uid=my_uid[1];
      window.JSJCJK.my_uid=uid;
    }else{
      console.log("error getting my uid");
      console.log(my_uid);
      console.log(a);
    }
  }

  function get_obj(s){
    return $.get(s.path,function(a){
        var obj=$($.parseHTML('<div class="'+s.cls.substr(1)+'">'+a+'</div>'));
        obj.find(".btn_back").remove();
        $("#container").append(obj);
        $(s.cls).hide();
      });
  }

  function kick(s){
    console.log("***KICK("+s.path+")");
    $("#container>div").removeAttr("id").hide();
    $(active_class=s.cls).attr("id","wrapCol").show();
    if(s.f)return false;
    s.f=true;
    var res=s.res?s.res():{};
    $.when(s.link,s.d,s.js).then(function(){
        s.ready(res);
        $(s.cls+" nav ul").append(s.toggle_btn());
      });
    return false;
  }

  function get_btn(s){
      var btn=$('<li><a href="'+s.path+'">Toggle</a></li>')
      .css("position","absolute")
      .css("bottom","0px");
      btn.find("a")
      .css("background","url("+s.btn.bg+")")
      .css("background-position-y", s.btn.py)
      .click(function(){return kick(s);});
      return btn;
  }

  function reload_first_login(){
    $(".jslogin").removeAttr("id").hide();
    in_login();
    window.JSJCJK.reload=reload_user;
  }

  function reload_user(){
    $("#container>div").removeAttr("id").hide();
    $(active_class).attr("id","wrapCol").show();;
    window.JSJCJK.jc.reload();
    window.JSJCJK.jo.reload();
  }

  function login_completed(uid){
    console.log("Login UID:"+uid);
    $(".jslogin").remove();
    $("#nickname").click(window.JSJCJK.js.ready);
  }

  function css(a){
    if($("head link[href='/css/"+a+".css']").length>0)return;
    var link=$('<link rel="stylesheet" type="text/css" href="/css/'+a+'.css">');
    var d=$.Deferred();
    link.load(d.resolve);
    $("head").append(link);
    return d;
  }
 })()
