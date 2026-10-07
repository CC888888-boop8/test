(function(){
const NAV=[["index.html","⌂","首頁"],["ntpu.html","N","北大"],["nycu.html","Y","交大"],["research.html","R","研究"],["english-v4.html","EN","英文"],["more.html","•••","更多"]];
const SS=window.speechSynthesis;
let voices=[],audioBar=null,lastSelection="",activeUtterance=null,activeButton=null;

function page(){return location.pathname.split("/").pop()||"index.html"}
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)^s.charCodeAt(i);return(h>>>0).toString(36)}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function englishScore(t){const latin=(t.match(/[A-Za-z]/g)||[]).length,zh=(t.match(/[\u4e00-\u9fff]/g)||[]).length;return{latin,zh,ok:latin>=14&&zh<=2&&latin>8}}

function cleanQuestionText(summary){
 const badge=[...summary.querySelectorAll(".chip,.tag")].map(x=>x.textContent).join(" ");
 if(/VOCAB|PHRASE|CHUNK/i.test(badge))return "";
 const candidates=[];
 const c=summary.cloneNode(true);
 c.querySelectorAll(".chip,.tag,.small,.question-tools,.speak-btn,.lookup-btn").forEach(x=>x.remove());
 const raw=c.textContent.replace(/\s+/g," ").trim();
 raw.split("｜").forEach(x=>candidates.push(x.trim()));
 summary.querySelectorAll("div").forEach(x=>candidates.push(x.textContent.trim()));
 candidates.sort((a,b)=>{const A=englishScore(a),B=englishScore(b);return(Number(B.ok)-Number(A.ok))+(B.latin-A.latin)*.01-(B.zh-A.zh)*.1});
 let q=candidates.find(x=>englishScore(x).ok)||"";
 q=q.replace(/^(English|英文|英文時事|英文AI|英文ESG|英文財務|英文台灣科技|英文AI治理|英文AI投資|英文全球供應鏈)\s*[：:｜-]?\s*/i,"").trim();
 return q;
}
function cleanForSpeech(t){
 return t.replace(/\bOpenAI\b/g,"Open A I")
 .replace(/\bAI\b/g,"A I")
 .replace(/\bESG\b/g,"E S G")
 .replace(/\bROIC\b/g,"R O I C")
 .replace(/\bWACC\b/g,"W A C C")
 .replace(/\bNVIDIA\b/g,"Nvidia")
 .replace(/\bBRICS\b/g,"Bricks")
 .replace(/\s*\/\s*/g," or ")
 .replace(/\s+/g," ").trim();
}

