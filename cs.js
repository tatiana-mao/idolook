(function(){
  $("#footer").css({position:"absolute",bottom:0});

  function hd(fn){return fn.toString().match(/[^]*\/\*([^]*)\*\/;?\}$/)[1];}
  function add_ht(flt,fn){$(flt).append(hd(fn));}
  add_ht("head", function(){/*<style type="text/css">
#console {
  position: absolute;
  top: 80px;
  bottom:201px;
}
#footer {
  position: absolute;
  bottom: 0px;
}
#accordion h3 {
  font-size: 36pt;
  padding-left: 1em;
}
.cardlist{
  font-size:18pt;
}
.cardlist tr:nth-child(2n-1){background: floralwhite;}
.cardlist tr:nth-child(2n)  {background: antiquewhite;}
.cardlist th{
  text-align: center;
  background-color: white;
  padding: 6px;
}
.cardlist td{
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 8px;
}
</style>*/});

  $("#wrapCol").remove();
  $("#container").css({position:"absolute",top:85,bottom:87,width:"100%","overflow-x":"hidden","-webkit-overflow-scrolling":"touch","overflow-scrolling":"touch"}).prepend('<div id="accordion">');

  var rr={
    "ノーマル": "N",
    "レア": "R",
    "プレミアムレア": "PR",
    "キャンペーンレア": "CP"
  };

  var tb={
    "トップス": "T",
    "ボトムス": "B",
    "シューズ": "S",
    "トップス＆ボトムス": "TB",
    "アクセサリー": "A"
  };

  var my_used_ks=[];
  var cs={};

  var d_mycs=$.get("/my_used_cardlists/")
    .then(function(a){
        var mycs=$($.parseHTML(a)).find("#sort_table tbody tr");
        mycs.each(function(){
            var k=$(this).find("td:first").text();
            if(k=="PG-036"){
              if($(this).find("td:nth-child(3)").text()=="アクセサリー")
                k="PG-036A";
            }
            my_used_ks.push(k);
          });
        console.log("mr");
      });

  // はなよ
  var d_0cs=$.get("/my_used_cardlists/lists/zWU5WVTy6vOAF8YA/")
    .then(update_ref);

  // くりす
  var d_1cs=$.get("/my_used_cardlists/lists/eIAhQ8qPZpydzWOh/")
    .then(update_ref);

  d_acc=$.getScript("https://code.jquery.com/jquery-migrate-1.2.1.js");

  $.when(d_mycs,d_0cs,d_1cs,d_acc)
    .then(function(){
        console.log("3then");
        console.log(my_used_ks.sort(function(a,b){
              if(a<b)return -1;
              if(a>b)return 1;
              console.log("XXX:"+a);
              return 0;
            }));
        for(var i=my_used_ks.length;i--;){
          var k=my_used_ks[i];
          if(k in cs)
            delete cs[k];
          else
            console.log("UNKONOW: "+k);
        }
        var ks=Object.keys(cs).sort(function(a,b){
            var as=a.split("-");
            var bs=b.split("-");
            var an=Number(as[0])==as[0]?1:0;
            var bn=Number(bs[0])==bs[0]?1:0;
            if(an<bn)return 1;
            if(an>bn)return -1;
            if(an){
              if(as[0]<bs[0])return 1;
              else if(as[0]>bs[0])return -1;
            }else{
              if(as[0]<bs[0])return -1;
              else if(as[0]>bs[0])return 1;
            }
            if(as[1]<bs[1])return -1;
            else if(as[1]>bs[1])return 1;
            console.log("???SORT:"+a+" -- "+b);
            return 0;
          });
        var pk="";
        for(var i=0;i<ks.length;i++){
          var kk=ks[i].split("-");
          var ck=kk[0];
          if(pk!=ck){
            pk=ck;
            $("#accordion")
            .append('<h3>'+pk+'</h3><div><table id="t_'+ck+'" class="cardlist"><tr><th colspan=2>品番<th>名称<th>部位<th>タイプ<th>ブランド');
          }
          var r='<tr>';
          r += cs[ks[i]].html();
          $("#t_"+ck).append(r);
        }
        $("#accordion").accordion({
          autoHeight: false,
          });
      });

  function update_ref(a){
    var ref0cs=$($.parseHTML(a)).find("#sort_table tbody tr");
    ref0cs.each(function(){
        var n=$(this).find("td:nth-child(2)").text();
        var t=$(this).find("td:nth-child(3)").text();
        if(t in tb)t=tb[t];
        var r=$(this).find("td:nth-child(5)").text();
        if(r in rr)r=rr[r];
        if(r=='-')r='';
        var p=$(this).find("td:nth-child(4)").text();
        var b=$(this).find("td:nth-child(6)").text();
        var k=$(this).find("td:first").text();
        if(k=="PG-036"){
          if(t=="A")
            k="PG-036A";
        }
        if(!(k in cs)){
          cs[k]=$('<tr><td>'+k
                  +'<td>'+r
                  +'<td>'+n
                  +'<td>'+t
                  +'<td>'+p
                  +'<td>'+b
                  +'</td></tr>');
        }
      });
    console.log("--update_ref");
  }
})()
