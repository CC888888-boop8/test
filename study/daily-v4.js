window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const NB=[...NTPU_V4,...NTPU_V6_EXTRA],YB=[...NYCU_V4,...NYCU_V6_EXTRA];
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">25-DAY SPRINT</div><h1>每日練習｜先懂，再答，再被追問</h1><p>每天固定：北大3題、交大3題、零基礎研究2章、英文1題、多人同場補答1題。後期再加入分校Mock。</p>';root.appendChild(hero);
const days=document.createElement("div");days.className="daystrip";root.appendChild(days);
const out=document.createElement("div");root.appendChild(out);let d=0;
function pick(a,n){return a[n%a.length]}
function box(title,body,link){return '<section class="card"><h3>'+title+'</h3>'+body+(link?'<p><a class="practice" href="'+link+'">進入完整頁面 →</a></p>':'')+'</section>'}
function isEnglishQ(q){const la=(q.match(/[A-Za-z]/g)||[]).length,zh=(q.match(/[\u4e00-\u9fff]/g)||[]).length;return la>=14&&zh<=2}
function qs(arr,start,count,school){return Array.from({length:count},(_,i)=>{const x=pick(arr,start+i),en=isEnglishQ(x[4]),ans=school==="Y"?(en?x[7]:x[8]):x[7];return '<details><summary>'+(i+1)+'. '+x[4]+'</summary><div class="box"><b>先自己答60–90秒</b><br>'+x[6]+'</div><div class="box blue"><b>'+(en?'English answer':'參考回答')+'</b><br>'+ans+'</div>'+(en?'<div class="box"><b>中文理解</b><br>'+x[8]+'</div>':'')+'<div class="box warm"><b>教授在看什麼</b><br>'+x[5]+'</div></details>'}).join('')}
function draw(){
 days.innerHTML=Array.from({length:25},(_,i)=>'<button class="'+(i===d?"active":"")+'" data-i="'+i+'"><b>D'+(i+1)+'</b><br><small>10/'+(7+i)+'</small></button>').join("");
 days.querySelectorAll("button").forEach(b=>b.onclick=()=>{d=+b.dataset.i;draw()});
 const nr=d*3,yr=d*3,rl=d*2;
 const en=YB.filter(x=>x[2].includes("英文")||x[1].startsWith("英文"));
 const e=pick(en,d);
 const r1=pick(RESEARCH_ZERO,rl),r2=pick(RESEARCH_ZERO,rl+1);
 let html='<section class="card"><span class="chip">DAY '+(d+1)+'</span><h2>10/'+(7+d)+'</h2><p class="meta">建議2.5–3小時。順序：研究理解 → 北大 → 交大 → 英文 → 同場補答。先口頭回答，再看答案。</p></section>';
 html+=box('研究從零｜今天2章','<details open><summary>LESSON '+r1.n+'｜'+r1.title+'</summary><div class="box green">'+r1.zero+'</div><div class="box blue"><b>套你的研究</b><br>'+r1.yours+'</div><div class="box warm"><b>教授問</b><br>'+r1.prof+'<br><br><b>回答</b><br>'+r1.oral+'</div></details><details><summary>LESSON '+r2.n+'｜'+r2.title+'</summary><div class="box green">'+r2.zero+'</div><div class="box blue"><b>套你的研究</b><br>'+r2.yours+'</div><div class="box warm"><b>教授問</b><br>'+r2.prof+'<br><br><b>回答</b><br>'+r2.oral+'</div></details>','research.html');
 html+=box('北大企管｜3題',qs(NB,nr,3,'N'),'ntpu.html');
 html+=box('陽明交大｜3題',qs(YB,yr,3,'Y'),'nycu.html');
 html+=box('英文面試｜1題','<details open><summary>'+e[4]+'</summary><div class="box"><b>中文理解</b><br>'+e[8]+'</div><div class="box blue"><b>English answer</b><br>'+e[7]+'</div>'+(e[9]&&e[9].length?'<div class="box warm"><b>Follow-up</b><br>'+e[9][0][0]+'<br><br>'+e[9][0][1]+'</div>':'')+'</details>','english-v4.html');
 if(d>=5){const x=pick(d%2?YB:NB,d*2);html+=box('多人同場補答｜1題','<div class="box"><b>'+x[4]+'</b></div><div class="box blue"><b>練法</b><br>假設前一位已講主要答案，你只能補一個新的分析層：利害關係人、短長期、成本／風險、證據或限制。回答45–60秒。</div>','group-v4.html')}
 if(d>=17) html+=box('分校Mock｜1輪','<p>今天至少跑一輪北大或交大模擬。先計時，不要邊看答案邊答。</p>','mock-v4.html');
 out.innerHTML=html;
}
draw();
});