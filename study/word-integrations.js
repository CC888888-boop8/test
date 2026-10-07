window.addEventListener("DOMContentLoaded",function(){
 if(!window.WORD_BANK)return;
 const root=document.getElementById("app")||document.querySelector(".wrap")||document.body;
 const page=(location.pathname.split("/").pop()||"").toLowerCase();
 const CONFIG={
   "ntpu.html":[["N","原 Word｜北大核心 N"],["P","原 Word｜壓力備審 P"]],
   "nycu.html":[["Y","原 Word｜陽明交大核心 Y"],["M","原 Word｜商管基礎 M"]],
   "english-v4.html":[["E","原 Word｜英文商業／時事 E"],["X","原 Word｜英文研究／統計 X"]],
   "research.html":[["R","原 Word｜研究計畫 R"]]
 };
 const groups=CONFIG[page];if(!groups)return;
 const LABELS={N:"北大核心",Y:"交大核心",E:"英文商業／時事",R:"研究計畫",M:"商管基礎",P:"壓力備審",X:"英文研究／統計"};
 function beginner(prefix){
   if(prefix==="R")return "先判斷教授是在問研究問題、變項、測量、方法還是限制，再套回你的會員研究。";
   if(prefix==="X")return "先用中文確認自己真的懂，再用簡單英文講：定義 → 你的研究例子 → 一個限制。";
   if(prefix==="E")return "先講立場，再說企業會受到什麼影響，最後補一個風險或限制。";
   if(prefix==="M")return "先用一句白話定義，再用工作或生活例子，最後說這個概念能幫管理者做什麼決策。";
   if(prefix==="P")return "先承認教授質疑裡合理的部分，再用真實經歷和證據回答，不要硬凹。";
   if(prefix==="N")return "答案要回到你的真實主線：設計／主管 → 廣告數據 → MyCard → 為什麼現在讀研究所。";
   if(prefix==="Y")return "先把概念講對，再補商管機制、例子和限制；不要只背新聞。";
   return "先弄懂題目在問什麼，再答。";
 }
 function card(x){
   const d=document.createElement("details");
   const s=document.createElement("summary");
   s.innerHTML='<span class="chip">'+x.id+'</span><span class="chip">'+LABELS[x.id[0]]+'</span><div>'+x.question+'</div>';
   d.appendChild(s);
   const intro=document.createElement("div");intro.className="box green";intro.innerHTML='<b>初學者先想</b><br>'+beginner(x.id[0]);d.appendChild(intro);
   if(x.answer){const a=document.createElement("div");a.className="box blue";a.innerHTML='<b>60秒口說回答</b><br>'+x.answer;d.appendChild(a)}
   if(x.follow){const f=document.createElement("div");f.className="box warm";f.innerHTML='<b>教授追問</b><br>'+x.follow;d.appendChild(f)}
   if(x.second){const s2=document.createElement("div");s2.className="box blue";s2.innerHTML='<b>第二層回答</b><br>'+x.second;d.appendChild(s2)}
   if(x.tip){const t=document.createElement("div");t.className="box";t.innerHTML='<b>提醒</b><br>'+x.tip;d.appendChild(t)}
   return d;
 }
 groups.forEach(([prefix,title])=>{
   if(document.getElementById("word-"+prefix))return;
   const arr=WORD_BANK.filter(x=>x.id.startsWith(prefix));
   const sec=document.createElement("section");sec.className="section";sec.id="word-"+prefix;
   const h=document.createElement("h2");h.textContent=title+"（"+arr.length+"題）";sec.appendChild(h);
   const note=document.createElement("div");note.className="card";note.innerHTML='<p><b>這一區已直接整合原 Word 題目。</b> 不用再去完整題庫搜尋。答案預設收起，先自己說完／寫完再展開。</p>';sec.appendChild(note);
   arr.forEach(x=>sec.appendChild(card(x)));root.appendChild(sec);
 });
});