function loadVoices(){if(SS)voices=SS.getVoices()||[];refreshVoiceOptions()}
function voiceScore(v,lang){
 let s=0,n=v.name||"",vl=(v.lang||"").toLowerCase();
 if(vl.startsWith(lang.toLowerCase()))s+=120;
 else if(vl.startsWith("en"))s+=50;
 if(/Natural|Enhanced|Premium|Neural|Online/i.test(n))s+=60;
 if(/Jenny|Aria|Guy|Samantha|Ava|Sonia|Serena|Daniel|Ryan|Libby|Google/i.test(n))s+=35;
 if(/Compact|Novelty/i.test(n))s-=100;
 return s;
}
function bestVoice(lang){return voices.filter(v=>(v.lang||"").toLowerCase().startsWith("en")).sort((a,b)=>voiceScore(b,lang)-voiceScore(a,lang))[0]||null}
function refreshVoiceOptions(){
 if(!audioBar)return;
 const sel=audioBar.querySelector(".voice-select");if(!sel)return;
 const accent=localStorage.getItem("study-accent")||"us",lang=accent==="uk"?"en-GB":"en-US";
 const list=voices.filter(v=>(v.lang||"").toLowerCase().startsWith("en")).sort((a,b)=>voiceScore(b,lang)-voiceScore(a,lang));
 const current=localStorage.getItem("study-voice")||"";
 sel.innerHTML='<option value="">自動選最自然</option>'+list.map(v=>'<option value="'+encodeURIComponent(v.voiceURI)+'">'+esc(v.name)+' · '+esc(v.lang)+'</option>').join("");
 if(current&&list.some(v=>encodeURIComponent(v.voiceURI)===current))sel.value=current;
}
function resetActiveButton(){
 if(activeButton){activeButton.classList.remove("playing");activeButton.textContent=activeButton.dataset.idleLabel||"▶︎ 播放"}
 activeButton=null;activeUtterance=null;
}
function stopSpeech(){if(!SS)return;SS.cancel();resetActiveButton()}
function ensureAudioBar(){
 if(audioBar||!SS)return;
 audioBar=document.createElement("div");audioBar.className="audio-settings";
 audioBar.innerHTML='<span class="audio-label">英文題目語音</span><select class="accent-select"><option value="us">美式</option><option value="uk">英式</option></select><select class="voice-select"><option value="">自動選最自然</option></select><select class="rate-select"><option value="0.82">慢一點</option><option value="0.92">自然</option><option value="1">正常</option></select><button type="button">■ 停止</button>';
 audioBar.querySelector(".accent-select").value=localStorage.getItem("study-accent")||"us";
 audioBar.querySelector(".rate-select").value=localStorage.getItem("study-rate")||"0.92";
 audioBar.querySelector(".accent-select").onchange=e=>{localStorage.setItem("study-accent",e.target.value);localStorage.removeItem("study-voice");refreshVoiceOptions()};
 audioBar.querySelector(".voice-select").onchange=e=>localStorage.setItem("study-voice",e.target.value);
 audioBar.querySelector(".rate-select").onchange=e=>localStorage.setItem("study-rate",e.target.value);
 audioBar.querySelector("button").onclick=stopSpeech;
 const wrap=document.querySelector(".wrap,.w,main")||document.body;
 wrap.insertBefore(audioBar,wrap.firstChild);
 loadVoices();
}
function speakQuestion(text,btn){
 if(!SS||!text)return;
 ensureAudioBar();
 if(activeButton===btn&&(SS.speaking||SS.pending)){stopSpeech();return}
 const accent=localStorage.getItem("study-accent")||"us",lang=accent==="uk"?"en-GB":"en-US";
 const makeUtterance=(useChosenVoice)=>{
   loadVoices();
   const u=new SpeechSynthesisUtterance(cleanForSpeech(text));
   u.lang=lang;u.rate=Number(localStorage.getItem("study-rate")||"0.92");u.pitch=1;u.volume=1;
   if(useChosenVoice){
     const saved=localStorage.getItem("study-voice")||"",wanted=saved?decodeURIComponent(saved):"";
     u.voice=voices.find(v=>v.voiceURI===wanted)||bestVoice(lang)||null;
   }
   activeUtterance=u;activeButton=btn;btn.classList.add("playing");btn.textContent="■ 停止";
   u.onend=()=>resetActiveButton();
   u.onerror=()=>{
     if(useChosenVoice){
       try{SS.cancel();SS.resume()}catch(e){}
       activeUtterance=null;
       // 指定 voice 在部分 iPhone/Safari 會失敗，改用系統預設英文 voice 再試一次。
       setTimeout(()=>{const fallback=makeUtterance(false);try{SS.speak(fallback)}catch(e){resetActiveButton();btn.textContent="播放失敗，再按一次"}},40);
     }else{resetActiveButton();btn.textContent="播放失敗，再按一次"}
   };
   return u;
 };
 const startNow=()=>{const u=makeUtterance(true);try{SS.resume();SS.speak(u);setTimeout(()=>{if(SS.paused)SS.resume()},120)}catch(e){resetActiveButton();btn.textContent="播放失敗，再按一次"}};
 if(SS.speaking||SS.pending){SS.cancel();setTimeout(startNow,60)}else startNow();
}
function translationFor(q,summary){
 if(window.QUESTION_TRANSLATIONS&&QUESTION_TRANSLATIONS[q])return QUESTION_TRANSLATIONS[q];
 const small=summary.querySelector(".small");
 if(small&&!englishScore(small.textContent).ok&&small.textContent.trim())return small.textContent.trim();
 return "";
}
function vocabList(){try{return JSON.parse(localStorage.getItem("study-vocab-v1")||"[]")}catch(e){return[]}}
function saveVocab(item){
 const a=vocabList(),i=a.findIndex(x=>x.word.toLowerCase()===item.word.toLowerCase());
 if(i>=0)a[i]={...a[i],...item,updated:Date.now()};else a.unshift({...item,created:Date.now(),updated:Date.now()});
 localStorage.setItem("study-vocab-v1",JSON.stringify(a.slice(0,500)));
}

