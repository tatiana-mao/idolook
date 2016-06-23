(function(){
  document.oncontextmenu=null;

  var ids = {};
  var l_ids = localStorage.getItem("ids");
  if (l_ids) {
    l_ids = JSON.parse(l_ids);
    if (l_ids) ids = l_ids;
  }

  var tps = ["cute", "cool", "sexy", "pop"];
  var pts = ["トップス", "ボトムス", "シューズ"];
  var txs = ["\u2605", "\u2460", "\u2461", "\u2462"];
  var dcs = ["\u2605", "a", "b"];
  var revs = {
    "\u2605": 1,
    "\u2460": 1,
    "\u2461": 2,
    "\u2462": 3,
    "a": 1,
    "b": 2,
  };
  var m_N = {
  cute: 10,
  cool: 28,
  sexy: 46,
  pop:  64,
  };

  var m_pt = {
  cute: [
         ["フリルショルダー", "Tシャツ", "ノースリーブ"],
         ["ショーパン", "フリルスカート", "ミニスカート"],
         ["シューズ", "ハイヒール", "パンプス"],
         ],
  cool: [
         ["ベスト", "トップス", "シャツ"],
         ["ショーパン", "パンツ", "スカート"],
         ["ヒールブーツ", "ブーツ", "ブーティ"],
         ],
  sexy: [
         ["ノースリーブ", "トップス", "ブラウス"],
         ["スカート", "ショーパン", "フリルパンツ"],
         ["サンダル", "ロングブーツ", "パンプス"],
         ],
  pop: [
        ["Tシャツ", "ノースリーブ", "ジャケット"],
        ["パンツ", "スカート", "ショートパンツ"],
        ["エナメルシューズ", "スリッポン", "スニーカー"],
        ],
  };

  var m_tx = {
  cute: ["ピンクハート", "モーニング", "ブルーフラワー"],
  cool: ["ダークスノー", "ロックンロール", "キーチェーン"],
  sexy: ["ナイトスター", "アラビアン", "ブラックレース"],
  pop:  ["ペイント", "フルーティー", "スター"],
  };

  var m_dc = {
  cute: ["リボン", "ポンピング"],
  cool: ["リズム", "スター"],
  sexy: ["フリンジ", "クリスタル"],
  pop:  ["スマイル", "チェーン"],
  };

  var my_id = $("div.fb-like").data("href").match(/\/([0-9A-Z_a-z]{16})\//);
  if (!my_id && confirm("IDが取得できません。メニューからやりなおして。")) {
    location.href = "http://mypage.aikatsu.com/menus/";
  }
  my_id = my_id[1];
  var my_name = $("div.m_login-name span").text().trim();
  if (my_id && my_name) {
    ids[my_id] = {name: my_name};
    localStorage.setItem("ids", JSON.stringify(ids));
  }

  var master = {};
  var cache = {};
  var dresses = {P:{}, R:{}, N:{}};

  var my_dress = $(".m_inner>.m_dress").children();

  var i = 1;

  var q = [];
  var q2 = [];


  $("head").append('<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css">');

  if ($("#sb_root").length == 0) {
    my_dress.each(function() {
        var a = $(this);
        var name = a.find(".m_dress_card_name").text().trim();
        a.attr("id", name);
      });

    $(".m_inner").prepend('<div id="sb_root"><h3>PR</h3><div id="sb_pr"></div></div><h2>その他</h2>');

    var m_prs = [1, 19, 37, 55];
    for (var i in m_prs) {
      var cls = "sb_pr-" + m_prs[i];
      $("#sb_pr").append('<ul class="' + cls + ' m_dress"></ul>');
      for (var j = 0; j < 3; ++j) {
        $("#1-" + (m_prs[i] + j).toString()).detach().appendTo("." + cls)
          .addClass("sb_1-" + (m_prs[i] + j).toString());
      }
    }

    for (var tp in m_N) {
      for (var pt = 0; pt < 3; ++pt) {
        $("#sb_root").append('<h3>' + tp + ':' + pts[pt] + '</h3><div><ul class="sb_R-' + tp + '-' + pt + '"></ul><ul class="sb_N-' + tp + '-' + pt + '"></ul></div>');
      }
    }

    var m_rs = [4, 22, 40, 58];
    for (var i in m_rs) {
      for (var j = 0; j < 2; ++j) {
        for (var k = 0; k < 3; ++k) {
          var cls = "sb_R-" + tps[i] + "-" + k;
          var n = m_rs[i] + 3 * j + k;
          var a = $("#1-" + n);
          var img = a.find("img:first").attr("src");
          for (var tx = 1; tx <= 3; ++tx) {
            var aa = a.clone();
            aa.removeAttr("id");
            aa.addClass("sb_1-" + n).addClass("sb_1-" + n + "-" + tx + "-1");
            aa.find(".is_medal").detach();
            aa.find(".m_dress_card_name").text("1-" + n + "-" + txs[tx] + "-\u2605");
            aa.find(".m_dress_card_img").addClass("is_none");
            aa.find("img:first").attr("src", img.replace(/^(.+)1(\.\w+)$/, "$1" + tx.toString() + "$2"));
            aa.appendTo("." + cls);
          }
          a.hide();
        }
      }
    }

    for (var tp in m_N) {
      for (var pt = 0; pt < 3; ++pt) {
        var cls = "sb_N-" + tp + "-" + pt;
        for (var dc = 1; dc <= 2; ++dc) {
          for (var i = 0; i < 3; ++i) {
            var n = m_N[tp] + 3 * i + pt;
            var a = $("#1-" + n);
            a.hide();
            var img = a.find("img:first").attr("src");
            for (var tx = 1; tx <= 3; ++tx) {
              var aa = a.clone();
              aa.removeAttr("id");
              aa.addClass("sb_1-" + n).addClass("sb_1-" + n + "-" + tx + "-" + dc);
              aa.find(".is_medal").detach();
              aa.find(".m_dress_card_name").text("1-" + n + "-" + txs[tx] + "-" + dcs[dc]);
              aa.find(".m_dress_card_img").addClass("is_none");
              aa.find("img:first").attr("src", img.replace(/^(.+)1(\.\w+)$/, "$1" + (2 * tx + dc - 2).toString() + "$2"));
              aa.appendTo("." + cls);
              aa.show();
            }
          }
        }
      }
    }

    $.when($.getScript("http://code.jquery.com/ui/1.11.3/jquery-ui.min.js"))
      .then(function() {
          $("#sb_root").accordion({
	    heightStyle: "content",
	    });
        });
  }

  for (var id in ids) {
    if (id == my_id && my_dress.length > 0) {
      console.log("****" + id);
      parse(my_id, my_dress, true);
      continue;
    }

    if (id == my_id) {
      console.log("***" + my_dress.length);
    } else {
      console.log("???" + id);
    }

    q.push(fetch(id));
  }

  $.when.apply($, q).then(function() {
      console.log("DONE ALL");
      $.when.apply($, q2).then(function() {
          console.log("READ ALL");
          console.log(cache);
        });
    });

  $(".m_inner").prepend('<input type="button" id="reload" value="Reload">');
  $("#reload").click(function () {
    fetch(my_id, true);
  });

  function fetch(id, f_mine) {
    return $.get("/mypages/digital_binders/" + id + "/", function (a) {
        a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
        parse(id, $($.parseHTML(a)).find(".m_dress").children(), f_mine);
      });
  }

  function parse(id, dresses, f_mine) {
    console.log("====" + id + ":" + ids[id]);

    dresses.each(function() {
        var a = $(this);
        var name = a.find(".m_dress_card_name").text().trim();
        var href = a.find(">a").attr("href");
        if (!(name in cache)) cache[name] = {};

        if (a.find(".is_medal").length > 0) {
          cache[name][id] = {is_medal: true};
          update(name);
          $(".sb_" + name + " .m_dress_card_img").removeClass("is_none");
          if (f_mine)
            $(".sb_" + name + " .m_dress_card_img")
              .append('<img src="/images/binder/img_medal-comp.png" alt="" class="is_medal">');
        } else if (a.find(".is_none").length > 0) {
          /* do nothing. */
        } else {
          q2.push($.get(href, function (a) {
                cache[name][id] = {};
                a=a.replace(/(<img[^>]+)src=/g,'$1data-src=');
                $($.parseHTML(a)).find(".m_dress_card").each(function(i){
                    var a = $(this);
                    var fullname = a.find(".m_dress_card_name").text().trim();
                    var f_medal = (a.find(".is_medal").length > 0);
                    cache[name][id][fullname] = f_medal;
                    if (f_medal) {
                      var fn_td = fullname.match(/-([^-]+)-([^-]+)$/);
                      var tx = revs[fn_td[1]];
                      var dc = revs[fn_td[2]];
                      var fullid = ".sb_" + name + "-" + tx + "-" + dc;
                      $(fullid + " .m_dress_card_img").removeClass("is_none");
                      if (f_mine) {
                        $(fullid + " .m_dress_card_img")
                          .append('<img src="/images/binder/img_medal-comp.png" alt="" class="is_medal">');
                      }
                    }
                  });
                update(name);
              }));
        }
      });
  }

  function update(name) {
    var is_medal = false;
    var m = {};
    $("#" + name + " .is_none").removeClass("is_none");
    for (var id in cache[name]) {
      if (cache[name][id].is_medal) {
        is_medal = true;
        break;
      }
      var i = 0;
      for (var fn in cache[name][id]) {
        if (m[fn] || cache[name][id][fn]) {
          m[fn] = true;
          ++i;
        }
        if (i == Object.keys(cache[name][id]).length) {
          is_medal = true;
          break;
        }
      }
    }
  }

 })()
