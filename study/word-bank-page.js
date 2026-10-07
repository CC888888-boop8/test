window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const LABELS={N:"北大核心",Y:"交大核心",E:"英文商業／時事",R:"研究計畫",M:"商管基礎",G:"多人同場／情境個答",P:"壓力備審",X:"英文研究／統計"};
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">ORIGINAL WORD BANK · 175 QUESTIONS</div><h1>舊 Word 完整題庫｜一題都不漏</h1><p>這是從原本線上 Word 直接重新整理回來的 175 題。答案預設收起；先在每題下方寫自己的版本，再打開參考。</p>';root.appendChild(hero);
const ctrl=document.createElement("section");ctrl.className="card";
const options=['<option value="">全部175題</option>'].concat(Object.keys(LABELS).map(function(k){return '<option value="'+k+'">'+k+'｜'+LABELS[k]+'</option>';})).join("");
ctrl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap"><input id="search" type="search" placeholder="搜尋題目、題號、關鍵字…" style="flex:1;min-width:210px;border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--surface);font:inherit;color:var(--ink)"><select id="group" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:var(--surface);font:inherit;color:var(--ink)">'+options+'</select></div><div id="count" class="meta" style="margin-top:9px"></div>';
root.appendChild(ctrl);
const list=document.createElement("section");list.className="section";root.appendChild(list);
function card(x){
 const d=document.createElement("details");
 const s=document.createElement("summary");s.innerHTML='<span class="chip">'+x.id+'</span><span class="chip">'+(LABELS[x.id[0]]||"題庫")+'</span><div>'+x.question+'</div>';d.appendChild(s);
 [["原 Word｜60秒口說回答",x.answer,"blue"],["教授追問",x.follow,"warm"],["第二層回答",x.second,"blue"],["原本提醒",x.tip,""]].forEach(function(b){if(!b[1])return;const z=document.createElement("div");z.className="box "+b[2];z.innerHTML="<b>"+b[0]+"</b><br>"+b[1];d.appendChild(z);});
 return d;
}
function draw(){
 const q=document.getElementById("search").value.trim().toLowerCase(),g=document.getElementById("group").value;
 const arr=WORD_BANK.filter(function(x){const all=[x.id,x.question,x.answer,x.follow,x.second,x.tip].join(" ").toLowerCase();return(!g||x.id.indexOf(g)===0)&&(!q||all.indexOf(q)!==-1);});
 document.getElementById("count").textContent="目前顯示 "+arr.length+" / "+WORD_BANK.length+" 題";
 list.innerHTML="";arr.forEach(function(x){list.appendChild(card(x));});
}
document.getElementById("search").addEventListener("input",draw);document.getElementById("group").addEventListener("change",draw);
const param=new URLSearchParams(location.search).get("group");if(param&&LABELS[param])document.getElementById("group").value=param;
draw();
});