(function(){
const NAV=[["index.html","⌂","首頁"],["ntpu.html","N","北大"],["nycu.html","Y","交大"],["research.html","R","研究"],["english-v4.html","EN","英文"],["more.html","•••","更多"]];
const SS=window.speechSynthesis;let voices=[],audioBar=null,wordSheet=null,lastSelection="";
function page(){return location.pathname.split("/").pop()||"index.html"}
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)^s.charCodeAt(i);return(h>>>0).toString(36)}
function englishScore(t){const latin=(t.match(/[A-Za-z]/g)||[]).length,zh=(t.match(/[\u4e00-\u9fff]/g)||[]).length;return {latin,zh,ok:latin>=14&&zh<=2&&latin>8}}
function cleanQuestionText(summary){
 const small=summary.querySelector(".small");
 const candidates=[];
 if(small)candidates.push(small.textContent.trim());
 const c=summary.cloneNode(true);c.querySelectorAll(".chip,.tag,.small,.speak-btn,.lookup-btn,.trans-btn").forEach(x=>x.remove());
 const raw=c.textContent.replace(/\s+/g," ").trim();
 raw.split("｜").forEach(x=>candidates.push(x.trim()));candidates.push(raw);
 candidates.sort((a,b)=>{const A=englishScore(a),B=englishScore(b);return (B.ok-A.ok)||(B.latin-B.zh)-(A.latin-A.zh)||b.length-a.length});
 let q=candidates.find(x=>englishScore(x).ok)||"";
 q=q.replace(/^(English|英文|英文時事|英文AI|英文ESG|英文財務|英文台灣科技|英文AI治理|英文AI投資|英文全球供應鏈)\s*[：:｜-]?\s*/i,"").trim();
 return q;
}
function cleanForSpeech(t){
 return t.replace(/\bAI\b/g,"A I").replace(/\bESG\b/g,"E S G").replace(/\bROIC\b/g,"R O I C").replace(/\bWACC\b/g,"W A C C").replace(/\bU\.S\.\b/g,"U.S.").replace(/\bOpenAI\b/g,"Open A I").replace(/\bNVIDIA\b/g,"Nvidia").replace(/\bBRICS\b/g,"Bricks").replace(/\s*\/\s*/g," or ").replace(/\s+/g," ").trim();
}
function loadVoices(){if(SS)voices=SS.getVoices()||[];refreshVoiceOptions()}
function voiceScore(v,lang){
 let s=0,n=v.name||"";if((v.lang||"").toLowerCase().startsWith(lang.toLowerCase()))s+=100;
 if(/Natural|Enhanced|Premium|Neural|Online/i.test(n))s+=50;
 if(/Jenny|Aria|Guy|Samantha|Ava|Sonia|Serena|Daniel|Ryan|Libby|Google/i.test(n))s+=30;
 if(/Compact|Novelty/i.test(n))s-=80;return s
}
function bestVoice(lang){return voices.slice().sort((a,b)=>voiceScore(b,lang)-voiceScore(a,lang))[0]||null}
function refreshVoiceOptions(){
 if(!audioBar)return;const sel=audioBar.querySelector(".voice-select");if(!sel)return;
 const current=localStorage.getItem("study-voice")||"";const accent=localStorage.getItem("study-accent")||"us",lang=accent==="uk"?"en-GB":"en-US";
 const list=voices.filter(v=>(v.lang||"").toLowerCase().startsWith(lang.toLowerCase())).sort((a,b)=>voiceScore(b,lang)-voiceScore(a,lang));
 sel.innerHTML='<option value="">自動選自然聲</option>'+list.map(v=>'<option value="'+encodeURIComponent(v.voiceURI)+'">'+v.name+'</option>').join("");
 if(current&&list.some(v=>encodeURIComponent(v.voiceURI)===current))sel.value=current;
}
function ensureAudioBar(){
 if(audioBar||!SS)return;
 audioBar=document.createElement("div");audioBar.className="audio-settings";
 const accent=localStorage.getItem("study-accent")||"us",rate=localStorage.getItem("study-rate")||"0.92";
 audioBar.innerHTML='<span class="audio-label">英文題目語音</span><select class="accent-select" aria-label="英文口音"><option value="us">美式</option><option value="uk">英式</option></select><select class="voice-select" aria-label="英文聲音"><option value="">自動選自然聲</option></select><select class="rate-select" aria-label="語速"><option value="0.82">慢一點</option><option value="0.92">自然</option><option value="1">正常</option></select><button type="button">■ 停止</button>';
 audioBar.querySelector(".accent-select").value=accent;audioBar.querySelector(".rate-select").value=rate;
 audioBar.querySelector(".accent-select").onchange=e=>{localStorage.setItem("study-accent",e.target.value);localStorage.removeItem("study-voice");refreshVoiceOptions()};
 audioBar.querySelector(".voice-select").onchange=e=>localStorage.setItem("study-voice",e.target.value);
 audioBar.querySelector(".rate-select").onchange=e=>localStorage.setItem("study-rate",e.target.value);
 audioBar.querySelector("button").onclick=()=>SS.cancel();
 const wrap=document.querySelector(".wrap,.w,main")||document.body;wrap.insertBefore(audioBar,wrap.firstChild);refreshVoiceOptions();
}
function speakQuestion(text,btn){
 if(!SS||!text)return;ensureAudioBar();SS.cancel();loadVoices();
 const accent=localStorage.getItem("study-accent")||"us",lang=accent==="uk"?"en-GB":"en-US";
 const u=new SpeechSynthesisUtterance(cleanForSpeech(text));u.lang=lang;u.rate=Number(localStorage.getItem("study-rate")||"0.92");u.pitch=1;
 const wanted=decodeURIComponent(localStorage.getItem("study-voice")||"");u.voice=voices.find(v=>v.voiceURI===wanted)||bestVoice(lang);
 if(btn){btn.classList.add("playing");btn.textContent="■ 停止"}
 u.onend=u.onerror=()=>{if(btn){btn.classList.remove("playing");btn.textContent="▶︎ 聽題目"}};
 SS.speak(u);
}
function translationFor(q,summary){
 if(window.QUESTION_TRANSLATIONS&&QUESTION_TRANSLATIONS[q])return QUESTION_TRANSLATIONS[q];
 const small=summary.querySelector(".small");if(small&&!englishScore(small.textContent).ok&&small.textContent.trim())return small.textContent.trim();
 const d=summary.closest("details");if(d){const boxes=[...d.querySelectorAll(".box")];const zh=boxes.find(b=>{const t=b.textContent;return (t.match(/[\u4e00-\u9fff]/g)||[]).length>20 && !/answer|回答/i.test(t.slice(0,30))});if(zh)return zh.textContent.replace(/^.*?(?:中文題意|中文理解)[：:]?/,"").trim()}
 return "";
}
function vocabList(){try{return JSON.parse(localStorage.getItem("study-vocab-v1")||"[]")}catch(e){return[]}}
function saveVocab(item){
 const a=vocabList(),i=a.findIndex(x=>x.word.toLowerCase()===item.word.toLowerCase());
 if(i>=0)a[i]={...a[i],...item,updated:Date.now()};else a.unshift({...item,created:Date.now(),updated:Date.now()});
 localStorage.setItem("study-vocab-v1",JSON.stringify(a.slice(0,500)));
}
function ensureWordSheet(){
 if(wordSheet)return wordSheet;
 wordSheet=document.createElement("div");wordSheet.className="word-sheet";wordSheet.hidden=true;
 wordSheet.innerHTML='<div class="word-sheet-card"><div class="word-sheet-head"><b>查單字／片語</b><button class="word-close">×</button></div><div class="question-context"></div><div class="question-zh"></div><div class="word-row"><input class="word-input" placeholder="輸入不會的英文單字或片語"><button class="dict-go">查詢</button></div><div class="dict-result"></div><div class="word-links"></div><label>我自己的中文意思<input class="meaning-input" placeholder="例如：留存、持續使用"></label><label>我的例句／記法<textarea class="word-note" rows="2" placeholder="用自己的方式記"></textarea></label><button class="save-word">★ 存到單字本</button><a class="vocab-link" href="vocab-notebook.html">打開我的單字本 →</a></div>';
 document.body.appendChild(wordSheet);wordSheet.querySelector(".word-close").onclick=()=>wordSheet.hidden=true;wordSheet.onclick=e=>{if(e.target===wordSheet)wordSheet.hidden=true};
 return wordSheet;
}
async function lookupWord(sheet){
 const input=sheet.querySelector(".word-input"),word=input.value.trim();if(!word)return;
 const r=sheet.querySelector(".dict-result");r.innerHTML='<span class="muted">查詢中…</span>';
 const enc=encodeURIComponent(word),links=sheet.querySelector(".word-links");
 links.innerHTML='<a target="_blank" rel="noopener" href="https://dictionary.cambridge.org/dictionary/english-chinese-traditional/'+enc+'">Cambridge 繁中字典 ↗</a><a target="_blank" rel="noopener" href="https://translate.google.com/?sl=en&tl=zh-TW&text='+enc+'&op=translate">Google 翻譯 ↗</a>';
 try{const res=await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+enc);if(!res.ok)throw 0;const data=await res.json(),e=data[0],defs=[];(e.meanings||[]).slice(0,3).forEach(m=>(m.definitions||[]).slice(0,2).forEach(d=>defs.push("<b>"+m.partOfSpeech+"</b> "+d.definition)));r.innerHTML=(e.phonetic?'<div class="phonetic">'+e.phonetic+'</div>':'')+defs.join("<br>")}catch(e){r.innerHTML='<span class="muted">內建英文定義目前抓不到，請用下方 Cambridge 或 Google 翻譯。</span>'}
}
function openLookup(q,summary){
 const s=ensureWordSheet(),zh=translationFor(q,summary);s.hidden=false;s.dataset.question=q;s.querySelector(".question-context").innerHTML='<b>這題：</b> '+q;
 s.querySelector(".question-zh").innerHTML=zh?'<b>中文題意：</b> '+zh:'<a target="_blank" rel="noopener" href="https://translate.google.com/?sl=en&tl=zh-TW&text='+encodeURIComponent(q)+'&op=translate">看這題的繁中翻譯 ↗</a>';
 const selected=(lastSelection||"").trim();s.querySelector(".word-input").value=/^[A-Za-z][A-Za-z\-'. ]{0,50}$/.test(selected)?selected:"";s.querySelector(".meaning-input").value="";s.querySelector(".word-note").value="";s.querySelector(".dict-result").innerHTML="";s.querySelector(".word-links").innerHTML="";
 s.querySelector(".dict-go").onclick=()=>lookupWord(s);s.querySelector(".word-input").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();lookupWord(s)}};
 s.querySelector(".save-word").onclick=()=>{const w=s.querySelector(".word-input").value.trim();if(!w)return;saveVocab({word:w,meaning:s.querySelector(".meaning-input").value.trim(),note:s.querySelector(".word-note").value.trim(),question:q,page:page()});s.querySelector(".save-word").textContent="✓ 已存";setTimeout(()=>s.querySelector(".save-word").textContent="★ 存到單字本",900)};
}
function addQuestionTools(summary){
 if(summary.dataset.questionTools)return;const q=cleanQuestionText(summary);if(!q||!englishScore(q).ok)return;summary.dataset.questionTools="1";summary.dataset.questionText=q;ensureAudioBar();
 const row=document.createElement("span");row.className="question-tools";
 const sp=document.createElement("button");sp.type="button";sp.className="speak-btn";sp.textContent="▶︎ 聽題目";sp.onmousedown=e=>e.stopPropagation();sp.onclick=e=>{e.preventDefault();e.stopPropagation();if(sp.classList.contains("playing")){SS.cancel();sp.classList.remove("playing");sp.textContent="▶︎ 聽題目"}else speakQuestion(q,sp)};
 const tr=document.createElement("button");tr.type="button";tr.className="lookup-btn";tr.textContent="Aa 中譯／查單字";tr.onmousedown=e=>{e.preventDefault();lastSelection=window.getSelection()?.toString()||""};tr.onclick=e=>{e.preventDefault();e.stopPropagation();openLookup(q,summary)};
 row.append(sp,tr);summary.appendChild(row);
}
function noteKey(d){return "study-note:"+page()+":"+hash((d.querySelector("summary")?.dataset.questionText||d.querySelector("summary")?.textContent||""))}
function addNotes(d){
 if(d.dataset.notesReady||d.classList.contains("note-panel"))return;d.dataset.notesReady="1";d.removeAttribute("open");
 const key=noteKey(d),saved=(()=>{try{return JSON.parse(localStorage.getItem(key)||"{}")}catch(e){return{}}})();
 const p=document.createElement("details");p.className="note-panel";p.innerHTML='<summary>✎ 我的作答／筆記 <span class="save-state">自動儲存</span></summary><div class="note-body"><textarea rows="4" placeholder="先不要開答案。把你現在真的會說的版本寫在這裡…"></textarea><input type="text" placeholder="關鍵字／卡住的地方"><label class="done-check"><input type="checkbox"> 我已經口頭回答過這題</label><button type="button" class="clear-note">清除這題筆記</button></div>';
 const ta=p.querySelector("textarea"),inp=p.querySelector('input[type="text"]'),ck=p.querySelector('input[type="checkbox"]');ta.value=saved.answer||"";inp.value=saved.keywords||"";ck.checked=!!saved.done;
 const save=()=>{localStorage.setItem(key,JSON.stringify({answer:ta.value,keywords:inp.value,done:ck.checked,updated:Date.now()}));p.querySelector(".save-state").textContent="已儲存"};
 [ta,inp].forEach(x=>x.addEventListener("input",save));ck.addEventListener("change",save);p.querySelector(".clear-note").onclick=e=>{e.preventDefault();if(confirm("清除這題的筆記？")){ta.value="";inp.value="";ck.checked=false;localStorage.removeItem(key);p.querySelector(".save-state").textContent="已清除"}};
 d.insertAdjacentElement("afterend",p);
}
function topbar(){if(document.querySelector(".study-topbar"))return;const bar=document.createElement("div");bar.className="study-topbar";const back=document.createElement("button");back.type="button";back.textContent="← 返回";back.onclick=()=>{if(history.length>1)history.back();else location.href="index.html"};const home=document.createElement("a");home.href="index.html";home.textContent="⌂ 首頁";bar.append(back,home);const wrap=document.querySelector(".wrap,.w,main")||document.body;wrap.insertBefore(bar,wrap.firstChild)}
function nav(){const old=document.querySelector(".nav,.bottom-nav");const n=document.createElement("nav");n.className="bottom-nav";const name=page();n.innerHTML=NAV.map(([u,ic,t])=>'<a href="'+u+'" class="'+(u===name?"active":"")+'"><span class="nav-ico">'+ic+'</span>'+t+'</a>').join("");if(old)old.replaceWith(n);else document.body.append(n)}
function enhance(root=document){
 if(root.matches?.("details")&&!root.classList.contains("note-panel"))addNotes(root);
 if(root.matches?.("summary")&&!root.closest(".note-panel"))addQuestionTools(root);
 root.querySelectorAll?.("details:not(.note-panel)").forEach(addNotes);root.querySelectorAll?.("summary").forEach(s=>{if(!s.closest(".note-panel"))addQuestionTools(s)});
 root.querySelectorAll?.("details:not(.note-panel)[open]").forEach(d=>d.removeAttribute("open"));
}
function go(){
 if(!window.QUESTION_TRANSLATIONS){const q=document.createElement("script");q.src="question-translations.js";q.onload=()=>enhance(document);document.head.appendChild(q)}
 topbar();nav();enhance(document);loadVoices();if(SS)SS.onvoiceschanged=loadVoices;document.addEventListener("selectionchange",()=>{const s=window.getSelection()?.toString().trim();if(s)lastSelection=s});const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)enhance(n)});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();
})();