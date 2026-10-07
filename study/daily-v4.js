window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const phases=[
["10/7–10/10","建立兩校差異＋研究統計底座"],
["10/11–10/17","北大個人／研究＋交大英文／統計"],
["10/18–10/24","多人同場補充答＋教授追問"],
["10/25–10/31","分校Mock＋壓力追問"]
];
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">25-DAY SPRINT V4</div><h1>每日課表｜不再混校、不再混題</h1><p>每天都固定有：北大1題、交大1題、研究／統計、英文、同場口試補充答。後段才進Mock。</p>';root.appendChild(hero);
const phase=document.createElement("section");phase.className="card";phase.innerHTML="<h3>四階段</h3>"+phases.map(x=>"<p><b>"+x[0]+"</b><br>"+x[1]+"</p>").join("");root.appendChild(phase);
const days=document.createElement("div");days.className="daystrip";root.appendChild(days);
const out=document.createElement("div");root.appendChild(out);
let d=0;
function pick(arr,n){return arr[n%arr.length]}
function draw(){
  days.innerHTML=Array.from({length:25},(_,i)=>'<button class="'+(i===d?"active":"")+'" data-i="'+i+'"><b>D'+(i+1)+'</b><br><small>10/'+(7+i)+'</small></button>').join("");
  days.querySelectorAll("button").forEach(b=>b.onclick=()=>{d=Number(b.dataset.i);draw();});
  const n=pick(NTPU_V4,d*2),y=pick(NYCU_V4,d*2),r=pick(DEEP_RESEARCH_A,d),s=pick(DEEP_STATS_A,d);
  const n2=pick(NTPU_V4,d*2+1),y2=pick(NYCU_V4,d*2+1);
  const cards=[];
  cards.push(["北大｜主題1",n[4],n[7]]);
  cards.push(["北大｜主題2",n2[4],"先自己答60–90秒，再看完整答案。"]);
  cards.push(["交大｜主題1",y[4],y[8]||y[7]]);
  cards.push(["交大｜主題2",y2[4],"先自己答；若是英文題，至少講90秒。"]);
  cards.push(["研究理解",r.title,r.oral]);
  cards.push(["統計理解",s.title,s.oral]);
  if(d>=8)cards.push(["多人同場補充答","假設前面的人已把主要答案講掉，請對今天的北大或交大題再補一個不同層次。","固定練：承接一句 → 新增面向 → 結論。"]);
  if(d>=17)cards.push(["Mock","今天至少跑一輪分校模擬。","北大與交大分開抽題，不共用題池。"]);
  out.innerHTML='<section class="card"><span class="chip">DAY '+(d+1)+'</span><h2>10/'+(7+d)+'</h2><div class="meta">約2.5–3小時；時間不足時優先：研究／統計 → 雙校核心 → 英文。</div></section>'+cards.map(c=>'<section class="card"><h3>'+c[0]+'</h3><div class="box"><b>'+c[1]+'</b></div><div class="box blue">'+c[2]+'</div></section>').join("");
}
draw();
});