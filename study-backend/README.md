# Study AI backend

Vercel 專案 Root Directory 請設為 `study-backend`。

Environment Variables:
- `OPENAI_API_KEY`：OpenAI API key，只放 Vercel，不放前端。
- `STUDY_APP_SECRET`：自訂一組網站存取密碼。
- `ALLOWED_ORIGIN`：預設可用 `https://cc888888-boop8.github.io`。
- `OPENAI_MODEL`：可省略；預設 `gpt-6.1-sol`。

部署後 endpoint 為：
`https://<your-vercel-domain>/api/chat`

再把該網址填進 Study Sprint 的 `AI 連線設定` 即可。