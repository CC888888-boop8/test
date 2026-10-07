(function(){
const NAV=[["index.html","⌂","首頁"],["ntpu.html","N","北大"],["nycu.html","Y","交大"],["research.html","R","研究"],["english-v4.html","EN","英文"],["more.html","•••","更多"]];
const SS=window.speechSynthesis;let voices=[],audioBar=null;
function page(){return location.pathname.split("/").pop()||"index.html"}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)^s.charCodeAt(i);return(h>>>0).toString(36)}
function loadVoices(){if(SS)voices=SS.getVoices()||[]}
function prefVoice(accent){
 const lang=accent==="uk"?"en-GB":"en-US";
 const pri=accent==="uk"?[/Daniel/i,/Serena/i,/Sonia/i,/Libby/i,/Ryan/i,/Google UK English/i,/Natural.*English.*UK/i]:[/Samantha/i,/Ava/i,/Aria/i,/Jenny/i,/Guy/i,/Google US English/i,/Natural.*English.*US/i];
 const candidates=voices.filter(v=>(v.lang||"").toLowerCase().startsWith(lang.toLowerCase()));
 for(const re of pri){const v=candidates.find(x=>re.test(x.name));if(v)return v}
 return candidates[0]||voices.find(v=>(v.lang||"").toLowerCase().startsWith("en"))||null
}
function ensureAudioBar(){
 if(audioBar||!SS)return;
 audioBar=document.createElement("div");audioBar.className="audio-settings";
 const accent=localStorage.getItem("study-accent")||"us",rate=localStorage.getItem("study-rate")||"0.92";
 audioBar.innerHTML='<span class="audio-label">英文語音</span><select aria-label="英文口音"><option value="us">美式</option><option value="uk">英式</option></select><select aria-label="語速"><option value="0.82">慢</option><option value="0.92">自然</option><option value="1">正常</option></select><button type="button">■ 停止</button>';
 const sels=audioBar.querySelectorAll("select");sels[0].value=accent;sels[1].value=rate;
 sels[0].onchange=()=>localStorage.setItem("study-accent",sels[0].value);
 sels[1].onchange=()=>localStorage.setItem("study-rate",sels[1].value);
 audioBar.querySelector("button").onclick=()=>SS.cancel();
 const wrap=document.querySelector(".wrap,.w,main")||document.body;
 wrap.insertBefore(audioBar,wrap.firstChild);
}
function speak(text,btn){
 if(!SS||!text)return;
 ensureAudioBar();SS.cancel();loadVoices();
 const u=new SpeechSynthesisUtterance(text.replace(/\s+/g," ").trim());
 const accent=localStorage.getItem("study-accent")||"us";
 u.lang=accent==="uk"?"en-GB":"en-US";u.rate=Number(localStorage.getItem("study-rate")||"0.92");u.pitch=1;
 const v=prefVoice(accent);if(v)u.voice=v;
 if(btn){btn.classList.add("playing");btn.textContent="■ 播放中"}
 u.onend=u.onerror=()=>{if(btn){btn.classList.remove("playing");btn.textContent="▶︎ 聽英文"}};
 SS.speak(u);
}
function englishHeavy(text){
 const t=(text||"").replace(/https?:\/\/\S+/g,"");const latin=(t.match(/[A-Za-z]/g)||[]).length,zh=(t.match(/[\u4e00-\u9fff]/g)||[]).length;
 return latin>=18 && latin>zh*1.35;
}
function addSpeak(el){
 if(!SS||el.dataset.speechReady||el.closest(".note-panel,.audio-settings"))return;
 const raw=el.textContent.trim();if(!englishHeavy(raw))return;
 el.dataset.speechReady="1";ensureAudioBar();
 const b=document.createElement("button");b.type="button";b.className="speak-btn";b.textContent="▶︎ 聽英文";b.setAttribute("aria-label","播放英文");
 b.onclick=e=>{e.preventDefault();e.stopPropagation();speak(raw,b)};
 if(el.tagName==="SUMMARY")el.appendChild(b);else el.insertBefore(b,el.firstChild);
}
function noteKey(d){return "study-note:"+page()+":"+hash((d.querySelector("summary")?.textContent||"").replace("▶︎ 聽英文",""))}
function addNotes(d){
 if(d.dataset.notesReady)return;d.dataset.notesReady="1";d.removeAttribute("open");
 const key=noteKey(d),saved=JSON.parse(localStorage.getItem(key)||"{}");
 const p=document.createElement("section");p.className="note-panel";
 p.innerHTML='<div class="note-head"><b>先自己回答／做筆記</b><span class="save-state">自動儲存</span></div><textarea rows="4" placeholder="先不要開答案。把你現在會說的版本寫在這裡…"></textarea><input type="text" placeholder="關鍵字／卡住的地方"><label class="done-check"><input type="checkbox"> 我已經口頭回答過這題</label><button type="button" class="clear-note">清除這題筆記</button>';
 const ta=p.querySelector("textarea"),inp=p.querySelector('input[type="text"]'),ck=p.querySelector('input[type="checkbox"]');
 ta.value=saved.answer||"";inp.value=saved.keywords||"";ck.checked=!!saved.done;
 const save=()=>{localStorage.setItem(key,JSON.stringify({answer:ta.value,keywords:inp.value,done:ck.checked,updated:Date.now()}));p.querySelector(".save-state").textContent="已儲存"};
 [ta,inp].forEach(x=>x.addEventListener("input",save));ck.addEventListener("change",save);
 p.querySelector(".clear-note").onclick=()=>{if(confirm("清除這題的筆記？")){ta.value="";inp.value="";ck.checked=false;localStorage.removeItem(key);p.querySelector(".save-state").textContent="已清除"}};
 d.insertAdjacentElement("afterend",p);
}
function topbar(){
 if(document.querySelector(".study-topbar"))return;
 const bar=document.createElement("div");bar.className="study-topbar";
 const back=document.createElement("button");back.type="button";back.textContent="← 返回";back.onclick=()=>{if(history.length>1)history.back();else location.href="index.html"};
 const home=document.createElement("a");home.href="index.html";home.textContent="⌂ 首頁";
 bar.append(back,home);
 const wrap=document.querySelector(".wrap,.w,main")||document.body;wrap.insertBefore(bar,wrap.firstChild);
}
function nav(){
 const old=document.querySelector(".nav,.bottom-nav");const n=document.createElement("nav");n.className="bottom-nav";const name=page();
 n.innerHTML=NAV.map(([u,ic,t])=>'<a href="'+u+'" class="'+(u===name?"active":"")+'"><span class="nav-ico">'+ic+'</span>'+t+'</a>').join("");
 if(old)old.replaceWith(n);else document.body.append(n);
}
function enhance(root=document){
 if(root.matches?.("details"))addNotes(root);
 if(root.matches?.("summary,.en,.box,p,li"))addSpeak(root);
 root.querySelectorAll?.("details").forEach(addNotes);
 root.querySelectorAll?.("summary,.en,.box,p,li").forEach(addSpeak);
 root.querySelectorAll?.("details[open]").forEach(d=>d.removeAttribute("open"));
}
function go(){
 topbar();nav();enhance(document);loadVoices();if(SS)SS.onvoiceschanged=loadVoices;
 const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)enhance(n)});mo.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();
})();