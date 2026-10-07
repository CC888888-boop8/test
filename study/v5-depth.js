window.V5_DEPTH={
concept:function(cat,q){
 if(/研究/.test(cat))return "先分清楚研究問題、構念、變項與方法。教授不是只想聽題目，而是要確認你知道『要解釋什麼、怎麼量、憑什麼這樣推論』。";
 if(/統計/.test(cat))return "不要背公式。先說這個統計概念在回答什麼問題，再說適用條件、例子與不能推出什麼。";
 if(/AI|科技|GPT/.test(cat))return "不要從工具功能開始。先拆價值鏈／任務，再談成本、收益、風險、競爭與治理，最後才下結論。";
 if(/財務|經濟|M&A/.test(cat))return "把新聞或情境翻成現金流、資本成本、風險、估值與資源配置問題；不要只講『好／不好』。";
 if(/ESG|永續/.test(cat))return "不要把ESG當道德口號。要回到具體專案、現金流、外部性、法規與聲譽風險。";
 if(/人資|領導|團隊|世代/.test(cat))return "避免人格標籤。先界定情境，再談制度、誘因、能力、溝通與可觀察行為。";
 if(/國際|全球化/.test(cat))return "不要列新聞。選一條主軸，說清楚它如何透過成本、需求、供應、資本或政策影響企業決策。";
 if(/動機|自我|個人|學習|校系/.test(cat))return "教授要的是一致性與自我認知。答案要能被你的真實經歷證明，而不是形容詞堆疊。";
 return "先定義問題，再拆影響機制、利害關係人、短長期取捨與可驗證依據，最後才做管理判斷。";
},
supplement:function(cat){
 if(/研究|統計/.test(cat))return "如果前面的人已經把定義講完，不要硬換一個錯定義；改補『一個具體例子＋它能回答什麼＋它不能回答什麼』。";
 if(/AI|科技|GPT/.test(cat))return "如果前面已談效率，就補商業模式、治理或風險；如果已談風險，就補真正的收益條件與衡量方式。";
 if(/財務|經濟|M&A/.test(cat))return "如果前面只講成本，補現金流與資本成本；如果只講估值，補執行與整合風險。";
 if(/人資|領導|團隊|世代/.test(cat))return "如果前面都在講人格或態度，補制度、工作設計、誘因或可觀察行為。";
 if(/國際|全球化/.test(cat))return "如果前面在講政治事件本身，補企業層級的成本、供應、投資與風險管理。";
 return "不要重複前一個人的結論。先承接一句，再補一個新的分析層次：另一利害關係人、短期／長期、風險／收益或可執行方案。";
},
mistake:function(cat){
 if(/研究/.test(cat))return "把工作觀察直接當研究證據；把意向說成實際行為；說『顯著就代表很重要』；研究方法與問題對不起來。";
 if(/統計/.test(cat))return "只背定義；把相關說成因果；把p-value說成假設為真的機率；不知道方法的限制。";
 if(/AI|科技|GPT/.test(cat))return "只說AI很方便／會取代人；沒有商業機制；把公司新聞當結論；完全不談治理與成本。";
 if(/財務|經濟|M&A/.test(cat))return "只用股價或營收判斷；忽略現金流、資本成本、整合與風險；把高成長直接等同高價值。";
 if(/人資|領導|團隊|世代/.test(cat))return "套世代刻板印象；只說多溝通；沒有制度與行為層次；沒有自己的真實例子。";
 return "開頭繞太久、只表態不解釋機制、講很多名詞但沒有例子、最後沒有回到題目。";
},
pressure:function(cat){
 if(/研究/.test(cat))return ["教授：『你這還是企劃案，不像研究。』","我會把企劃問題改寫成可檢驗的研究問題：先定義理論構念與假設，再說測量、樣本與分析方法。工作經驗只提供問題來源，不會當成證據本身。"];
 if(/統計/.test(cat))return ["教授：『你只是背定義，真的懂嗎？』","我會立刻用我的會員研究舉例，說這個方法在什麼資料條件下使用、它能回答哪個問題、以及它不能支持哪種因果結論。"];
 if(/AI|科技|GPT/.test(cat))return ["教授：『你講的每家公司都可以套，沒有分析。』","我會把答案收斂到一個具體機制，例如成本結構、切換成本、資料優勢、算力依賴或治理風險，再說我會用什麼指標驗證。"];
 if(/財務|經濟|M&A/.test(cat))return ["教授：『你只是講新聞，財務邏輯在哪？』","我會把事件轉成現金流、折現率、資本成本、ROIC或整合風險，說清楚它透過哪個變數影響企業價值。"];
 if(/人資|領導|團隊|世代/.test(cat))return ["教授：『這不就是叫大家多溝通？』","我會把答案落到可執行制度，例如目標與權責、回饋頻率、工作設計、升遷／獎酬或分工規則，而不是停在態度層。"];
 return ["教授：『你的答案太表面。』","我會補一層機制：先說誰受到影響、透過什麼成本／誘因／資訊改變，再說短期與長期可能不同，最後提出一個可驗證或可執行的判斷。"];
},
extra:function(cat){
 if(/研究/.test(cat))return [["教授再問：『你怎麼知道這個變項真的量到你說的概念？』","我會從操作化、量表來源、前測與信效度回答，不能只說『問卷有問』。"],["教授再問：『如果結果不顯著？』","如實報告，查看估計值、信賴區間、power與設計品質，不會為了顯著去事後亂改模型。"]];
 if(/統計/.test(cat))return [["教授再問：『什麼情況下這個方法不能用？』","我要從資料尺度、獨立性、模型假設與研究設計判斷，而不是只說樣本太少。"],["教授再問：『這能證明因果嗎？』","除非有足夠的識別策略，例如隨機分派或可信的準實驗設計，否則統計關係本身不能自動等於因果。"]];
 if(/AI|科技|GPT/.test(cat))return [["教授再問：『企業為什麼不是全部導入？』","因為效益取決於use case，還要考慮整合成本、錯誤成本、資料治理、員工採用與責任邊界。"],["教授再問：『你會看什麼數字？』","至少看成本節省／收入提升、採用率、品質錯誤、單位經濟與後續風險，而不是只看使用量。"]];
 if(/財務|經濟|M&A/.test(cat))return [["教授再問：『高成長為什麼不一定值得投資？』","因為價值取決於成長需要多少資本、毛利與現金流、風險以及你付的價格。"],["教授再問：『你會怎麼做敏感度分析？』","抓最關鍵的2–3個假設，例如需求、價格、使用率、成本或折現率，觀察結論在合理區間內是否仍成立。"]];
 if(/人資|領導|團隊|世代/.test(cat))return [["教授再問：『你怎麼知道問題真的是人，不是制度？』","先看流程、權責、KPI與資源是否合理，再看個人能力與意願，避免一開始就把問題人格化。"],["教授再問：『如果對方不接受你的做法？』","先確認分歧是目標、資訊還是利益，再選擇補資料、重談分工或升級決策，不會只說再溝通。"]];
 return [["教授再問：『你的判斷依據是什麼？』","我會指出需要的資料、比較基準或可觀察指標，而不是只靠直覺。"],["教授再問：『反方怎麼說？』","我會主動說明答案成立的條件與代價，避免把管理問題答成單一路線。"]];
}
};
window.V5_DEPTH_EN={
supplement:function(cat){
 if(/research|研究|statistics|統計/i.test(cat))return "If someone already gave the definition, add a concrete example, explain what the method can answer, and state one limitation.";
 if(/AI|科技|GPT/i.test(cat))return "If someone already discussed efficiency, add the business model, governance, or risk side. If they focused on risk, add the conditions under which the benefit is real.";
 if(/finance|財務|經濟|M&A/i.test(cat))return "If others focused on cost, add cash flow or cost of capital. If they focused on valuation, add execution and integration risk.";
 if(/management|人資|領導|團隊|世代/i.test(cat))return "If others focused on personality, add structure: incentives, job design, decision rights, or measurable behavior.";
 return "Briefly connect to the previous answer, then add one new layer such as another stakeholder, a short-term versus long-term trade-off, or a measurable decision criterion.";
},
mistake:function(cat){
 if(/research|研究|statistics|統計/i.test(cat))return "Do not only recite a definition. Give an example, explain the purpose, and be clear about what the method cannot prove.";
 if(/AI|科技|GPT/i.test(cat))return "Avoid saying only that AI is useful or dangerous. Explain the business mechanism, cost, risk, and how you would measure the result.";
 if(/finance|財務|經濟|M&A/i.test(cat))return "Do not equate high growth with high value. Mention cash flow, capital needs, risk, and the price paid.";
 return "Do not spend too long on background. Answer the question first, explain why, give one example, and end with a clear conclusion.";
},
pressure:function(cat){
 if(/research|研究/i.test(cat))return ["Professor: Your answer still sounds like a business proposal, not research. What makes it research?","I would turn the practical problem into a testable research question. That means defining the constructs, explaining the theoretical relationship, specifying how I will measure them, and choosing a design that supports the kind of conclusion I want to make. My work experience gives me the problem, but it is not the evidence."];
 if(/statistics|統計/i.test(cat))return ["Professor: You are only repeating a definition. Do you really understand it?","I would explain it with my own research. I would say when the method is appropriate, what question it answers, what assumptions matter, and what conclusion it still cannot support."];
 if(/AI|科技|GPT/i.test(cat))return ["Professor: This sounds generic. What is your actual business analysis?","I would narrow the answer to one mechanism, such as cost structure, switching costs, data advantage, computing dependence, or governance risk, and then explain which metric would show whether that mechanism is actually important."];
 if(/finance|財務|經濟|M&A/i.test(cat))return ["Professor: You are describing the news. Where is the financial logic?","I would translate the event into cash flow, cost of capital, return on invested capital, or integration risk, and explain exactly how it changes firm value."];
 if(/management|人資|領導|團隊|世代/i.test(cat))return ["Professor: Isn't that just saying people should communicate more?","I would make it operational: clarify goals and decision rights, redesign the workflow, adjust incentives or feedback, and define what behavior or outcome should improve."];
 return ["Professor: Your answer is still too superficial. Can you go one level deeper?","I would explain who is affected, through what mechanism, what the trade-off is, and what evidence or metric I would use before making the final decision."];
},
extra:function(cat){
 if(/research|研究/i.test(cat))return [
  ["How do you know your measure really captures the construct you claim to study?","I would start from the construct definition and existing validated scales, then use pretesting and reliability and validity evidence. A stable scale is not enough if it is measuring the wrong thing."],
  ["What if your main result is not statistically significant?","I would report it honestly, examine the estimate and confidence interval, check power and measurement quality, and revisit the theory. I would not keep changing the model just to get significance."]
 ];
 if(/statistics|統計/i.test(cat))return [
  ["When would this method be inappropriate?","I would check the measurement scale, independence of observations, model assumptions, and the research design. The answer depends on the method, not only on sample size."],
  ["Can this method prove causation?","Not by itself. Causal interpretation requires a credible identification strategy, such as random assignment or a strong quasi-experimental design."]
 ];
 if(/AI|科技|GPT/i.test(cat))return [
  ["Why shouldn't a company adopt AI everywhere?","Because the value depends on the use case. Firms also need to consider integration cost, error cost, data governance, employee adoption, and accountability."],
  ["What numbers would you monitor?","I would look at cost savings or revenue lift, adoption, error or quality rates, unit economics, and any new risk created by the system."]
 ];
 if(/finance|財務|經濟|M&A/i.test(cat))return [
  ["Why can high growth still destroy value?","Because growth can require heavy capital and still produce returns below the cost of capital. Revenue growth alone does not guarantee value creation."],
  ["How would you do a sensitivity analysis?","I would identify the two or three assumptions that drive the conclusion, such as demand, price, utilization, cost, or discount rate, and test whether the decision still holds across reasonable ranges."]
 ];
 return [
  ["What evidence would change your mind?","I would define the metric or comparison that matters before making the decision, so the conclusion is not based only on intuition."],
  ["What is the strongest counterargument?","I would state the main condition under which my recommendation might fail, then explain how I would monitor that risk."]
 ];
}
};