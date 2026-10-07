window.addEventListener("DOMContentLoaded",function(){
const root=document.getElementById("app");
const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">REALISTIC MOCK V4</div><h1>雙校分開模擬｜不混題、不自由團討</h1><p>北大模擬自介、共同題、研究與備審深追；交大模擬英文抽題、統計／研究方法、管理／財務與教授追問。</p><div class="tiles"><button class="tile" id="bn"><span class="tile-icon">🏫</span>北大模擬<small>多人同場個答</small></button><button class="tile" id="by"><span class="tile-icon">🎯</span>交大模擬<small>中英文兩關</small></button></div>';root.appendChild(hero);
const out=document.createElement("div");root.appendChild(out);
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function card(t,q,n){return '<section class="card"><span class="chip">'+t+'</span><div style="font-size:17px;font-weight:800;margin-top:7px">'+q+'</div>'+(n?'<div class="small" style="margin-top:8px">'+n+'</div>':'')+'</section>'}
function ntpu(){
 const common=NTPU_V4.filter(x=>/搶答|多人同場/.test(x[2])),research=NTPU_V4.filter(x=>/研究/.test(x[1])),personal=NTPU_V4.filter(x=>/個人|動機|自我/.test(x[1]));
 const a=pick(common),b=pick(common),r=pick(research),p=pick(personal);
 out.innerHTML=card("北大 Round 1｜自介 60秒","請用60秒自我介紹。","背景→現在→為何讀研→研究方向。")+card("Round 2｜共同題 60–90秒",a[4],"假設你不是第一個回答的人，必須補新角度。")+card("Round 3｜共同題 60–90秒",b[4],"先立場，再講管理機制。")+card("Round 4｜研究 30–60秒",r[4],"研究問題→方法→價值→限制。")+card("Round 5｜備審深追 60秒",p[4],"只能用自己的真實經歷回答。")+card("Round 6｜壓力追問","教授說：『你剛才還是像在講工作心得，不像研究生。』請補出研究／管理分析。","用理論、方法、證據或可驗證假設補強。");
}
function nycu(){
 const en=NYCU_V4.filter(x=>x[2].includes("英文")||x[1].startsWith("英文")),stats=NYCU_V4.filter(x=>/統計|研究方法/.test(x[1])),mgmt=NYCU_V4.filter(x=>!x[2].includes("英文")&&!/統計|研究方法/.test(x[1]));
 const e=pick(en),s=pick(stats),m1=pick(mgmt),m2=pick(mgmt);
 out.innerHTML=card("交大英文關｜Self-intro 60秒","Tell us about yourself in one minute.","簡單、自然，不追求難字。")+card("英文抽題 90–120秒",e[4],e[8])+card("英文追問 30–45秒",e[9].length?e[9][0][0]:"Please explain your reasoning further.","先一句結論，再補機制。")+card("中文關｜統計／研究 45–75秒",s[4],"定義→例子→用途→限制。")+card("中文關｜管理／財務 60–90秒",m1[4],"先回答問題，不要先講背景。")+card("中文關｜第二題 60–90秒",m2[4],"準備被教授抓一句話往下追。");
}
document.getElementById("bn").onclick=ntpu;document.getElementById("by").onclick=nycu;ntpu();
});