window.addEventListener("DOMContentLoaded",function(){
  const root=document.getElementById("app");
  const BANK=[...NYCU_V4,...NYCU_V6_EXTRA];
  const stats=["統計／平均數","統計／隨機抽樣","統計／遺漏變數","統計／虛無假設","研究方法／信效度","統計／專業","統計／共變異數卡方"];
  function isEnglish(x){return /英文/.test(x[1])||x[1].includes("AI")||x[1].includes("ESG")||x[1].includes("全球化")}
  function isEnglishQuestion(q){const la=(q.match(/[A-Za-z]/g)||[]).length,zh=(q.match(/[\u4e00-\u9fff]/g)||[]).length;return la>=14&&zh<=2}
  function makeCard(x){
    const d=document.createElement("details");
    const s=document.createElement("summary");s.textContent=x[0]+"｜"+x[1]+"｜"+x[4];d.appendChild(s);
    [["教授在看什麼",x[5]],["核心概念要懂什麼",V5_DEPTH.concept(x[1],x[4])],["回答骨架",x[6]],["English answer",x[7]],["中文理解／回答",x[8]],["如果前面的人已經答過",isEnglishQuestion(x[4])?V5_DEPTH_EN.supplement(x[1]):V5_DEPTH.supplement(x[1])],["常見失分點",isEnglishQuestion(x[4])?V5_DEPTH_EN.mistake(x[1]):V5_DEPTH.mistake(x[1])]].forEach((p,i)=>{
      const box=document.createElement("div");box.className="box"+(i===3?" blue":"");box.innerHTML="<b>"+p[0]+"</b><br>"+p[1];d.appendChild(box);
    });
    const en=isEnglishQuestion(x[4]);const depth=en?V5_DEPTH_EN:V5_DEPTH;const qs=[...(x[9]||[]),...depth.extra(x[1]),depth.pressure(x[1])];const box=document.createElement("div");box.className="box warm";box.innerHTML="<b>教授追問攻防</b>"+qs.map(z=>"<p><b>"+z[0]+"</b><br>"+z[1]+"</p>").join("");d.appendChild(box);
    if(x[10]&&String(x[10]).startsWith("http")){const a=document.createElement("a");a.className="src";a.target="_blank";a.rel="noopener";a.href=x[10];a.textContent="查看考生心得來源 ↗";d.appendChild(a);}
    return d;
  }
  const hero=document.createElement("header");hero.className="hero";hero.innerHTML='<div class="eyebrow">NYCU INSTITUTE OF BUSINESS AND MANAGEMENT</div><h1>陽明交大經管｜英文、統計、商管廣度、深追</h1><p>近年不是只考AI，而是英文商業論述＋統計研究方法＋管理／財務／經濟廣度，再由教授一路追問。</p>';root.appendChild(hero);
  const intro=document.createElement("section");intro.className="card";intro.innerHTML="<h3>能力地圖</h3><ol><li><b>英文商業論述</b>：90–120秒說立場、機制、例子與限制。</li><li><b>統計研究方法</b>：定義→例子→用途→限制。</li><li><b>商管廣度</b>：管理、人資、財務、經濟、ESG、商業模式。</li><li><b>科技AI</b>：產業鏈、企業營運、經濟效果。</li><li><b>深追能力</b>：教授會抓你一句話追下去，每個名詞都要真的懂。</li></ol>";root.appendChild(intro);const wb=document.createElement("section");wb.className="card";wb.innerHTML='<span class="chip">原 Word 題庫</span><h3>交大舊題已完整補回</h3><p>Y 40題＋E英文10題＋M商管24題＋X英文研究12題都可直接練。</p><a class="practice" href="word-bank.html?group=Y">交大 Y 題 →</a> <a class="practice" href="word-bank.html?group=E">英文 E 題 →</a>';root.appendChild(wb);
  const groups=[["英文／科技／ESG",BANK.filter(isEnglish)],["統計／研究方法",BANK.filter(x=>stats.includes(x[1]))],["管理／財務／經濟",BANK.filter(x=>!isEnglish(x)&&!stats.includes(x[1]))]];
  groups.forEach((g,i)=>{const section=document.createElement("section");section.className="section";section.id="g"+i;const h=document.createElement("h2");h.textContent=g[0]+"（"+g[1].length+"題）";section.appendChild(h);g[1].forEach(x=>section.appendChild(makeCard(x)));root.appendChild(section);});
});