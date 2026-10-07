window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">SAME-ROOM ORAL V4</div><h1>多人同場口試｜不是自由團體討論</h1><p>北大與陽明交大都以多人同場個答、輪答／搶答、教授追問為核心。這頁練的是「自己答深」與「前面有人講過時怎麼補」。</p>';root.appendChild(hero);
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
addSection("北大｜共同題／搶答／輪答",NTPU_V4.filter(x=>/搶答|多人同場|個別問答/.test(x[2])),"北大");
addSection("陽明交大｜多人同場個答",NYCU_V4.filter(x=>/多人同場|英文抽題|英文／中文/.test(x[2])),"交大");
});