window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const LABELS={N:"北大核心",Y:"交大核心",E:"英文商業／時事",R:"研究計畫",M:"商管基礎",G:"多人同場／情境個答",P:"壓力備審",X:"英文研究／統計"};
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">ORIGINAL WORD BANK · 175 QUESTIONS</div><h1>舊 Word 完整題庫｜一題都不漏</h1><p>這是從原本線上 Word 直接重新整理回來的 175 題。答案預設收起；先在每題下方寫自己的版本，再打開參考。</p>';root.appendChild(hero);
const ctrl=document.createElement("section");ctrl.className="card";
const options=['<option value="">全部175題</option>'].concat(Object.keys(LABELS).map(function(k){return '<option value="'+k+'">'+k+'｜'+LABELS[k]+'</option>';})).join("");
ctrl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap"><input id="search" type="search" placeholder="搜尋題目、題號、關鍵字…" style="flex:1;min-width:210px;border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--surface);font:inherit;color:var(--ink)"><select id="group" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:var(--surface);font:inherit;color:var(--ink)">'+options+'</select></div><div id="count" class="meta" style="margin-top:9px"></div>';
root.appendChild(ctrl);
const list=document.createElement("section");list.className="section";root.appendChild(list);
function beginner(x){
 const g=x.id[0];
 if(g==="R")return ["這題不是要你背研究名詞，而是確認你真的知道自己的研究每一步在做什麼。","先想：它在問研究問題、變項、測量、方法，還是限制？再把概念套回你的會員研究。"];
 if(g==="X")return ["這是把研究／統計用簡單英文說清楚，不是在考艱深英文。","先用中文確定自己懂，再用短英文：定義 → 你的例子 → 一個限制。"];
 if(g==="E")return ["這類英文題重點是商業判斷，不是背新聞。","先回答立場，再講為什麼、企業會受什麼影響、最後補一個風險或限制。"];
 if(g==="M")return ["這是商管基本功。教授可能用很簡單的名詞確認你是不是只會行銷工作、不懂管理底層概念。","先用一句白話定義，再用你工作看過的例子，最後說這個概念拿來做什麼決策。"];
 if(g==="G")return ["這不是要你和同學真的討論很久，而是多人同場時快速提出自己的管理判斷。","先講結論，再拆2個理由；如果前面的人講過，就補新的利害關係人、風險或執行層。"];
 if(g==="P")return ["這是壓力題。教授不是一定覺得你有問題，而是在看你會不會防衛、亂掰，還是能誠實承認限制再說清楚。","先承認合理部分，再用你的真實經歷與準備證明，不要硬凹自己沒有缺點。"];
 if(g==="N")return ["這題主要在看你的動機、自我認知、研究準備或管理思考能不能前後一致。","回答一定要回到你自己的經歷：設計 → 主管 → 廣告數據 → MyCard → 為什麼現在讀研究所。"];
 if(g==="Y")return ["交大題目常會從個人一路追到英文、統計或商管知識，所以不能只背漂亮答案。","先把概念講對；教授追問時再補理論、例子與限制，不確定就明確說你理解到哪裡。"];
 return ["先弄懂問題在問什麼，再答。","不要先背答案。"];
}
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