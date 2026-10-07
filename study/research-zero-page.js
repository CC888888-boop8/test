window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">RESEARCH FROM ZERO</div><h1>研究計畫｜從「我完全不會」開始</h1><p>不用先懂統計、論文或研究法。照順序學：先懂研究在幹嘛，再懂你的題目，最後才進統計與口試。</p>';root.appendChild(hero);
const guide=document.createElement("section");guide.className="card";guide.innerHTML='<h3>你怎麼用這頁</h3><p>第一次：只看「白話」＋「生活例子」。第二次：看「學術概念」＋「套你的研究」。第三次：關掉答案，自己回答教授題。</p><p><b>不要跳著背名詞。</b>你要先真的知道每個概念在解決什麼問題。</p>';root.appendChild(guide);
const units=[...new Set(RESEARCH_ZERO.map(x=>x.unit))];
const jump=document.createElement("div");jump.className="jump";jump.innerHTML=units.map((u,i)=>'<a href="#u'+i+'">'+u+'</a>').join("");root.appendChild(jump);
units.forEach((u,i)=>{
 const sec=document.createElement("section");sec.className="section";sec.id="u"+i;
 const arr=RESEARCH_ZERO.filter(x=>x.unit===u);const h=document.createElement("h2");h.textContent=u+"（"+arr.length+"章）";sec.appendChild(h);
 arr.forEach(x=>{
  const d=document.createElement("details");const s=document.createElement("summary");s.innerHTML='<span class="chip">LESSON '+x.n+'</span><div>'+x.title+'</div>';d.appendChild(s);
  const blocks=[
   ["① 先用白話懂",x.zero,"green"],
   ["② 生活例子",x.analogy,""],
   ["③ 學術上到底是什麼",x.academic,""],
   ["④ 套回你的研究",x.yours,"blue"],
   ["⑤ 教授可能直接問",x.prof,"warm"],
   ["⑥ 你可以這樣回答",x.oral,"blue"],
   ["⑦ 最容易答錯的地方",x.mistake,"warm"],
   ["⑧ 自我檢查",x.check.map(v=>"• "+v).join("<br>"),""]
  ];
  blocks.forEach(b=>{const z=document.createElement("div");z.className="box "+b[2];z.innerHTML="<b>"+b[0]+"</b><br>"+b[1];d.appendChild(z);});
  sec.appendChild(d);
 });root.appendChild(sec);
});
});