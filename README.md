# Line Workers Template

[![Code Style: Rrettier][]][prettier]

「開箱即用」的 Line 官方帳號 Webhook 自動回覆

## ✨特色

- Signature 消息來源安全驗證
- 訊息回覆
- 已讀標記
- 訊息載入動畫

## ⚙️配置

|     類型      |            名稱            |                 配置                 | 用途 | 備註 |
| :-----------: | :------------------------: | :----------------------------------: | :--: | :--: |
| Secrets Store |    LINE_CHANNEL_SECRET     |    Line 官方帳號的 channel secret    | 驗證 |      |
| Secrets Store | LINE_CHANNEL_ACCESS_TOKENt | Line 官方帳號的 channel access token | 驗證 |      |

## 🖊️客製化方式

修改 `src/utils/handleEvent.ts`

<!-- 網址們 -->

[Code Style: Rrettier]: https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg?style=flat-square
[prettier]: https://github.com/prettier/prettier
