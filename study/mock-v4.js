window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const NB=[...NTPU_V4,...NTPU_V6_EXTRA],YB=[...NYCU_V4,...NYCU_V6_EXTRA];
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">REALISTIC MOCK V5</div><h1>雙校分開模擬｜每題都有參考答案</h1><p>先計時回答，再展開參考。北大與交大分開，不混校、不自由團討。</p><div class="tiles"><button class="tile" id="bn"><span class="tile-icon">N</span>北大模擬<small>多人同場個答</small></button><button class="tile" id="by"><span class="tile-icon">Y</span>交大模擬<small>中英文兩關</small></button></div>';root.appendChild(hero);
const out=document.createElement("div");root.appendChild(out);
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function qcard(t,q,n,answer,cat){
 const d=document.createElement("details");const s=document.createElement("summary");s.innerHTML='<span class="chip">'+t+'</span><div>'+q+'</div><div class="small">'+(n||"先自己回答，再展開參考。")+'</div>';d.appendChild(s);
 const a=document.createElement("div");a.className="box blue";a.innerHTML="<b>參考答法</b><br>"+answer;d.appendChild(a);
 const c=document.createElement("div");c.className="box";c.innerHTML="<b>核心概念</b><br>"+V5_DEPTH.concept(cat,q);d.appendChild(c);
 const p=V5_DEPTH.pressure(cat);const w=document.createElement("div");w.className="box warm";w.innerHTML="<b>壓力追問</b><br><b>"+p[0]+"</b><br>"+p[1];d.appendChild(w);
 return d;
}
function ntpu(){
 out.innerHTML="";
 const common=NB.filter(x=>/搶答|多人同場/.test(x[2])),research=NB.filter(x=>/研究/.test(x[1])),personal=NB.filter(x=>/個人|動機|自我/.test(x[1]));
 const a=pick(common),b=pick(common),r=pick(research),p=pick(personal);
 out.appendChild(qcard("北大 Round 1｜自介 60秒","請用60秒自我介紹。","背景→現在→為何讀研→研究方向。",NB[0][7],"個人／研究"));
 out.appendChild(qcard("Round 2｜共同題 60–90秒",a[4],"假設前面已有一人回答，你必須補新角度。",a[7],a[1]));
 out.appendChild(qcard("Round 3｜共同題 60–90秒",b[4],"先立場，再講管理機制。",b[7],b[1]));
 out.appendChild(qcard("Round 4｜研究 30–60秒",r[4],"研究問題→方法→價值→限制。",r[7],r[1]));
 out.appendChild(qcard("Round 5｜備審深追 60秒",p[4],"只能用真實經歷。",p[7],p[1]));
}
function nycu(){
 out.innerHTML="";
 const en=YB.filter(x=>x[2].includes("英文")||x[1].startsWith("英文")),stats=YB.filter(x=>/統計|研究方法/.test(x[1])),mgmt=YB.filter(x=>!x[2].includes("英文")&&!/統計|研究方法/.test(x[1]));
 const e=pick(en),s=pick(stats),m1=pick(mgmt),m2=pick(mgmt);
 out.appendChild(qcard("交大英文關｜Self-intro 60秒","Tell us about yourself in one minute.","簡單自然，不追求難字。","I studied Digital Media Design and later worked in creative production, digital advertising, and marketing. These experiences helped me connect content, data, and business decisions. I now want to strengthen my research methods and management knowledge, which is why I am applying to graduate school.","個人"));
 out.appendChild(qcard("英文抽題 90–120秒",e[4],e[8],e[7],e[1]));
 out.appendChild(qcard("中文關｜統計／研究 45–75秒",s[4],"定義→例子→用途→限制。",s[8],s[1]));
 out.appendChild(qcard("中文關｜管理／財務 60–90秒",m1[4],"先回答問題，不要先講背景。",m1[8],m1[1]));
 out.appendChild(qcard("中文關｜第二題 60–90秒",m2[4],"準備被教授抓一句話往下追。",m2[8],m2[1]));
}
document.getElementById("bn").onclick=ntpu;document.getElementById("by").onclick=nycu;ntpu();
});