function toolPanelKey(summary){return "tool-"+hash(summary.dataset.questionText||summary.textContent)}
function ensureInlineLookup(summary,q){
 const details=summary.closest("details");if(!details)return null;
 let panel=details.nextElementSibling;
 if(panel?.classList.contains("question-lookup-panel"))return panel;
 // 若題目後面已有筆記，查字區放在筆記後面，但仍緊跟這一題，不放頁底。
 let anchor=details.nextElementSibling;
 if(anchor?.classList.contains("note-panel"))anchor=anchor;
 panel=document.createElement("details");panel.className="question-lookup-panel";
 const zh=translationFor(q,summary);
 panel.innerHTML='<summary>Aa 中文題意／查單字</summary><div class="lookup-body">'+
   '<div class="question-zh-inline">'+(zh?'<b>中文題意：</b> '+esc(zh):'<b>中文題意：</b> 目前沒有內建翻譯，可用下方整句翻譯。')+'</div>'+
   '<div class="word-row"><input class="word-input" placeholder="輸入不會的英文單字或片語"><button type="button" class="dict-go">查字</button></div>'+
   '<div class="dict-result"></div><div class="word-links"></div>'+
   '<label>我自己的中文意思<input class="meaning-input" placeholder="例如：retention＝留存"></label>'+
   '<label>我的例句／記法<textarea class="word-note" rows="2" placeholder="用自己的方式記"></textarea></label>'+
   '<button type="button" class="save-word">★ 存到單字本</button> <a class="vocab-link" href="vocab-notebook.html">我的單字本 →</a>'+
   '</div>';
 anchor.insertAdjacentElement("afterend",panel);
 const input=panel.querySelector(".word-input");
 panel.querySelector(".dict-go").onclick=()=>lookupWordInline(panel,q);
 input.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();lookupWordInline(panel,q)}};
 panel.querySelector(".save-word").onclick=()=>{const w=input.value.trim();if(!w)return;saveVocab({word:w,meaning:panel.querySelector(".meaning-input").value.trim(),note:panel.querySelector(".word-note").value.trim(),question:q,page:page()});panel.querySelector(".save-word").textContent="✓ 已存";setTimeout(()=>panel.querySelector(".save-word").textContent="★ 存到單字本",900)};
 return panel;
}
async function lookupWordInline(panel,q){
 const word=panel.querySelector(".word-input").value.trim();if(!word)return;
 const out=panel.querySelector(".dict-result"),links=panel.querySelector(".word-links"),enc=encodeURIComponent(word);
 out.innerHTML='<span class="muted">查詢中…</span>';
 links.innerHTML='<a target="_blank" rel="noopener" href="https://dictionary.cambridge.org/dictionary/english-chinese-traditional/'+enc+'">Cambridge 繁中 ↗</a> <a target="_blank" rel="noopener" href="https://translate.google.com/?sl=en&tl=zh-TW&text='+enc+'&op=translate">Google 翻譯 ↗</a> <a target="_blank" rel="noopener" href="https://translate.google.com/?sl=en&tl=zh-TW&text='+encodeURIComponent(q)+'&op=translate">整題翻譯 ↗</a>';
 try{
   const res=await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+enc);
   if(!res.ok)throw new Error();
   const data=await res.json(),e=data[0],defs=[];
   (e.meanings||[]).slice(0,3).forEach(m=>(m.definitions||[]).slice(0,2).forEach(d=>defs.push("<b>"+esc(m.partOfSpeech)+"</b> "+esc(d.definition))));
   out.innerHTML=(e.phonetic?'<div class="phonetic">'+esc(e.phonetic)+'</div>':'')+defs.join("<br>");
 }catch(e){out.innerHTML='<span class="muted">內建英文定義暫時抓不到，可以直接用上方 Cambridge／Google 翻譯；你的收藏功能仍可正常使用。</span>'}
}

