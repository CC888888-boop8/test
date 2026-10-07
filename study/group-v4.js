window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const NB=[...NTPU_V4,...NTPU_V6_EXTRA],YB=[...NYCU_V4,...NYCU_V6_EXTRA];
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">SAME-ROOM ORAL</div><h1>多人同場口試｜同場，不等於自由團討</h1><p>北大近年公開心得可看到4–5人一起進場，可能依序回答或舉手搶答，再由教授追問。你要練的是自己答完整；如果前面的人已講過，就補一個新的分析層次。</p>';root.appendChild(hero);const verified=document.createElement("section");verified.className="card";verified.innerHTML='<span class="chip">北大實際型態</span><h3>核心是「同場個答＋補充」</h3><p><b>115：</b>有4–5人同場、依序回答與搶答的分享。</p><p><b>114：</b>也有4人一起面、採搶答，並曾出現英文回答要求。</p><p class="meta">不同年度與組別可能調整，所以這裡不把自由團體討論當預設。</p>';root.appendChild(verified);
function addSection(title,arr,school){
 const sec=document.createElement("section");sec.className="section";const h=document.createElement("h2");h.textContent=title+"（"+arr.length+"題）";sec.appendChild(h);
 arr.forEach(x=>{
  const d=document.createElement("details");const s=document.createElement("summary");s.textContent=x[0]+"｜"+x[4];d.appendChild(s);
  const first=document.createElement("div");first.className="box warm";first.innerHTML="<b>如果你是前面回答的人</b><br>"+(school==="北大"?x[7]:x[8]);d.appendChild(first);
  const later=document.createElement("div");later.className="box blue";let tip="";
  if(/研究|統計/.test(x[1])) tip="前面若已講定義，補『例子＋用途／限制』；不要為了不同而亂改正確概念。";
  else if(/AI|國際|ESG|商業|管理|人資|數位/.test(x[1])) tip="前面若已講主要立場，換一個層次補：另一利害關係人、短期／長期、成本／風險、或反方限制。";
  else tip="前面若已講相似內容，就用自己的真實經歷、證據或反思補充，不要重複形容詞。";
  later.innerHTML="<b>如果前面的人已經講過</b><br>"+tip;d.appendChild(later);
  const frame=document.createElement("div");frame.className="box";frame.innerHTML="<b>回答骨架</b><br>"+x[6];d.appendChild(frame);const concept=document.createElement("div");concept.className="box";concept.innerHTML="<b>核心概念</b><br>"+V5_DEPTH.concept(x[1],x[4]);d.appendChild(concept);const pressure=document.createElement("div");pressure.className="box warm";const pp=V5_DEPTH.pressure(x[1]);pressure.innerHTML="<b>壓力追問</b><br><b>"+pp[0]+"</b><br>"+pp[1];d.appendChild(pressure);
  const prof=document.createElement("div");prof.className="box";prof.innerHTML="<b>教授在看什麼</b><br>"+x[5];d.appendChild(prof);
  sec.appendChild(d);
 });root.appendChild(sec);
}
addSection("北大｜共同題／搶答／輪答",NB.filter(x=>/搶答|多人同場|個別問答/.test(x[2])),"北大");
addSection("陽明交大｜多人同場個答",YB.filter(x=>/多人同場|英文抽題|英文／中文/.test(x[2])),"交大");
const G=WORD_BANK.filter(x=>x.id.startsWith("G"));const gs=document.createElement("section");gs.className="section";gs.innerHTML='<h2>原 Word｜G 情境／多人同場題（'+G.length+'題）</h2><div class="card"><p>這18題拿來練「快速立場＋理由＋教授追問」。它們是原Word的情境訓練，不代表學校一定逐字照出。</p></div>';G.forEach(x=>{const d=document.createElement("details");const q=document.createElement("summary");q.innerHTML='<span class="chip">'+x.id+'</span><div>'+x.question+'</div>';d.appendChild(q);const a=document.createElement("div");a.className="box blue";a.innerHTML='<b>口說參考回答</b><br>'+x.answer;d.appendChild(a);const p=document.createElement("div");p.className="box warm";p.innerHTML='<b>教授追問</b><br>'+x.follow+'<br><br><b>第二層回答</b><br>'+x.second;d.appendChild(p);const t=document.createElement("div");t.className="box";t.innerHTML='<b>提醒</b><br>'+x.tip;d.appendChild(t);gs.appendChild(d)});root.appendChild(gs);
});