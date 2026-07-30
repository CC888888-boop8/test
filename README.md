# 天聖宮 Pages CMS 可編輯版

## 網站檔案

- `index.html`：公開網站。
- `admin.html`：平台入口與五種裝置預覽。
- `content/site.json`：全部可編輯文字、圖片、影片與連結。
- `.pages.yml`：Pages CMS 後台欄位設定。
- `PAGES-CMS-設定備份.yml`：Configuration 空白時可直接複製貼上的可見備份。
- `site-content-loader.js`：將後台內容套用到網站。
- `操作手冊.md`：GitHub、Cloudflare Pages、Pages CMS 與裝置預覽操作。

## Cloudflare Pages 設定

- Framework preset：None
- Build command：留空
- Build output directory：`.`
- Production branch：`main`

## 編輯後台

前往 <https://app.pagescms.org/>，使用 GitHub 登入並選擇此資料庫。

網站部署後，可在公開網址後加 `/admin.html` 開啟管理與裝置預覽頁。
