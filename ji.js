(function(){
  document.oncontextmenu=null;

  var b=window.JSJCJK;
  window.JSJCJK=new Object;

  var active_class="";

  var obj_jo=null;
  var d_jo=$.Deferred().resolve();
  var obj_jc=null;
  var d_jc=$.Deferred().resolve();

  if(location.pathname=="/offers/"){
    obj_jo=$("#wrapCol").addClass("xoffer");
  }else if(location.pathname=="/charms/"){
    obj_jc=$("#wrapCol").addClass("xcharms");
  }else{
    $("#wrapCol").remove();
  }

  var d_jc_link=css("charms");
  if(!obj_jc){
    d_jc=$.get("/charms/",function(a){
        obj_jc=$($.parseHTML('<div class="xcharms">'+a+'</div>'));
        obj_jc.find(".btn_back").hide();
        $("#container").append(obj_jc);
        $(".xcharms").hide();
      });
  }

  var d_jo_link=css("offer");
  if(!obj_jo){
    d_jo=$.get("/offers/",function(a){
        obj_jo=$($.parseHTML('<div class="xoffer">'+a+'</div>'));
        obj_jo.find(".btn_back").hide();
        $("#container").append(obj_jo);
        $(".xoffer").hide();
      });
  }

  window.JSJCJK.get_my_uid=function(a){
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
  };

  $.get("/m_members/edit/",window.JSJCJK.get_my_uid);

  var d_jc_js=$.when(d_jc_link,$.getScript(b+"jc.js")).then(function(){
      var jc=window.JSJCJK.jc;
      console.log(jc);
      jc.load();
    });

  var d_jo_js=$.when(d_jo_link,$.getScript(b+"jo.js")).then(function(){
      var jo=window.JSJCJK.jo;
      jo.load();
    });

  var d_js_js=$.getScript(b+"js.js").then(function(){
      window.JSJCJK.js.load();
      $("#nickname").click(window.JSJCJK.js.ready);
      window.JSJCJK.reload=reload_user;
      window.JSJCJK.login_completed=login_completed;
    });

  var f_jc=false;
  var f_jo=false;

  if(location.pathname=="/charms/")
    $.when(d_jc).then(kick_jc);
  else
    $.when(d_jo).then(kick_jo);

  function kick_jc(){
    console.log("***KICK_JC");
    $("#container>div").removeAttr("id").hide();
    $(active_class=".xcharms").attr("id","wrapCol").show();;
    if(f_jc)return false;
    f_jc=true;
    $.when(d_jc,d_jc_js).then(function(){
        var jc=window.JSJCJK.jc;
        console.log(jc);
        jc.ready({});
        $("#wrapCol>article").show();
        var btn_jo=$('<li><a href="/offers/">Offer</a></li>')
          .css("position","absolute")
          .css("bottom","0px");
        btn_jo.find("a")
          .css("background","url(/images/myfriend/navi-btn.png)")
          .css("background-position-y", "-300px")
          .click(kick_jo);
        $(".xcharms nav ul").append(btn_jo);
      });
    return false;
  }

  function kick_jo(){
    console.log("***KICK_JO");
    $("#container>div").removeAttr("id").hide();
    $(active_class=".xoffer").attr("id","wrapCol").show();
    if(f_jo)return false;
    f_jo=true;

    var jo_res={
    team:$.get("/my_datas/teammate/"),
    myfriends:$.get("/my_datas/bds_frend_lists/"),
    requested:$.get("/my_datas/pend_lists/"),
    nice:$.get("/t_infos/nice/")
    };

    $.when(d_jo,d_jo_js).then(function(){
        var jo=window.JSJCJK.jo;
        console.log("JIJIJIJIJIJIJIJI");
        console.log(jo);
        jo.ready(jo_res);
        var btn_jc=$('<li><a href="/charms/">Charm</a></li>')
          .css("position","absolute")
          .css("bottom","0px");
        btn_jc.find("a")
          .css("background","url(/images/myprofile/navi-btn.png)")
          .css("background-position-y", "-200px")
          .click(kick_jc);
        $(".xoffer nav ul").append(btn_jc);
      });
    return false;
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
