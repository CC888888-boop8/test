(function(){
const ENABLED_PAGES=new Set(["ntpu.html","nycu.html","research.html","english-v4.html","group-v4.html","mock-v4.html","daily-v4.html","word-bank.html","toeic.html","phrases.html","cases.html","history.html"]);
const PAGE=(location.pathname.split("/").pop()||"index.html").toLowerCase();
if(!ENABLED_PAGES.has(PAGE))return;
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)^s.charCodeAt(i);return(h>>>0).toString(36)}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function cleanText(el){if(!el)return"";const c=el.cloneNode(true);c.querySelectorAll("button,.chip,.tag,.question-tools,.save-state").forEach(x=>x.remove());return c.textContent.replace(/\s+/g," ").trim()}
function questionOf(d){return cleanText(d.querySelector("summary"))}
function isEnglish(t){const la=(t.match(/[A-Za-z]/g)||[]).length,zh=(t.match(/[\u4e00-\u9fff]/g)||[]).length;return la>=14&&la>zh*1.6}
function chatKey(d){return "study-ai-chat:v2:"+PAGE+":"+hash(questionOf(d))}
function getChat(d){try{return JSON.parse(localStorage.getItem(chatKey(d))||"[]")}catch(e){return[]}}
function setChat(d,a){localStorage.setItem(chatKey(d),JSON.stringify(a.slice(-30)))}
function getEndpoint(){return (window.STUDY_AI_ENDPOINT||localStorage.getItem("study-ai-endpoint")||"").replace(/\/$/,"")}
function getSecret(){return localStorage.getItem("study-ai-secret")||""}
function noteFor(d){
 let n=d.nextElementSibling;
 for(let i=0;i<5&&n;i++,n=n.nextElementSibling){if(n.classList?.contains("note-panel"))return (n.querySelector("textarea")?.value||"").trim()}
 return "";
}
function contextFor(d){
 const q=questionOf(d);
 const boxes=[...d.querySelectorAll(".box")].map(b=>cleanText(b)).filter(Boolean).slice(0,10);
 return {page:PAGE,question:q,is_english:isEnglish(q),reference:boxes.join("\n\n").slice(0,8500),user_note:noteFor(d).slice(0,2800)};
}
function fmt(t){return esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\n/g,"<br>")}
function configNotice(){
 return '<div class="ai-offline"><b>AI 對話介面已完成，但後端還沒連線。</b><br>對話會先留在這一題。連好安全後端後，不用重做任何題卡。<br><a href="ai-settings.html">AI 連線設定 →</a></div>';
}
function renderMessages(panel,d){
 const list=panel.querySelector(".ai-messages"),chat=getChat(d);list.innerHTML="";
 if(!chat.length){list.innerHTML='<div class="ai-empty">你可以直接問：「這題我看不懂」、「我這樣回答可以嗎？」或請 AI 模擬教授追問。</div>';return}
 chat.forEach((m,i)=>{const row=document.createElement("div");row.className="ai-msg "+m.role;row.innerHTML='<div class="ai-msg-body">'+fmt(m.content)+'</div><button type="button" class="ai-msg-delete" title="刪除這則">×</button>';row.querySelector("button").onclick=()=>{const a=getChat(d);a.splice(i,1);setChat(d,a);renderMessages(panel,d)};list.appendChild(row)});
 list.scrollTop=list.scrollHeight;
}
async function send(panel,d,text){
 const msg=(text||"").trim();if(!msg)return;
 let chat=getChat(d);chat.push({role:"user",content:msg,ts:Date.now()});setChat(d,chat);renderMessages(panel,d);
 const input=panel.querySelector("textarea");input.value="";
 const endpoint=getEndpoint(),secret=getSecret();
 if(!endpoint){panel.querySelector(".ai-status").innerHTML=configNotice();return}
 const status=panel.querySelector(".ai-status");status.innerHTML='<span class="ai-thinking">AI 正在看這一題…</span>';
 const btn=panel.querySelector(".ai-send");btn.disabled=true;
 try{
  const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json",...(secret?{"X-Study-Secret":secret}:{})},body:JSON.stringify({context:contextFor(d),message:msg,history:chat.slice(-12)})});
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw new Error(data.error||("HTTP "+res.status));
  const answer=(data.answer||data.output||"").trim();if(!answer)throw new Error("AI 沒有回傳內容");
  chat=getChat(d);chat.push({role:"assistant",content:answer,ts:Date.now()});setChat(d,chat);renderMessages(panel,d);status.textContent="";
 }catch(e){
  status.innerHTML='<div class="ai-error"><b>這次沒有送成功。</b> '+esc(e.message)+'<br><a href="ai-settings.html">檢查 AI 連線設定 →</a></div>';
 }finally{btn.disabled=false}
}
function quicks(d){
 const en=isEnglish(questionOf(d));
 const a=[
  ["完全看不懂","請把這題當成我是完全初學者來教。先用最白話的一句話告訴我這題在問什麼，再用生活例子，最後套回我的情況。不要一開始丟專有名詞。"],
  ["評我的回答","請看我這題的筆記／作答，告訴我：1. 哪裡答對題 2. 哪裡太空或太像背稿 3. 教授會追問哪裡 4. 幫我改成我面試時真的講得出口的版本。"],
  ["模擬教授追問","請當北大／陽明交大的教授，根據這一題和我的回答，先追問我一題。不要先給答案；等我回答後再評。"],
  ["再深入一層","不要重複參考答案。請解釋這題背後更深一層的理論、管理機制或統計邏輯，並告訴我教授為什麼可能從這裡往下追。"],
  ["改成口語","請把這題的參考答案改成自然、像我本人面試會講的口語中文。不要像論文，也不要像AI稿。"]
 ];
 if(en)a.push(["英文修正","請用我目前能說出口的英文程度，幫我把這題整理成自然的英文口說答案。句子不要太長，並附中文意思和3個我一定要會的英文句型。"]);
 return a;
}
function buildPanel(d){
 if(d.dataset.aiReady||d.classList.contains("note-panel")||d.classList.contains("question-lookup-panel"))return;d.dataset.aiReady="1";
 const q=questionOf(d);if(!q)return;
 const launch=document.createElement("button");launch.type="button";launch.className="ai-launch";launch.innerHTML='✦ 問 AI <span>這一題自己的紀錄</span>';
 const panel=document.createElement("section");panel.className="ai-panel";panel.hidden=true;
 panel.innerHTML='<div class="ai-head"><div><b>AI 題目家教</b><div class="small">只針對這一題＋你的筆記</div></div><div class="ai-head-actions"><button type="button" class="ai-clear">清空對話</button><button type="button" class="ai-close">收起</button></div></div><div class="ai-quick"></div><div class="ai-messages"></div><div class="ai-status"></div><div class="ai-compose"><textarea rows="2" placeholder="直接問：為什麼不能這樣答？這個統計到底是什麼？我這樣回答可以嗎？"></textarea><button type="button" class="ai-send">送出</button></div>';
 let anchor=d;
 for(let i=0;i<6&&anchor.nextElementSibling;i++){const n=anchor.nextElementSibling;if(n.classList?.contains("question-tools")||n.classList?.contains("note-panel")||n.classList?.contains("question-lookup-panel"))anchor=n;else break}
 anchor.insertAdjacentElement("afterend",panel);panel.insertAdjacentElement("beforebegin",launch);
 const quick=panel.querySelector(".ai-quick");quicks(d).forEach(([label,prompt])=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=()=>send(panel,d,prompt);quick.appendChild(b)});
 launch.onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden){renderMessages(panel,d);if(!getEndpoint())panel.querySelector(".ai-status").innerHTML=configNotice()}};
 panel.querySelector(".ai-close").onclick=()=>panel.hidden=true;
 panel.querySelector(".ai-clear").onclick=()=>{if(confirm("確定清空這一題的 AI 對話紀錄嗎？")){localStorage.removeItem(chatKey(d));renderMessages(panel,d)}};
 panel.querySelector(".ai-send").onclick=()=>send(panel,d,panel.querySelector("textarea").value);
 panel.querySelector("textarea").addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();send(panel,d,e.currentTarget.value)}});
}
function scan(root=document){if(root.matches?.("details"))buildPanel(root);root.querySelectorAll?.("details:not(.note-panel):not(.question-lookup-panel)").forEach(buildPanel)}
function go(){scan(document);new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}))).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();
})();