function addQuestionTools(summary){
 if(summary.dataset.questionTools)return;
 const q=cleanQuestionText(summary);if(!q||!englishScore(q).ok)return;
 const details=summary.closest("details");if(!details)return;
 summary.dataset.questionTools="1";summary.dataset.questionText=q;ensureAudioBar();
 const row=document.createElement("div");row.className="question-tools";row.dataset.forQuestion=hash(q);
 const sp=document.createElement("button");sp.type="button";sp.className="speak-btn";sp.dataset.idleLabel="▶︎ 聽題目";sp.textContent=sp.dataset.idleLabel;
 sp.onclick=e=>{e.preventDefault();e.stopPropagation();speakQuestion(q,sp)};
 const tr=document.createElement("button");tr.type="button";tr.className="lookup-btn";tr.textContent="Aa 中文題意／查單字";
 tr.onmousedown=e=>{lastSelection=window.getSelection()?.toString().trim()||""};
 tr.onclick=e=>{e.preventDefault();e.stopPropagation();const panel=ensureInlineLookup(summary,q);if(panel){panel.open=true;const input=panel.querySelector(".word-input");if(lastSelection&&/^[A-Za-z][A-Za-z\-'. ]{0,50}$/.test(lastSelection))input.value=lastSelection;input.focus()}};
 row.append(sp,tr);
 details.insertAdjacentElement("afterend",row);
}
function answerText(box){
 const c=box.cloneNode(true);c.querySelectorAll("b,.answer-speak-btn,.speak-btn,.lookup-btn").forEach(x=>x.remove());
 return c.textContent.replace(/\s+/g," ").trim();
}
function addAnswerSpeech(box){
 if(box.dataset.answerSpeech)return;
 const text=answerText(box),latin=(text.match(/[A-Za-z]/g)||[]).length,zh=(text.match(/[\u4e00-\u9fff]/g)||[]).length;
 if(latin<35||zh>Math.max(3,latin*.08))return;
 box.dataset.answerSpeech="1";
 const btn=document.createElement("button");btn.type="button";btn.className="speak-btn answer-speak-btn";btn.dataset.idleLabel="▶︎ 聽答案";btn.textContent=btn.dataset.idleLabel;
 btn.onclick=e=>{e.preventDefault();e.stopPropagation();speakQuestion(text,btn)};
 box.insertBefore(btn,box.firstChild);
}
function noteKey(d){return "study-note:"+page()+":"+hash((d.querySelector("summary")?.dataset.questionText||d.querySelector("summary")?.textContent||""))}
function addNotes(d){
 if(d.dataset.notesReady||d.classList.contains("note-panel")||d.classList.contains("question-lookup-panel"))return;
 d.dataset.notesReady="1";d.removeAttribute("open");
 const key=noteKey(d),saved=(()=>{try{return JSON.parse(localStorage.getItem(key)||"{}")}catch(e){return{}}})();
 const p=document.createElement("details");p.className="note-panel";
 p.innerHTML='<summary>✎ 我的作答／筆記 <span class="save-state">自動儲存</span></summary><div class="note-body"><textarea rows="4" placeholder="先不要開答案。把你現在真的會說的版本寫在這裡…"></textarea><input type="text" placeholder="關鍵字／卡住的地方"><label class="done-check"><input type="checkbox"> 我已經口頭回答過這題</label><button type="button" class="clear-note">清除這題筆記</button></div>';
 const ta=p.querySelector("textarea"),inp=p.querySelector('input[type="text"]'),ck=p.querySelector('input[type="checkbox"]');
 ta.value=saved.answer||"";inp.value=saved.keywords||"";ck.checked=!!saved.done;
 const save=()=>{localStorage.setItem(key,JSON.stringify({answer:ta.value,keywords:inp.value,done:ck.checked,updated:Date.now()}));p.querySelector(".save-state").textContent="已儲存"};
 [ta,inp].forEach(x=>x.addEventListener("input",save));ck.addEventListener("change",save);
 p.querySelector(".clear-note").onclick=e=>{e.preventDefault();if(confirm("清除這題的筆記？")){ta.value="";inp.value="";ck.checked=false;localStorage.removeItem(key);p.querySelector(".save-state").textContent="已清除"}};
 d.insertAdjacentElement("afterend",p);
}

function topbar(){
 if(document.querySelector(".study-topbar"))return;
 const bar=document.createElement("div");bar.className="study-topbar";
 const back=document.createElement("button");back.type="button";back.textContent="← 返回";back.onclick=()=>{if(history.length>1)history.back();else location.href="index.html"};
 const home=document.createElement("a");home.href="index.html";home.textContent="⌂ 首頁";bar.append(back,home);
 const wrap=document.querySelector(".wrap,.w,main")||document.body;wrap.insertBefore(bar,wrap.firstChild);
}
function nav(){
 const old=document.querySelector(".nav,.bottom-nav");const n=document.createElement("nav");n.className="bottom-nav",name=page();
 n.innerHTML=NAV.map(([u,ic,t])=>'<a href="'+u+'" class="'+(u===name?"active":"")+'"><span class="nav-ico">'+ic+'</span>'+t+'</a>').join("");
 if(old)old.replaceWith(n);else document.body.append(n);
}
function enhance(root=document){
 if(root.matches?.("details")&&!root.classList.contains("note-panel")&&!root.classList.contains("question-lookup-panel"))addNotes(root);
 if(root.matches?.("summary")&&!root.closest(".note-panel,.question-lookup-panel"))addQuestionTools(root);if(root.matches?.(".box"))addAnswerSpeech(root);
 root.querySelectorAll?.("details:not(.note-panel):not(.question-lookup-panel)").forEach(addNotes);root.querySelectorAll?.(".box").forEach(addAnswerSpeech);
 root.querySelectorAll?.("summary").forEach(s=>{if(!s.closest(".note-panel,.question-lookup-panel"))addQuestionTools(s)});
 root.querySelectorAll?.("details:not(.note-panel):not(.question-lookup-panel)[open]").forEach(d=>d.removeAttribute("open"));
}
function go(){
 if(!window.QUESTION_TRANSLATIONS){const q=document.createElement("script");q.src="question-translations.js";q.onload=()=>enhance(document);document.head.appendChild(q)}
 topbar();nav();enhance(document);loadVoices();if(SS)SS.onvoiceschanged=loadVoices;
 document.addEventListener("selectionchange",()=>{const s=window.getSelection()?.toString().trim();if(s)lastSelection=s});
 const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)enhance(n)});
 mo.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();
})();