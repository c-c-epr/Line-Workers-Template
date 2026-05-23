# Line Workers Template

Language: [English](README.md) | [繁體中文](README.zh-TW.md)

> 本文件與 `README.md` 對齊維護。

「開箱即用」的 Line 官方帳號 Webhook Cloudflare Workers 模板

[![Deploy to Cloudflare]][Cloudflare]

[![Code Style: Prettier]][Prettier]

## ✨特色

- Signature 消息來源安全驗證
- 訊息回覆
- 已讀標記
- 訊息載入動畫

## 🖊️模板使用教學

1. 複製模板
   1. `Use this template`=>`Create a new repository`
   2. 填好`Repository name`和其他倉庫資訊
2. 修改程式
   1. 訊息處理路由`src/eventRouter.ts`
   2. 配置檔案`wrangler.toml`
      1. `name` 2. `secrets`
         1. `LINE_CHANNEL_SECRET`
         2. `LINE_CHANNEL_ACCESS_TOKEN`
            -> 可使用 `wrangler secret put` 或在 Cloudflare 控制台中設定
3. 部署
   1. Cloudflare
   2. `Workers 和 Pages`
   3. `建立應用程式`
   4. `Continue with GitHub`
   5. 填好資訊

## ⚙️配置

|  類型   |           名稱            |                 配置                 | 用途 |
| :-----: | :-----------------------: | :----------------------------------: | :--: |
| Secrets |    LINE_CHANNEL_SECRET    |    Line 官方帳號的 channel secret    | 驗證 |
| Secrets | LINE_CHANNEL_ACCESS_TOKEN | Line 官方帳號的 channel access token | 驗證 |

<!-- 網址們 -->
<!-- Cloduflare -->

[Deploy to Cloudflare]: https://deploy.workers.cloudflare.com/button
[Cloudflare]: https://deploy.workers.cloudflare.com/?url=https://github.com/c-c-epr/line-workers-template

<!-- Prettier -->

[Code Style: Prettier]: https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg?style=flat-square
[Prettier]: https://github.com/prettier/prettier
