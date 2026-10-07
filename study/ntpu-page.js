window.addEventListener("DOMContentLoaded",function(){
  const root=document.getElementById("app");
  const BANK=[...NTPU_V4,...NTPU_V6_EXTRA];
  const A=BANK.filter(x=>x[3]==="A");
  const BC=BANK.filter(x=>x[3]!=="A");
  function makeCard(x){
    const d=document.createElement("details");
    const s=document.createElement("summary");
    s.textContent=x[0]+"｜"+x[1]+"｜"+x[4];
    d.appendChild(s);
    const parts=[
      ["教授在看什麼",x[5]],
      ["核心概念要懂什麼",V5_DEPTH.concept(x[1],x[4])],
      ["回答骨架",x[6]],
      ["你的完整回答",x[7]],
      ["如果前面的人已經答過",V5_DEPTH.supplement(x[1])],
      ["常見失分點",V5_DEPTH.mistake(x[1])]
    ];
    parts.forEach((p,i)=>{
      const box=document.createElement("div");
      box.className="box"+(i===2?" blue":"");
      box.innerHTML="<b>"+p[0]+"</b><br>"+p[1];
      d.appendChild(box);
    });
    const extras=[...(x[8]||[]),...V5_DEPTH.extra(x[1]),V5_DEPTH.pressure(x[1])];
    if(extras.length){
      const box=document.createElement("div");
      box.className="box warm";
      box.innerHTML="<b>追問攻防</b>"+extras.map(z=>"<p><b>"+z[0]+"</b><br>"+z[1]+"</p>").join("");
      d.appendChild(box);
    }
    if(x[9]&&String(x[9]).startsWith("http")){const a=document.createElement("a");a.className="src";a.target="_blank";a.rel="noopener";a.href=x[9];a.textContent="查看考生心得來源 ↗";d.appendChild(a);}
    return d;
  }
  const hero=document.createElement("header");hero.className="hero";
  hero.innerHTML='<div class="eyebrow">NTPU BUSINESS ADMINISTRATION</div><h1>北大企管｜你、研究、判斷、臨場</h1><p>近年核心不是背大量時事，而是多人同場下快速講清楚自己、研究與管理判斷。</p>';
  root.appendChild(hero);
  const intro=document.createElement("section");intro.className="card";
  intro.innerHTML="<h3>能力地圖</h3><ol><li><b>自我與動機</b>：自介、讀研原因、校系適配。</li><li><b>研究準備度</b>：研究問題、方法、量化經驗、可行性。</li><li><b>多人同場表達</b>：第一答完整、後答補新角度。</li><li><b>管理判斷</b>：AI、人資、數位轉型、商業情境。</li><li><b>備審深追</b>：工作轉換、主管經驗、專題與學習規劃。</li></ol>";
  root.appendChild(intro);const wb=document.createElement("section");wb.className="card";wb.innerHTML='<span class="chip">原 Word 題庫</span><h3>北大舊題已完整補回</h3><p>N 31題＋P壓力20題＋G情境18題都在完整題庫。</p><a class="practice" href="word-bank.html?group=N">北大 N 題 →</a> <a class="practice" href="word-bank.html?group=P">壓力 P 題 →</a>';root.appendChild(wb);
  const j=document.createElement("div");j.className="jump";j.innerHTML='<a href="#a">A級必讀</a><a href="#english">英文備援</a><a href="#bc">B/C級</a><a href="#method">回答法</a>';root.appendChild(j);
  [["a","A級｜近年直接且高度相關",A],["bc","B/C級｜補廣度與備援",BC]].forEach(sec=>{
    const section=document.createElement("section");section.className="section";section.id=sec[0];
    const h=document.createElement("h2");h.textContent=sec[1]+"（"+sec[2].length+"題）";section.appendChild(h);
    sec[2].forEach(x=>section.appendChild(makeCard(x)));root.appendChild(section);
  });
  const es=document.createElement("section");es.className="section";es.id="english";es.innerHTML='<h2>北大英文備援（'+NTPU_ENGLISH_BACKUP.length+'題）</h2><div class="card"><p><b>先講清楚：</b>北大不是固定每年都有英文關。114有考生回憶出現英文回答要求；115公開心得也有兩關都中文的組別，所以這區是「一定要能備援」，不是把英文假裝成每年固定主考。</p><p class="meta">語音只念英文題目；答案預設收起。先自己回答，再展開參考。</p></div>';NTPU_ENGLISH_BACKUP.forEach(x=>{const d=document.createElement("details");const q=document.createElement("summary");q.innerHTML='<span class="chip">'+x.type+'</span><div>'+x.qEn+'</div><div class="small">'+x.qZh+'</div>';d.appendChild(q);const a=document.createElement("div");a.className="box blue";a.innerHTML='<b>英文口說回答</b><br>'+x.answerEn;d.appendChild(a);const z=document.createElement("div");z.className="box";z.innerHTML='<b>中文理解｜你其實在講什麼</b><br>'+x.answerZh;d.appendChild(z);if(x.source){const l=document.createElement("a");l.className="src";l.target="_blank";l.rel="noopener";l.href=x.source;l.textContent="查看114考生回憶來源 ↗";d.appendChild(l)}es.appendChild(d)});root.appendChild(es);
  const m=document.createElement("section");m.className="section";m.id="method";
  m.innerHTML='<h2>北大答題規則</h2><div class="card"><p><b>個人／研究題：</b>把自己的內容講準，不要為了和別人不同而改答案。</p><p><b>共同題第一答：</b>立場 → 2個理由 → 例子／機制 → 結論。</p><p><b>共同題後答：</b>承接一句 → 新增面向 → 結論。</p><p><b>教授追問：</b>先直接回答追問，再補理由。</p><p><b>時間：</b>一般題60–90秒；研究題準備20秒、60秒、90秒三版本。</p></div>';
  root.appendChild(m);
});