(function(){
  $('#footer').css('position','absolute').css('bottom','0px');
  $('#container').css('position','absolute').css('top','85px').css('bottom','87px');
  $('#wrapCol').css('position','absolute').css('top','0px').css('bottom','0px').height('auto');
  $('#wrapCol > .contents').css('position','absolute').css('top','0px').css('bottom','0px').css('left','268px');
  $('.contentsGreenCol').css('position','absolute').css('top','75px').css('bottom','0px').height('auto');
  $('#dateCol').css('position','absolute').css('top','0px').css('bottom','0px').css('left','10px');
  $('#dateCol > .playerDateCol').css('position','absolute').css('top','0px').css('bottom','0px');
  $('.charms-list').css('position','absolute').css('top','230px').css('bottom','0px').height('auto');
  $('.charms-listCol').height($('.charms-list').innerHeight()-48).css('position','absolute').css('top','25px').css('bottom','0px').css('overflow','auto').css('-webkit-overflow-scrolling','touch').css('width','900px');

  $(".scrollCol").hide();

  $(".playerDateCol li").css('position','relative');

  $("#gnavi ul").prepend('<li class="btn_charms"><a href="/charms/">チャームをかえる</a></li>');
  $(".btn_charms a").css('background-position-y','-200px').css('background-image', 'url(https://idolook.aikatsu.com/images/myprofile/navi-btn.png)').hide();

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

  var cc=[
	  "39",
	  "59",
	  "55",
	  "32","33","44","45","46","47","48","49","50",

	  "51","34","40",
	  "27","29","28","30",

	  "35","36","37","60","61","62","63","64","65",

	  "54",
	  ];

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

  if(cookies["JSJCJK_charms"]) {
    cc=cookies["JSJCJK_charms"].split(".");
    cc=find_new($(".playerDateCol li dt img")).concat(cc);
  } else {
    cc=cc.concat(find_new($(".playerDateCol li dt img")));
    console.log(cc);
  }

  var ss=new Object;
  var cs=[];

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

  sort_c2($("body"));

  $(".btn_charms a").click(function(){
      $(".btn_charms a").hide();

      function cs3fin() {
	$.get("https://idolook.aikatsu.com/charms/",
	      function(na) {
		var nd = $($.parseHTML(na));
		$(".charms-set").replaceWith(nd.find(".charms-set"));
		$(".charms-set li").css('position','relative');
		cs=[];
		ss=new Object;
		sort_c2(nd);
	      });
      }

      var n=3;
      var bk_cs=cs.concat();
      function set_cs(dummy) {
	if(n<1||cs.length==0) {
	  set_cookie("JSJCJK_charms", cc.join('.'));
	  return cs3fin();
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
	m="https://idolook.aikatsu.com/charms/comp/"+n--+"/"+m+"/"+m+"/";
	return $.ajax({type: "GET",
	      url: m,
	      async: false,
	      success: set_cs,
	      error: function(x,s,t) {
	      $(".btn_charms a").show();
	      cs=bk_cs;
	      window.open("https://idolook.aikatsu.com/charms/","_blank");
	    },
	      });
      }
      set_cs(null);
      return false;
    });

 })()
