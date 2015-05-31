(function(){
  $("#footer").css({position:"absolute",bottom:0});
  $("#container").css({position:"absolute",top:85,bottom:87,"overflow-x":"hidden","-webkit-overflow-scrolling":"touch","overflow-scrolling":"touch"}).prepend('<input id="reload" type="button" value="Reload"><table id="tstable">');
  var ts={};

  function hd(fn){return fn.toString().match(/[^]*\/\*([^]*)\*\/;?\}$/)[1];}
  function add_ht(flt,fn){$(flt).append(hd(fn));}
  add_ht("head", function(){/*<style type="text/css">
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
#tstable {width:1200px;line-height:initial;}
#tstable tr:nth-child(4n-3){background: floralwhite;}
#tstable tr:nth-child(4n-2){background: floralwhite;}
#tstable tr:nth-child(4n-1){background: antiquewhite;}
#tstable tr:nth-child(4n)  {background: antiquewhite;}
#tstable tr.an{
text-align: center;
  height: 56pt;
  background: cadetblue;
  color: white;
  font-size: 48pt;
  font-weight: bold;
}
#tstable .im{width:232px;padding-left:1em;}
#tstable .sn{font-size:32pt;  padding-top: 4px;}
#tstable .sn img{height:48pt;}
#tstable .mn{text-align:right;font-size:28pt;padding: 0 1em 2px 0;}

</style>*/});

  var dts=
    ["081_3_RO_1_ミスティック宮殿_Chica\u00D7Chica",
     "082_4_VK_1_パイレーツマリーナ_サマー\u2606マジック",
     "083_4_RC_1_クッキー&amp;クローバー_恋するみたいなキャラメリゼ",
     "074_1_DC_1_ファッションスクエア_Pretty Pretty",
     "075_2_DF_1_ネオンケージ_MY SHOW TIME",
     "076_2_  _1_サイレントプレイス_チュチュ・バレリーナ",
     "056_1_DC_1_ドリーミングキュート_Let's アイカツ!",
     "063_1_AS_1_スターナイトメロディー_輝きのエチュード",
     "067_1_DC_1_おひさまパラダイス_Blooming Blooming",
     "015_1_AS_1_エリアルパーク_オリジナルスター\u2606彡",
     "028_1_AF_1_フェアリーフラワー_オーロラプリンセス",
     "043_1_AS_1_エンジェルネオン_ハッピィクレッシェンド",
     "036_1_AS_1_ガーリールーム_SHINING LINE*",
     "001_1_AS_1_スカイスウィート_アイドル活動!",
     "020_1_  _1_トリプルメロディ_カレンダーガール",
     "057_2_LG_1_秘密の森_タルト・タタン",
     "016_2_SR_1_ミュージックネオン_アイドル活動!(Ver.ROCK)",
     "027_2_FG_1_オーロラギャラクシー_prism spiral",
     "045_2_SR_1_ロックフェスホール_Sweet Sp!ce",
     "032_2_FG_1_スターシップ_Signalize!",
     "005_2_LG_1_ダークパレス_硝子ドール",
     "069_3_SC_1_十五夜御殿_薄紅デイトリッパー",
     "035_3_LM_1_クレセントクルーズ_Precious",
     "051_3_BS_1_ミステリアスジャングル_ダンシング\u2606ベイビー",
     "004_3_SA_1_クラブハウス_Move on now!",
     "010_3_  _1_スターアニス_ヒラリ/ヒトリ/キラリ",
     "058_4_VK_1_トランプルーム_Good morning my dream",
     "061_4_VK_1_ジングルツリータウン_はろー! Winter Love\u2606",
     "049_4_VK_1_サンシャインビーチ_笑顔のSuncatcher",
     "033_4_HR_1_カラフルフルーツ_Angel Snow",
     "007_4_MT_1_サニーパーク_ダイヤモンドハッピー",
     "052_1_XX_1_キュート＆クール_フレンド",
     "086_2_  _2_オープンエアミュージック_Hey! little girl",
     "077_1_DC_2_ウェルカムカフェ_Lovely Party Collection",
     "078_1_AS_2_アフタヌーンティー_ハローニューワールド",
     "059_1_DC_2_あおぞらレイク_Du-Du-Wa DO IT!!",
     "025_1_AS_2_へヴンズランウェイ_Dance in the rain",
     "044_1_AF_2_フローラルガーデン_ハートのメロディ",
     "072_1_AS_2_スイーツチョコ_Growing for a dream",
     "012_1_AF_2_フェアリードリーム_同じ地球のしあわせに",
     "017_2_SR_2_ロックンロック_KIRA\u2606Power",
     "046_2_LG_2_ゴシックハウス_永遠の灯",
     "047_2_FG_2_エレクトリックタイム_stranger alien",
     "042_2_FG_2_ミルキーウェイ_prism spiral",
     "062_3_RO_2_ロマンティック回廊_Passion flower",
     "024_3_BS_2_アラビアンパレス_Kira・pata・shining",
     "073_3_SA_2_ネオンロード_Trap of Love",
     "011_3_LM_2_プリンセス_Moonlight destiny",
     "068_4_VK_2_ディープシーファンタジー_Poppin' Bubbles",
     "026_4_MT_2_トリックハウス_マジカルタイム",
     "037_4_HR_2_デザートランド_CHU-CHU RAINBOW",
     "048_4_VK_2_シティーナイトロード_オトナモード",
     "003_4_HR_2_キャンディポップ_放課後ポニーテール",
     "080_4_  _3_アイカツレストラン_Sweet Heart Restaurant",
     "022_1_AS_3_ファンシーアクション_右回りWonderland",
     "070_2_LG_3_ミステリーナイト_魅惑のパーティー",
     "029_2_SR_3_トラップジュエル_ミトレジャーノ!",
     "002_2_FG_3_ポリスアクション_真夜中のスカイハイ",
     "060_3_SA_3_スクールアクション_ラブリー\u2606ボム",
     "050_3_BS_3_アラビアンドリーム_アラビアンロマンス",
     "006_3_SA_3_スパイアクション_Thrilling Dream",
     "018_4_MT_3_チョコポップ探偵事務所_新・チョコレート事件",
     "___________"];
  dts.pop();

  var brs={
  AS:1,
  AF:2,
  DC:3,
  FG:4,
  LG:5,
  SR:6,
  SA:7,
  LM:8,
  BS:9,
  HR:10,
  MT:11,
  VK:12,
  RO:41,
  SC:42,
  DF:114,
  RC:124,
  XX:9999,
  "  ":-1
  }

  var dt={};
  for(var i=0;i<dts.length;i++){
    var r=dts[i].split("_");
    dt[r[0]]={
      "tp":Number(r[1]),
      "br":r[2],
      "st":Number(r[3]),
      "sn":r[4],
      "mn":r[5],
      "i":i,
      "n":0
    };
    dts[i]=r[0];
  }
  upd();

  $("#reload").css({width:1200,"font-size":"56pt"}).click(function(){
      $("#reload").prop("disabled",true);
      var arg={
      cache:false,
      success:function(a){
          a=$($.parseHTML('<div>'+a));
          $("article").replaceWith(a.find("article"));
          upd();
          $("#reload").prop("disabled",false);
        }};
      $.ajax("/tickets/stage_lists/",arg);
      return false;
    });

  function upd(){
    for (var i=0;i<dts.length;i++)dts[i].n=0;
    $(".myTicketWrap>dl").each(function(){
        var r=$(this);
        var n=r.find(".img img").attr("src").match(/_(\d+)\.jpg/);
        n=n[1];
        if(dt[n]){
          dt[n].n=Number(r.find(".cnt span").text());
          r.remove();
        }
      });

    dts.sort(function(a,b){
        var i=dt[a].n-dt[b].n;
        if(i)return i;
        i=dt[a].i-dt[b].i;
        if(i)return i;
        i=dt[a].st-dt[b].st;
        if(i)return i;
        i=dt[a].tp-dt[b].tp;
        if(i)return i;
        i=brs[dt[a].br]-brs[dt[b].br];
        if(i)return i;
        return Number(a)-Number(b);
      });

    $("#tstable").html("");
    var o_n=-1;
    for (var i=0;i<dts.length;i++){
      var n=dts[i];
      if(o_n!=dt[n].n){
        o_n=dt[n].n;
        $("#tstable").append('<tr class="an"><td rowspan=2 colspan=2>x'+dt[n].n+'</tr><tr></tr>');
      }
      var r=$('<tr><td class="im" rowspan=2><img src="/images/tickets/ticket/img_item_stage_'+n+'.jpg"></td><td class="sn">'+dt[n].sn+'</td><tr><td class="mn">\u266A'+dt[n].mn+'</td></tr>');
      var br=brs[dt[n].br];
      if(br>0){
        if(dt[n].br=="XX"){
          r.find(".sn")
            .prepend('<img src="/images/charm/6_3.png">')
            .prepend('<img src="/images/charm/1_3.png">');
        }else{
          r.find(".sn").prepend('<img src="/images/charm/'+brs[dt[n].br]+'_3.png">');
        }
      }
      r.find(".sn").prepend('<img src="/images/charm/'+(9+4*dt[n].st+dt[n].tp)+'_3.png">');
      $("#tstable").append(r);
    }
  }
})()
