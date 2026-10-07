const ALLOWED_DEFAULT="https://cc888888-boop8.github.io";

function cors(origin){
  const allowed=(process.env.ALLOWED_ORIGIN||ALLOWED_DEFAULT).split(",").map(x=>x.trim()).filter(Boolean);
  const ok=origin&&allowed.some(x=>origin===x)||(origin&&/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
  return {
    "Access-Control-Allow-Origin":ok?origin:allowed[0]||ALLOWED_DEFAULT,
    "Access-Control-Allow-Methods":"POST,OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type,X-Study-Secret",
    "Vary":"Origin",
    "Content-Type":"application/json; charset=utf-8"
  };
}
function outputText(data){
  if(typeof data?.output_text==="string")return data.output_text.trim();
  const out=[];
  for(const item of data?.output||[])for(const c of item?.content||[])if(c?.type==="output_text"&&c?.text)out.push(c.text);
  return out.join("\n").trim();
}
function cleanHistory(h){
  return Array.isArray(h)?h.slice(-12).map(x=>({role:x?.role==="assistant"?"assistant":"user",content:String(x?.content||"").slice(0,3500)})):[];
}
export default async function handler(req,res){
  const origin=req.headers.origin||"";
  const headers=cors(origin);Object.entries(headers).forEach(([k,v])=>res.setHeader(k,v));
  if(req.method==="OPTIONS")return res.status(204).end();
  if(req.method!=="POST")return res.status(405).json({error:"Only POST is allowed."});
  if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"OPENAI_API_KEY 尚未設定。"});
  const required=process.env.STUDY_APP_SECRET||"";
  if(required&&req.headers["x-study-secret"]!==required)return res.status(401).json({error:"網站存取密碼不正確。"});
  const body=req.body||{},ctx=body.context||{},message=String(body.message||"").trim();
  if(!message)return res.status(400).json({error:"問題不能是空白。"});
  if(message.length>6000)return res.status(400).json({error:"這次問題太長，請縮短後再問。"});
  const history=cleanHistory(body.history);
  const system=`你是 Jenna 的研究所面試 AI 家教。她是初學者，不能假設她懂統計、研究方法或商管理論。

固定背景：
- 目標：國立臺北大學企管碩士班、國立陽明交通大學經營管理研究所。
- 大學：銘傳大學數位媒體設計。
- 經歷：影音／創意製作約4年並曾任主管；Meta廣告投放約2年半；目前在 MyCard 做行銷與創意／會員活動。
- 研究題目：從會員行為洞察到創意溝通決策：既有參與型態與關係策略對會員持續參與意向之影響。
- 英文：以能自然說出口為優先，不追求艱深單字。

回答規則：
1. 預設使用繁體中文，而且一定要像面試口說，不要像論文或AI報告。
2. 她說「看不懂」時：先用一句超白話解釋，再用生活例子，再套回她的研究／工作，最後才補正式名詞。
3. 研究／統計：一定講清楚「這是什麼、為什麼需要、在她研究裡怎麼用、教授會怎麼追、常見錯誤」。
4. 評她的回答時，不要只說好不好；指出答題是否切題、邏輯漏洞、過度宣稱、教授可追問點，最後給一個自然口說修正版。
5. 英文題：先給簡單自然、可說出口的英文；再給繁中意思；必要時列3個一定要會的句型。不要用過長句子。
6. 如果題卡裡有參考答案，不要只是重複。要解釋背後原因與更深一層。
7. 若問題涉及最新時事、法規、招生規則而目前沒有即時網路證據，明確說需要查證，不要編造。
8. 教授模擬時：一次只問一題；如果使用者還沒回答，不要先把答案洩漏。
9. 不要一次塞太多專有名詞。專有名詞第一次出現要用白話括號解釋。
10. 保持具體，優先用 Jenna 的設計→主管→廣告數據→MyCard 這條經歷來舉例。`;
  const contextText=`【目前頁面】${String(ctx.page||"").slice(0,80)}
【目前題目】${String(ctx.question||"").slice(0,1800)}
【這題是否英文】${ctx.is_english?"是":"否"}
【題卡內參考答案／追問】${String(ctx.reference||"").slice(0,8500)}
【Jenna 自己的筆記／回答】${String(ctx.user_note||"").slice(0,2800)}`;
  const historyText=history.map(x=>(x.role==="assistant"?"AI":"Jenna")+": "+x.content).join("\n\n");
  const input=`${contextText}

【這一題先前對話】
${historyText||"（無）"}

【Jenna 現在問】
${message}`;
  try{
    const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+process.env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-6.1-sol",instructions:system,input,max_output_tokens:1600,store:false})});
    const data=await r.json();
    if(!r.ok)return res.status(r.status).json({error:data?.error?.message||"OpenAI API 回覆失敗。"});
    const answer=outputText(data);
    if(!answer)return res.status(502).json({error:"OpenAI 沒有回傳可顯示的文字。"});
    return res.status(200).json({answer});
  }catch(e){return res.status(500).json({error:"AI 後端發生錯誤："+(e?.message||"unknown error")});}
}